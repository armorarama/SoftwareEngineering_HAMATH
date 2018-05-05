from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from student.models import Score
from django.views.decorators.csrf import csrf_exempt

@login_required
def PlayHamath(request):
	return render(request, 'student/menu/choose_difficulty.html', {})

def isHighScoreForGameMode(request, mode, new_score):
	# get score from db
	for score in Score.objects.all():
		if score.user_id is request.user.pk:
			rookie_score = str(score.rookie)
			intermediate_score = str(score.intermediate)
			master_score = str(score.master)
	
	if mode is "rookie":
		return int(new_score) > int(rookie_score)

	if mode is "intermediate":
		return int(new_score) > int(intermediate_score)

	if mode is "master":
		return int(new_score) > int(master_score)

@csrf_exempt
def RookieMode(request):
	if request.method == 'POST' and request.POST.get("mode", False) == "rookie" and request.user.is_authenticated():
		rookie_mode_score = request.POST.get("score", False)
		if isHighScoreForGameMode(request, 'rookie', rookie_mode_score):
			user_score=Score.objects.get(user_id=request.user.pk)
			user_score.rookie=rookie_mode_score
			user_score.save()
		return render(request, 'game/rookie_mode.html', {})
	else:
		return render(request, 'game/rookie_mode.html', {})


@csrf_exempt
def IntermediateMode(request):
	if request.method == 'POST' and request.POST.get("mode", False) == "intermediate" and request.user.is_authenticated():
		intermediate_mode_score = request.POST.get("score", False)
		if isHighScoreForGameMode(request, 'intermediate', intermediate_mode_score):
			user_score=Score.objects.get(user_id=request.user.pk)
			user_score.intermediate=intermediate_mode_score
			user_score.save()
		return render(request, 'game/intermediate_mode.html', {})
	else:
		return render(request, 'game/intermediate_mode.html', {})

@csrf_exempt
def MasterMode(request):
	if request.method == 'POST' and request.POST.get("mode", False) == "master" and request.user.is_authenticated():
		master_mode_score = request.POST.get("score", False)
		if isHighScoreForGameMode(request, 'master', master_mode_score):
			user_score=Score.objects.get(user_id=request.user.pk)
			user_score.master=master_mode_score
			user_score.save()
		return render(request, 'game/master_mode.html', {})
	else:
		return render(request, 'game/master_mode.html', {})

