# Import necessary methods and objects

from django.template import RequestContext
from django.shortcuts import render_to_response
from django.utils.html import escape

from notecards.models import Deck, Card, Deck_Tags, Tags



# Page constants

SITE_TITLE = 'Sleepless Demo'
SEPARATOR = ' | '