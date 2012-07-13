# coding=utf-8

import random, json
from datetime import datetime
from django.utils.translation import ugettext_lazy as _

from config import *
from ..util import card_count_of

def study(request, author, deck_slug):
	# Initialize values that may or may not be used later
	heading    = ''
	time_taken = 0
	
	template            = 'study.html'
	title               = _('Now Studying') % {}
	content_class       = 'study-page'
	toolbar_class       = 'is-muted'
	minimalist_menubar  = True
	back_to_deck        = False
	cancel_back_to_deck = True
	
	
	
	# Get the deck object and total number of cards in this deck
	deck = Deck.objects.get(slug=deck_slug, author__name=author)
	card_count = request.POST.get('card-count', card_count_of(deck))
	
	
	
	# Determine whether a card was flipped
	card_was_flipped = request.POST.get('show-answer', False)
	
	# Determine whether we need to show the next card (this only occurs when a card wasn't flipped)
	show_next_card = request.POST.get('repeat') or request.POST.get('short-review-delay') or request.POST.get('medium-review-delay') or request.POST.get('long-review-delay') or request.POST.get('next')
	
	
	
	# Get and initialize our study options and data
	
	# Get the number of cards to offset by and the randomize seed (these are only set if JS is available)
	card_offset    = int(request.POST.get('offset', 0))
	randomize_seed = int(request.POST.get('randomize-seed', -1))
	
	# Get the start time and time options
	start_time = request.POST.get('start-time', False)
	use_time   = request.POST.get('use-time', '') # Boolean friendly string
	time_limit = float(request.POST.get('time-limit', 0))
	
	# Get the rest of the study options
	randomized   = request.POST.get('randomize', '') # Boolean friendly string
	random_queue = request.POST.get('random-queue')
	use_reverse  = request.POST.get('use-reverse', '') # Boolean friendly string
	repeat_queue = json.loads(request.POST.get('repeat-queue', '[]'))
	
	# If the time the user started studying hasn't been logged yet, set it now
	if not start_time:
		start_time = datetime.strftime(datetime.utcnow(), '%Y-%m-%d %H:%M:%S')
	
	
	
	# Track our progress in this session
	
	current_item = int(request.POST.get('current-item', 0))
	last_item    = int(request.POST.get('last-item', request.POST.get('cards-per-session', 20))) # Total number of cards to study in this session
	order = int(request.POST.get('order', card_offset + 1)) # The card we're currently displaying
	
	# Limit the number of cards to study by the total number in the deck
	if last_item > card_count:
		last_item = card_count
	
	
	
	# If we're randomizing and we don't have a random queue initialzed, create one and randomize the current card
	if randomized and not random_queue:
		random_queue = range(1, card_count+1)
		
		# If a seed was provided, seed the random number generator
		if randomize_seed != -1:
			random.seed(randomize_seed)
		
		random.shuffle(random_queue) # Shuffle the card order
		random_queue = random_queue[card_offset:] # Offset the values by our card offset value
		
		order = random_queue.pop()
	
	
	
	# Add this card to the repeat queue if the user chose to repeat it
	if request.POST.get('repeat'):
		repeat_queue.append(order)
	
	
	
	# Check for conditions that would terminate the study session
	
	# The session ended if the current card is also the last card and we have no cards to repeat
	session_ended = current_item == last_item and not repeat_queue
	# Whether or not time is up
	# @TODO Don't end the session on a time out if the user hasn't seen the answer to this card yet
	# @TODO This is an absolute mess, converting time strings into datetime objects and back and forth
	time_up = use_time and time_limit < (datetime.utcnow() - datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S')).seconds
	
	
	
	# If the only thing left in the session is repeat cards, use the cards from the repeat queue
	if current_item == last_item and repeat_queue:
		# If we need to show a new card...
		if show_next_card:
			# ...get the value of that card's order, but don't remove it from the queue
			# This prevents the session from ending prematurely after the user chooses "show answer" on the last repeated card
			order = int(repeat_queue[0])
		# Otherwise, we're safe to remove the card from the queue
		else:
			repeat_queue.pop(0)
			
	
	
	# If the session ended
	if session_ended or time_up:
		# Randomize the page's heading
		headings = [
			_(u'That’s It!'),
			_(u'You’re Done!'),
			_('Congratulations!'),
			_('Nice Work!')
		]
		random.shuffle(headings)
		
		# Change the template to render, and other template-specific values
		heading             = headings.pop()
		template            = 'completion.html'
		title               = _('Studying Complete')%{}
		content_class       = 'completion-page'
		toolbar_class       = ''
		minimalist_menubar  = False
		back_to_deck        = True
		cancel_back_to_deck = False
		
		# Increment the deck's study count
		deck.times_studied += 1
		deck.save()
		
		# If time is up, show the time limit as the total time
		if time_up:
			total_time = time_limit
		# Otherwise show the amount of time the user spent studying
		else:
			start_time = datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S')
			total_time = (datetime.utcnow() - start_time).seconds
		
		hours, remainder = divmod(total_time, 3600)
		minutes, seconds = divmod(remainder, 60)
		
		# Only show the hours place if the user took that long
		if hours:
			time_taken = '%d:%02d:%02d' % (hours, minutes, seconds)
		else:
			time_taken = '%d:%02d' % (minutes, seconds)	
	# Otherwise, check if we need to show the next card or mark the current one as completed if we're not on repeat cards
	elif current_item != last_item:
		# If a card was flipped, count the card as completed
		if card_was_flipped:
			current_item += 1
		# Otherwise, show the next card
		elif show_next_card:
			if randomized:
				random_queue = json.loads(random_queue)
				order = random_queue.pop()
			else:
				order += 1
	
	
	
	# If this is the first card...
	if current_item == 0:
		# Convert the time limit from minutes to seconds
		time_limit *= 60
	
	
	
	# Get the current card to display
	card = Card.objects.get(deck=deck, order=order)
	
	
	
	return render_to_response(template, {
		'title':   title + SEPARATOR + escape(deck.name) + SEPARATOR + SITE_TITLE,
		'heading': heading,
		
		'minimalist_menubar':  minimalist_menubar,
		'cancel_back_to_deck': cancel_back_to_deck,
		'back_to_deck':        back_to_deck,
		
		'toolbar_class': toolbar_class,
		'content_class': content_class,
		
		'deck': deck,
		'card': card,
		
		'card_count': card_count,
		
		'card_was_flipped': card_was_flipped,
		'time_up':          time_up,
		
		'time_taken': time_taken,
		
		'start_time':   start_time,
		'use_time':     use_time,
		'time_limit':   time_limit,
		'randomize':    randomized,
		'use_reverse':  use_reverse,
		'random_queue': random_queue,
		'repeat_queue': repeat_queue,
		
		'current_item': current_item,
		'last_item':    last_item
	}, context_instance=RequestContext(request))