from __future__ import unicode_literals
from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.conf import settings 

class Student(models.Model):
	username = models.CharField(max_length=50, null=True)
	first_name = models.CharField(max_length=50, null=True)
	last_name = models.CharField(max_length=50, null=True)
	is_applying_for_teacher_credentials = models.BooleanField(default=False)

	def get_full_name(self):
		full_name = self.first_name + " " + self.last_name
		return full_name

	def __unicode__(self):
		return '%s' % self.get_full_name()

def create_student_user_callback(sender, instance, **kwargs):
	student, new = Student.objects.get_or_create(user=instance)
	post_save.connect(create_student_user_callback, User) 