from __future__ import unicode_literals
from django.db import models
from django.conf import settings

class Score(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	rookie = models.PositiveSmallIntegerField(default=0)
	intermediate = models.PositiveSmallIntegerField(default=0)
	master = models.PositiveSmallIntegerField(default=0)

	def __unicode__(self):
		# You can access ForeignKey properties through the field name!
		return self.user.first_name + " " + self.user.last_name