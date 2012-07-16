import json, random
from config import *
from ..util import card_count_of, decode_numeric_query_string

# @TODO Do nothing if this deck is not public
def cards_api(request, deck_id):
	deck = Deck.objects.get(id=deck_id)
	card_count = card_count_of(deck)
	
	# Get the specified parameters
	total   = int(request.GET.get('total', card_count)) # Number of cards to return
	studied = request.GET.get('studied', False) # Cards that have already been studied
	include = request.GET.get('include', []) # Additional cards to include (useful for review cards)
	randomized     = request.GET.get('randomize', '') # Whether to randomize
	randomize_seed = int(request.GET.get('randomizeSeed', -1)) # The randomizer seed
	
	# Handle false values for whether or not we should randomize
	if randomized.lower() == 'false':
		randomized = False
	
	
	# Limit the number of cards to return by the total number in the deck
	if total > card_count:
		total = card_count
	
	
	all_card_ids = range(1, card_count+1) # Every card id in the deck
	card_ids = [] # The unstudied card ids we'll be returning
	
	# Convert our query string of studied cards to a list of studied card ids
	if studied:
		studied = decode_numeric_query_string(studied)
	
	# If we're randomizing, shuffle the list of all card ids
	if randomized:
		# If a seed was provided, seed the random number generator
		if randomize_seed != -1:
			random.seed(randomize_seed)
		
		random.shuffle(all_card_ids) # Shuffle the card order
	
	# Loop through all cards ids until we find enough that have not been studied
	for id in all_card_ids:
		# If this card hasn't been studied, add it to our list
		if not studied or not id in studied:
			card_ids.append(id)
		
		# If we've found enough unstudied cards, stop looping
		if len(card_ids) == total:
			break
	
	
	# If there are cards to be included...
	if include:
		include = decode_numeric_query_string(include) # Converted the card ids from a string to a list of integers
		
		if randomized:
			random.shuffle(include) # Shuffle the order of our review cards
		
		# Add the review cards to the list of cards to return
		card_ids += include
	
	
	
	# Get the relevant cards
	cards = Card.objects.filter(deck=deck, order__in=card_ids)
	
	
	
	# Generate the card data
	card_data = []
	for id in card_ids:
		if id <= card_count:
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