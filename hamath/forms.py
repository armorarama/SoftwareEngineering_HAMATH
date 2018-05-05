from django import forms
from django.contrib.auth.models import User
from django.forms import ModelForm
from hamath.models import Student
from django.contrib.auth import authenticate

class RegistrationForm(forms.ModelForm):
    username = forms.CharField(label=(u'User Name'), widget=forms.TextInput(attrs={'placeholder': 'username'}))
    email = forms.EmailField(label=(u'Email Address'), widget=forms.TextInput(attrs={'placeholder': 'email address'}))
    first_name = forms.CharField(label=(u'First Name'), widget=forms.TextInput(attrs={'placeholder': 'first name'}))
    last_name = forms.CharField(label=(u'Last Name'), widget=forms.TextInput(attrs={'placeholder': 'last name'}))
    password = forms.CharField(label=(u'Password'), widget=forms.PasswordInput(attrs={'placeholder': 'password'}))
    password1 = forms.CharField(label=(u'Verify Password'), widget=forms.PasswordInput(attrs={'placeholder': 'verify password'}))
    is_applying_for_teacher_credentials =forms.BooleanField(initial=False, required=False)

    class Meta:
        model = Student
        exclude = ('user',)

    def clean_username(self):
        username = self.cleaned_data['username']
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            return username
        raise forms.ValidationError("That username is already taken, please select another.")

    def clean(self):
        password = self.cleaned_data.get('password')
        password1 = self.cleaned_data.get('password1')

        if password and password != password1:
            raise forms.ValidationError("Passwords don't match")
        return self.cleaned_data

    def __inint__(self):
        if check_something():
            self.fields['is_applying_for_teacher_credentials'].initial  = True

class LoginForm(forms.Form):
    username = forms.CharField(label=(u'User Name'), widget=forms.TextInput(attrs={'placeholder': 'username'}))
    password = forms.CharField(label=(u'Password'), widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        user = authenticate(username=username, password=password)
        if not user or not user.is_active:
            raise forms.ValidationError("Sorry, that login was invalid. Please try again.")
        return self.cleaned_data

class ContactForm(forms.Form):
 contact_name = forms.CharField(required=True)
 contact_email = forms.EmailField(required=True)
 message_content = forms.CharField(required=True,widget=forms.Textarea)
