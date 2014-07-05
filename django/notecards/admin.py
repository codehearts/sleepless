from notecards.models import Deck, Tags, Deck_Tags, Card
from django.contrib import admin

admin.site.register(Deck)
admin.site.register(Tags)
admin.site.register(Deck_Tags)

admin.site.register(Card)