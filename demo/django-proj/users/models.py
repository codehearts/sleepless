from django.db import models

class User(models.Model):
	name = models.CharField(max_length=25)
	join_date = models.DateTimeField(auto_now_add=True)
	
	def __unicode__(self):
		return self.name