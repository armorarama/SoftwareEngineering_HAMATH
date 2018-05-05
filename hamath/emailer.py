import smtplib

recipients = [
	'hamathgame@gmail.com',
	'alm0415@westminstercollege.edu'
]

def compose_message():
	subject = "A Hamath User Requested Teacher Credentials"
	text = "Please verify me as a teacher."
	message = "Subject: %s\n\n%s" % (subject, text)
	return message

def send_teacher_request_email(username, first_name, last_name, user_email_address):
	TO = recipients if type(recipients) is list else [recipients]
	SUBJECT = "Teacher Credentials Requested\n\n"
	TEXT = "User creditials need to be processed.\n\nUSER INFORMATION\nUSERNAME: %s\nFIRSTNAME: %s\n LASTNAME: %s" % (str(username), str(first_name.title()), str(last_name.title()))
	send_email(TO, SUBJECT, TEXT)

def send_thank_you_email_for_teacher_request(username, first_name, last_name, user_email_address):
	TO = [user_email_address]
	SUBJECT = "Welcome to Hamath " + first_name.title() + "!\n\n"
	TEXT = "Thank you for signing up with Hamath! One of our admins will review your request for Teacher credentials shortly.\n\nUSER INFORMATION\nUSERNAME: %s\nFIRSTNAME: %s\n LASTNAME: %s" % (str(username), str(first_name.title()), str(last_name.title()))
	send_email(TO, SUBJECT, TEXT)

def send_thank_you_email(username, first_name, last_name, user_email_address):
	TO = [user_email_address]
	SUBJECT = "Welcome to Hamath " + first_name.title() + "!\n\n"
	TEXT = "Thank you for signing up with Hamath! \n\nUSER INFORMATION\nUSERNAME: %s\nFIRSTNAME: %s\n LASTNAME: %s" % (str(username), str(first_name.title()), str(last_name.title()))
	send_email(TO, SUBJECT, TEXT)

def send_contact_email(user_name, email_address, message_content):
	TO = recipients
	SUBJECT = "New Message!\n\n"
	TEXT = email_address + "\n" + message_content 
	send_email(TO, SUBJECT, TEXT)

def send_email(TO, SUBJECT, TEXT):
	gmail_user = 'hamathgame@gmail.com'
	gmail_pwd = 'Helloworld'
	FROM = gmail_user
	message = """\From: %s\nTo: %s\nSubject: %s\n\n%s
	""" % (FROM, ", ".join(TO), SUBJECT, TEXT)
	# try:
	server = smtplib.SMTP("smtp.gmail.com", 587)
	server.ehlo()
	server.starttls()
	server.login(gmail_user, gmail_pwd)
	server.sendmail(FROM, TO, message)
	server.close()
	print 'successfully sent the mail'
	# except:
	# 	print "failed to send mail"
