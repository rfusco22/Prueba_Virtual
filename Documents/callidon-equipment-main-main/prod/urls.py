from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path

import sys

sys.path.append('../core')

from core.views import (
    CallidonLoginView,
    CallidonSignupView,
    CallidonPasswordResetView,
    CallidonPasswordChangeView,
    CallidonConfirmEmailView,
    CallidonLoginErrorView
)

from allauth.account import views as allauth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('accounts/', include('allauth.urls')),
     # allauth routes
    # path("accounts/signup/", CallidonSignupView.as_view(), name="account_signup"),
    # path("accounts/login/", CallidonLoginView.as_view(), name="account_login"),
    # path("accounts/logout/", allauth_views.logout, name="account_logout"),
    # path("accounts/password/change/", CallidonPasswordChangeView.as_view(), name="account_change_password"),
    # path("accounts/password/set/", allauth_views.password_set, name="account_set_password"),
    # path("accounts/inactive/", allauth_views.account_inactive, name="account_inactive"),
    # path("accounts/email/", allauth_views.email, name="account_email"),
    # path("accounts/confirm-email/", allauth_views.email_verification_sent, name="account_email_verification_sent"),
    # re_path(r"^accounts/confirm-email/(?P<key>[-:\w]+)/$", CallidonConfirmEmailView.as_view(), name="account_confirm_email"),
    # path("accounts/password/reset/", CallidonPasswordResetView.as_view(), name="account_reset_password"),
    # path("accounts/password/reset/done/", allauth_views.password_reset_done, name="account_reset_password_done"),
    # re_path(r"^accounts/password/reset/key/(?P<uidb36>[0-9A-Za-z]+)-(?P<key>.+)/$", allauth_views.password_reset_from_key, name="account_reset_password_from_key"),
    # path("accounts/password/reset/key/done/", allauth_views.password_reset_from_key_done, name="account_reset_password_from_key_done"),
    # path("accounts/login/error", CallidonLoginErrorView.as_view(), name="account_login_error"),
    # END: allauth routes
    path('', include('core.urls', namespace='core'))
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
