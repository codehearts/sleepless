from notecards.models import Card

# Returns the number of cards in the specified deck
def card_count_of(deck):
	return len(Card.objects.select_related('deck').filter(deck=deck))