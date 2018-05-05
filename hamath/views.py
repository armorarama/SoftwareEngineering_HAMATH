from django.shortcuts import render
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from hamath.forms import RegistrationForm, LoginForm
from student.models import Score
from hamath import settings
from hamath.forms import ContactForm
from django.template.loader import get_template
from django.template import Context
import emailer
import teacher

from django.views.generic.base import View, TemplateView

def SignUp(request):
    next = request.GET.get('next', settings.LOGIN_URL)
    if request.user.is_authenticated():
        return HttpResponseRedirect(settings.HOME_URL)
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():

            # reader input from form
            username=form.cleaned_data['username']
            first_name=form.cleaned_data['first_name'].title()
            last_name=form.cleaned_data['last_name'].title()
            email=form.cleaned_data['email']

            # create user model
            user = User.objects.create_user(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=form.cleaned_data['password']
            )

            # create score model for user
            score = Score(
                user=User.objects.get(pk=user.pk),
                rookie=0,
                intermediate=0,
                master=0
            )

            # save to database
            user.save()
            score.save()

            # read input from checkbox
            is_applying_for_teacher_credentials = form.cleaned_data['is_applying_for_teacher_credentials']

            if is_applying_for_teacher_credentials:
                # send email to admins
                emailer.send_teacher_request_email(
                    username,
                    first_name,
                    last_name,
                    email
                )

                # send thank you email to user
                emailer.send_thank_you_email_for_teacher_request(
                    username,
                    first_name,
                    last_name,
                    email
                )
            else:
                 # send thank you email to user
                emailer.send_thank_you_email(
                    username,
                    first_name,
                    last_name,
                    email
                )

            # put them in the student group because they have not been verified yet.
            student_group = Group.objects.get(name=settings.DEFAULT_GROUP_NAME)
            student_group.user_set.add(user)

            return HttpResponseRedirect(next)
        else:
            return TemplateResponse(request, 'hamath/signup.html', {'form': form})
    else:
        form = RegistrationForm()
        return TemplateResponse(request, 'hamath/signup.html', {'form': form})


def student_teacher_redirect(request):
    if teacher.views.is_teacher(request.user):
        context = teacher.views.get_student_scores(request)
        return render(request, 'teacher/teacher.html', context)
    else:
        return render(request, 'student/student.html', {})


def Login(request):
    if request.user.is_authenticated():
        student_teacher_redirect(request)

    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(username=username, password=password)
        else:
            return TemplateResponse(request, 'hamath/login.html', {'form': form})

        if user is not None:
            if user.is_active:
                login(request, user)
                return student_teacher_redirect(request)
            else:
                return TemplateResponse(request, 'hamath/login.html', {'form': form})
        else:
            return TemplateResponse(request, 'hamath/login.html', {'form': form})

    else:
        form = LoginForm()
        return TemplateResponse(request, 'hamath/login.html', {'form': form})


def Logout(request):
    logout(request)
    return HttpResponseRedirect(settings.HOME_URL)

class HomeView(TemplateView):
    template_name = 'hamath/home.html'

def About(request):
    return render(request, 'hamath/about.html', {'version': settings.VERSION})

def Contact(request):
    next = request.GET.get('next', settings.HOME_URL)
    form_class = ContactForm

    if request.method == 'POST':
        form = form_class(data=request.POST)

        if form.is_valid():
            contact_name = request.POST.get('contact_name', '')
            contact_email = request.POST.get('contact_email', '')
            message_content = request.POST.get('message_content', '')

            print(contact_name)
            print(contact_email)
            print(message_content)

            emailer.send_contact_email(
                contact_name,
                contact_email,
                message_content
            )
            return HttpResponseRedirect(next)
        else:
            return TemplateResponse(request, 'hamath/contact.html', {'form': form_class})
    else:
        form = RegistrationForm()
        return TemplateResponse(request, 'hamath/contact.html', {'form': form_class})

def my_custom_bad_request_view(request):
    return render(request, '400.html', {})

def my_custom_permission_denied_view(request):
    return render(request, '403.html', {})

def my_custom_page_not_found_view(request):
    return render(request, '404.html', {})

def my_custom_error_view(request):
    return render(request, '500.html', {})
