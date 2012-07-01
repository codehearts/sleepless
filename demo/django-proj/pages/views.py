import random, util
from itertools import chain
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
	
	tag_ids = Deck_Tags.objects.filter(deck=deck).select_related('tag').order_by('tag__name')
	tags = [tag_id.tag for tag_id in tag_ids]
	
	return render_to_response('launch.html', {
		'title': escape(deck.name) + sep + site_title,
		'deck': deck,
		'card_count': util.card_count_of(deck),
		'tags': tags
	}, context_instance=RequestContext(request))





def study(request, author, deck_slug):
	heading = ''
	
	deck = Deck.objects.get(slug=deck_slug, author__name=author)
	
	answered = request.POST.get('show-answer', False)
	show_next_card = request.POST.get('study-l0') or request.POST.get('study-l1') or request.POST.get('study-l2') or request.POST.get('study-l3')
	
	card_count = util.card_count_of(deck)
	
	use_time   = request.POST.get('use_time', False)
	time_limit = float(request.POST.get('time_limit', False))
	randomized   = request.POST.get('randomize', False)
	random_queue = request.POST.get('random_queue')
	use_reverse  = request.POST.get('use_reverse', False)
	repeat_queue = request.POST.get('repeat_queue')
	
	# Sort out issues with converting strings to booleans
	if use_reverse == 'False':
		use_reverse = False
	if randomized == 'False':
		randomized = False
	if use_time == 'False':
		use_time = False
	
	# @TODO There's a stylistic issue with cards where text is getting clipped
	
	current_item = request.POST.get('current_item', 0)
	last_item    = request.POST.get('last_item', request.POST.get('card-count', 20))
	order = int(request.POST.get('order', 1)) # The card we're currently displaying
	
	# Limit the number of cards to study by the total number in the deck
	if not randomized and last_item > card_count:
		last_item = card_count
	# If we're randomizing and we don't have a randomized queue initialzed, create one
	elif randomized and not random_queue:
		random_queue = random.shuffle(range(1, last_item+1))
	
	template = 'study.html'
	title = 'Now Studying'
	
	# End the session if the current card was also the last card
	if current_item == last_item:
		headings = [_('That&rdquo;s it!'), _('You&rdquo;re Done!'), _('Congratulations!'), _('Nice Work!')]
		
		heading = random.shuffle(heading).pop()
		template = 'completion.html'
		title = 'Studying Complete'
	
	# If a question was answered, count the card as completed
	if answered:
		current_item = int(current_item) + 1
	
	if show_next_card:
		print randomized
		if randomized:
			order = list(random_queue).pop()
		else:
			order += 1
	
	card = Card.objects.get(deck=deck, order=order)
	
	
	
	return render_to_response(template, {
		'title':   _(title)%{} + sep + escape(deck.name) + sep + site_title,
		'heading': heading,
		
		'cancel_back_to_deck': True, # @TODO This is different on the completion page
		
		'toolbar_class': 'is-muted',
		'body_class':    'study-page',
		
		# @TODO Send over an author_slug
		
		'deck': deck,
		'card': card,
		
		'answered': answered,
		
		'use_time':     use_time,
		'time_limit':   time_limit,
		'randomize':    randomized,
		'use_reverse':  use_reverse,
		'current_item': current_item,
		'last_item':    last_item,
		'random_queue': random_queue,
		'repeat_queue': repeat_queue
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