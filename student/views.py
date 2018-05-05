from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from student.models import Score

def get_student_score(request):
	for score in Score.objects.all():
		if score.user_id is request.user.pk:

			# print "name: " + str(score)
			# print "rookie: " + str(score.rookie)
			# print "inter: " + str(score.intermediate)
			# print "master: " + str(score.master)
			
			return { 'student_name' : score, 'rookie' : score.rookie, 'intermediate' : score.intermediate, 'master' : score.master }
	return {}

@login_required
def Student(request):
    return render(request, 'student/student.html', {})

@login_required
def GetScores(request):
	context = get_student_score(request)
	return render(request, 'student/menu/get_scores.html', context)

@login_required
def HowToPlay(request):
	return render(request, 'student/menu/how_to_play.html', {})