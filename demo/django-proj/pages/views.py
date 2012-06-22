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
		tag_related_decks = [deck.deck for deck in Deck_Tags.objects.filter(tag=queried_tags).select_related('deck')]
		
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
		'card_count': len(Card.objects.select_related('deck').filter(deck=deck)),
		'tags': tags
	}, context_instance=RequestContext(request))