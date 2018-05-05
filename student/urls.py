from django.conf.urls import include, url
from student import views

urlpatterns = [
	url(r'^$', views.Student, name='Student'),
	url(r'^get_scores/$', views.GetScores, name='GetScores'),
	url(r'^how_to_play/$', views.HowToPlay, name='HowToPlay'),
	url(r'^play_hamath/', include('game.urls')),
]