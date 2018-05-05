from django.conf.urls import include, url
from game import views

urlpatterns = [
	url(r'^$', views.PlayHamath, name='PlayHamath'),
	url(r'^rookie_mode$', views.RookieMode, name='RookieMode'),
	url(r'^intermediate_mode$', views.IntermediateMode, name='IntermediateMode'),
	url(r'^master_mode$', views.MasterMode, name='MasterMode'),
]