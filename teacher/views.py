from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from hamath import settings
from django.contrib.auth.models import User, Group
from django.contrib.auth.decorators import login_required, user_passes_test
from student.models import Score

def is_teacher(user):
    return user.groups.filter(name='Teacher').exists()

def get_student_scores(request):
	if is_teacher(request.user):
		
		# for score in Score.objects.all():
		# 	print "name: " + str(score)
		# 	print "rookie: " + str(score.rookie)
		# 	print "inter: " + str(score.intermediate)
		# 	print "master: " + str(score.master)

		return { 'scores' : Score.objects.all() }
	else:
		return None

@login_required
def Teacher(request):
	if is_teacher(request.user):
		context = get_student_scores(request)
		return render(request, 'teacher/teacher.html', context)
	else:
		return HttpResponseRedirect('access_denied')

def AccessDenied(request):
    return render(request, 'teacher/access_denied.html', {})