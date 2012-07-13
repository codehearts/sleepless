from django.utils.translation import ugettext_lazy as _

from config import *

from itertools import chain
from operator import attrgetter

from django.db.models import Q

def search(request):
	query = request.GET.get('for', '')
	like_query = '%'+query+'%' # For use in SQL like queries
	
	# If a search query was entered
	if query:
		queried_tags = Tags.objects.filter(name__ilike=like_query)
		
		# If any tags were queried
		if queried_tags:
			# Combine tag queries into one big OR statement
			tags_query = reduce(lambda q, value: q|Q(tag=value), queried_tags, Q())
			
			# Get a list of decks that are related to the query by tags
			tag_related_decks = [tagged_deck.deck for tagged_deck in Deck_Tags.objects.filter(tags_query).select_related('deck')]
		# If no tags were queried, we have no decks that are related to the query by tags
		else:
			tag_related_decks = []
		
		# Find decks that are related by title or description
		name_related_decks = Deck.objects.filter(Q(name__ilike=like_query) | Q(summary__ilike=like_query))
		
		# Merge our lists of decks related by tags and title/description together
		found_decks = sorted(set(chain(name_related_decks, tag_related_decks)), key=attrgetter('times_studied'))
		
		page_title = _('Results for &ldquo;%(search_query)s&rdquo;') % {'search_query': escape(query)}
	# If a query wasn't entered, we'll just show popular decks
	else:
		found_decks = []
		page_title = _("You Didn't Search For Anything!")
	
	return render_to_response('search.html', {
		'title': page_title + SEPARATOR + SITE_TITLE,
		
		'search_query': query,
		'found_decks':  found_decks,
		
		'popular_decks': Deck.objects.order_by('-times_studied')[:20] # @TODO We should have a method for retrieving popular decks
	}, context_instance=RequestContext(request))