from django.conf.urls import include, url
from teacher import views

urlpatterns = [
	url(r'^$', views.Teacher, name='Teacher'),
	url(r'^access_denied$', views.AccessDenied, name='AccessDenied'),
]