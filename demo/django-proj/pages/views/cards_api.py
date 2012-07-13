import json, random
from config import *
from ..util import card_count_of

# @TODO Do nothing if this deck is not public
def cards_api(request, deck_id):
	deck = Deck.objects.get(id=deck_id)
	card_count = card_count_of(deck)
	
	# Get the specified parameters
	total   = int(request.GET.get('total', card_count)) # Number of cards to return
	offset  = int(request.GET.get('offset', 0)) # Number of cards to offset by
	include = request.GET.get('include', []) # Additional cards to include (useful for review cards)
	randomized     = bool(request.GET.get('randomize', False)) # Whether to randomize
	randomize_seed = int(request.GET.get('randomizeSeed', -1)) # The randomizer seed
	
	
	
	# Limit the number of cards to return by the total number in the deck
	if total > card_count:
		total = card_count
	
	
	# If we're randomizing
	if randomized:
		card_ids = range(1, card_count+1)
		
		# If a seed was provided, seed the random number generator
		if randomize_seed != -1:
			random.seed(randomize_seed)
		
		random.shuffle(card_ids) # Shuffle the card order
		card_ids = card_ids[offset:offset+total] # Offset the values by our card offset value
	# Otherwise just return an ordered list
	else:
		card_ids = range(offset+1, offset+total+1)
	
	
	# If there are cards to be included...
	if include:
		include = map(int, include.split(',')) # Converted the card ids from a string to a list of integers
		random.shuffle(include) # Shuffle the order of our review cards
		
		# Add the review cards to the list of cards to return
		card_ids += include
	
	
	
	# Get the relevant cards
	cards = Card.objects.filter(deck=deck, order__in=card_ids)
	
	
	
	# Generate the card data
	card_data = []
	for id in card_ids:
		card = cards.get(order=id)
		
		card_data.append([
			escape(card.order),
			{
				'front': escape(card.front),
				'back':  escape(card.back),
				'extra': escape(card.extra)
			}
		])
	
	
	
	return render_to_response('api/cards.html', {
		'card_data': json.dumps(card_data, ensure_ascii=False)
	}, context_instance=RequestContext(request))