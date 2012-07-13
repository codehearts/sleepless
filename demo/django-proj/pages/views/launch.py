from django.utils.translation import ugettext_lazy as _

from config import *
from ..util import card_count_of

def launch(request, author, deck_slug):
	deck = Deck.objects.get(slug=deck_slug, author__name=author)
	
	return render_to_response('launch.html', {
		'title': escape(deck.name) + SEPARATOR + SITE_TITLE,
		
		'body_class': 'launch',
		
		'deck':       deck,
		'card_count': card_count_of(deck)
	}, context_instance=RequestContext(request))