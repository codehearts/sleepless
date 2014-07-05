from django.db import models
from users.models import User
from django.utils.translation import ugettext_lazy as _

def get_deck_thumnail_path(instance, filename):
	return instance.author.name.lower()+'/thumbnails/'+filename


class Deck(models.Model):
	name = models.CharField(max_length=140)
	slug = models.SlugField()
	summary = models.TextField('Brief Summary', default=_('No summary has been written for this deck.'))
	description = models.TextField('Long Description', default=_('No description has been written for this deck.'))
	author = models.ForeignKey('users.User')
	thumbnail = models.ImageField(upload_to=get_deck_thumnail_path, blank=True)
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True, auto_now_add=True)
	times_studied = models.PositiveIntegerField('Number of Times Studied', default=0)
	f_template = models.TextField('Front Template')
	b_template = models.TextField('Back Template')
	# @TODO Reversed card templates
	# @TODO Public/private deck field
	
	def __unicode__(self):
		return self.name


class Tags(models.Model):
	name = models.CharField(max_length=25)
	
	def __unicode__(self):
		return self.name


class Deck_Tags(models.Model):
	deck = models.ForeignKey(Deck)
	tag = models.ForeignKey(Tags)


class Card(models.Model):
	deck  = models.ForeignKey(Deck)
	order = models.PositiveIntegerField()
	front = models.TextField()
	back  = models.TextField()
	extra = models.TextField(blank=True)
	
	def __unicode__(self):
		return self.deck.name+': '+str(self.order)+': '+self.front