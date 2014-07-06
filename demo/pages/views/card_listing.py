from django.utils.translation import ugettext_lazy as _

from config import *

def card_listing(request, author, deck_slug):
	# Get the deck object
	deck = Deck.objects.get(slug=deck_slug, author__name=author)
	
	# Get all cards in the deck
	cards = Card.objects.filter(deck=deck).order_by('order')
	
	return render_to_response('card_listing.html', {
		'title': _('Cards in %(deck_name)s') % {'deck_name': escape(deck.name)} + SEPARATOR + SITE_TITLE,
		
		'body_class': 'card-listing',
		
		'back_to_deck': True,
		
		'deck':  deck,
		'cards': cards
	}, context_instance=RequestContext(request))