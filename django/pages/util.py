from notecards.models import Card

# Returns the number of cards in the specified deck
def card_count_of(deck):
	return len(Card.objects.select_related('deck').filter(deck=deck))

# Decodes a query string containing numeric ranges and values
def decode_numeric_query_string(query_string):
	numeric_values = query_string.split(',')
	numeric_list = []
	
	for value in numeric_values:
		# This value represents a range of numeric values
		if '-' in value:
			values = value.split('-')
			numeric_list.extend(range(int(values[0]), int(values[1])+1))
		else:
			numeric_list.append(int(value))
	
	return numeric_list