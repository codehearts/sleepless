from django import template

register = template.Library()

@register.filter
def parse_card_template_fields(template):
	return template.split("\n")

@register.filter
def parse_card_template(card, template):
	data = template.split('|')
	
	return {
		'field': getattr(card, data[0]),
		'class': data[1]
	}