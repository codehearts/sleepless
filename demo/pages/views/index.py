from django.utils.translation import ugettext_lazy as _

from config import *

def index(request):
	return render_to_response('home.html', {
		'title': _('Welcome to the %(site_title)s') % {'site_title': SITE_TITLE},
		
		'body_class': 'home-page',
		
		'popular_decks': Deck.objects.order_by('-times_studied')[:20]
	}, context_instance=RequestContext(request))