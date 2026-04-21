from django.conf import settings # import the settings file

def google_recaptcha_keys(request):
    # return the value you want as a dictionnary. you may add multiple values in there.
    return {
        'RECAPTCHA_SITE_KEY': settings.RECAPTCHA_SITE_KEY,
        'RECAPTCHA_SECRET_KEY': settings.RECAPTCHA_SECRET_KEY
    }