# coding=utf-8

import random, json, util
from itertools import chain
from datetime import datetime
#from time import gmtime, strftime
from operator import attrgetter
from django.utils.html import escape
from django.shortcuts import render_to_response, get_object_or_404
from django.utils.translation import ugettext_lazy as _
from django.template import RequestContext
from django.db.models import Q
from notecards.models import Deck, Card, Deck_Tags, Tags

site_title = 'Sleepless Demo'
sep = ' | '



def home(request):
	return render_to_response('home.html', {
		'title': _('Welcome to the %(site_title)s') % {'site_title': site_title},
		'body_class': 'home-page',
		'popular_decks': Deck.objects.order_by('times_studied')[:20]
	}, context_instance=RequestContext(request))





def search(request):
	query = request.GET.get('for', '')
	
	if query:
		queried_tags = Tags.objects.filter(name__ilike='%'+query+'%')
		
		if queried_tags:
			tags_query = reduce(lambda q, value: q|Q(tag=value), queried_tags, Q())  
			tag_related_decks = [tagged_deck.deck for tagged_deck in Deck_Tags.objects.filter(tags_query).select_related('deck')]
		else:
			tag_related_decks = []
		
		name_related_decks = Deck.objects.filter(Q(name__ilike='%'+query+'%') | Q(summary__ilike='%'+query+'%'))
		
		found_decks = sorted(set(chain(name_related_decks, tag_related_decks)), key=attrgetter('times_studied'))
		page_title = _('Results for &ldquo;%(search_query)s&rdquo;') % {'search_query': escape(query)}
	else:
		found_decks = []
		page_title = _("You Didn't Search For Anything!")
	
	return render_to_response('search.html', {
		'title': page_title + sep+site_title,
		'search_query': query,
		'found_decks': found_decks,
		'popular_decks': Deck.objects.order_by('times_studied')[:20]
	}, context_instance=RequestContext(request))





def launch(request, author, deck_slug):
	deck = Deck.objects.get(slug=deck_slug, author__name=author)
	
	return render_to_response('launch.html', {
		'title': escape(deck.name) + sep + site_title,
		'deck': deck,
		'card_count': util.card_count_of(deck)
	}, context_instance=RequestContext(request))





def study(request, author, deck_slug):
	heading = ''
	
	deck = Deck.objects.get(slug=deck_slug, author__name=author)
	
	answered = request.POST.get('show-answer', False)
	show_next_card = request.POST.get('study-l0') or request.POST.get('study-l1') or request.POST.get('study-l2') or request.POST.get('study-l3')
	
	card_count = util.card_count_of(deck)
	
	start_time = request.POST.get('start-time', False)
	use_time   = request.POST.get('use-time', False)
	time_limit = float(request.POST.get('time-limit', 0)) * 60
	randomized   = request.POST.get('randomize', False)
	random_queue = request.POST.get('random-queue')
	use_reverse  = request.POST.get('use-reverse', False)
	repeat_queue = json.loads(request.POST.get('repeat-queue', '[]'))
	
	# If the tiemstamp hasn't been set yet, set it now
	if not start_time:
		start_time = datetime.strftime(datetime.utcnow(), '%Y-%m-%d %H:%M:%S')
	
	# Sort out issues with converting strings to booleans
	if use_reverse == 'False':
		use_reverse = False
	if randomized == 'False':
		randomized = False
	if use_time == 'False':
		use_time = False
	
	current_item = int(request.POST.get('current-item', 0))
	last_item    = int(request.POST.get('last-item', request.POST.get('card-count', 20)))
	order = int(request.POST.get('order', 1)) # The card we're currently displaying
	
	# @TODO If this is the first item, bump the deck's study count
	
	# Limit the number of cards to study by the total number in the deck
	if last_item > card_count:
		last_item = card_count
	
	# If we're randomizing and we don't have a randomized queue initialzed, create one and randomize the first card
	if randomized and not random_queue:
		random_queue = range(1, card_count+1)
		random.shuffle(random_queue)
		
		order = random_queue.pop()
	
	template = 'study.html'
	title = _('Now Studying')%{}
	content_class = 'study-page'
	
	# The session ended if the current card was also the last card
	session_ended = (current_item == last_item)
	
	# Whether or not time is up
	# @TODO This is an absolute mess, converting time strings into datetime objects and back and forth
	time_up = use_time and time_limit < (datetime.utcnow() - datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S')).seconds
	
	if session_ended or time_up:
		headings = [
			_(u'That’s It!'),
			_(u'You’re Done!'),
			_('Congratulations!'),
			_('Nice Work!')
		]
		random.shuffle(headings)
		
		heading = headings.pop()
		template = 'completion.html'
		title = _('Studying Complete')%{}
		content_class = 'completion-page'
		
		# @TODO This should be the time limit if one was set
		if use_time:
			print time_limit
			total_time = time_limit
		else:
			start_time = datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S')
			total_time = (datetime.utcnow() - start_time).seconds
		
		hours, remainder = divmod(total_time, 3600)
		minutes, seconds = divmod(remainder, 60)
		
		if hours:
			time_taken = '%d:%02d:%02d' % (hours, minutes, seconds)
		else:
			time_taken = '%d:%02d' % (minutes, seconds)
	# Otherwise, check if we need to show the next card or mark the current one as completed
	else:
		time_taken = 0
		
		# If a question was answered, count the card as completed
		if answered:
			current_item += 1
		elif show_next_card:
			if randomized:
				random_queue = json.loads(random_queue)
				order = random_queue.pop()
			else:
				order += 1
	
	
	
	card = Card.objects.get(deck=deck, order=order)
	
	
	
	return render_to_response(template, {
		'title':   title + sep + escape(deck.name) + sep + site_title,
		'heading': heading,
		
		'cancel_back_to_deck': True, # @TODO This is different on the completion page
		
		'toolbar_class': 'is-muted',
		'content_class': content_class,
		
		# @TODO Send over an author_slug
		
		'deck': deck,
		'card': card,
		
		'answered': answered,
		'time_up':  time_up,
		
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





def card_listing(request, author, deck_slug):
	deck = Deck.objects.get(slug=deck_slug, author__name=author)
	cards = Card.objects.filter(deck=deck).order_by('order')
	
	return render_to_response('card_listing.html', {
		'title': _('Cards in %(deck_name)s')%{'deck_name': escape(deck.name)} + sep + site_title,
		'back_to_deck': True,
		'author_slug': author,
		'deck': deck,
		'cards': cards
	}, context_instance=RequestContext(request))