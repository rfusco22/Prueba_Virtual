from django.urls import path
from django.contrib.sitemaps.views import sitemap
from django.urls import path

from allauth.account import views as allauth_views

from .models import Item, HttpsSitemap, LandingPage
from .views import (
    ItemDetailView,
    HomeView,
    add_to_cart,
    remove_from_cart,
    InventoryView,
    OrderSummaryView,
    remove_single_item_from_cart,
    CheckoutView,
    ReviewOrderView,
    AddCouponView,
    RequestRefundView,
    FinancingView,
    FCBView,
    MAZOCapitalView,
    WarrantyView,
    ContactUsView,
    AboutUsView,
    DieselGeneratorsView,
    ReturnPolicyView,
    PrivacyPolicyView,
    LandingPageView,
    CallidonAutoleadsGeneratorHandler
)

items_dict = {
    "queryset": Item.objects.all()
}

landing_pages_dict = {
    "queryset": LandingPage.objects.all()
}

app_name = 'core'

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('inventory/<slug>/', ItemDetailView.as_view(), name='product'),
    path('add-to-cart/<slug>/', add_to_cart, name='add-to-cart'),
    # path('add_coupon/', AddCouponView.as_view(), name='add-coupon'),
    path('remove-from-cart/<slug>/', remove_from_cart, name='remove-from-cart'),
    path('inventory/', InventoryView.as_view(), name='inventory'),
    path('order-summary/', OrderSummaryView.as_view(), name='order-summary'),
    path('remove-item-from-cart/<slug>/', remove_single_item_from_cart, name='remove-single-item-from-cart'),
    path('review/', ReviewOrderView.as_view(), name='review'),
    # path('request-refund/', RequestRefundView.as_view(), name='request-refund'),
    path('financing/', FinancingView.as_view(), name='financing'),
    path('financing/first-citizens-bank/', FCBView.as_view(), name='first-citizens-bank'),
    path('financing/mazo-capital-solutions/', MAZOCapitalView.as_view(), name='mazo-capital-solutions'),
    path('warranty/', WarrantyView.as_view(), name='warranty'),
    path('contact/', ContactUsView.as_view(), name='contact'),
    path('about-us/', AboutUsView.as_view(), name='about-us'),
    path('dieselgenerators/', DieselGeneratorsView.as_view(), name='dieselgenerators'),
    # path('return-policy/', ReturnPolicyView.as_view(), name='return-policy'),
    # path('privacy-policy/', PrivacyPolicyView.as_view(), name='privacy-policy'),
    path('autoleads-collect/', CallidonAutoleadsGeneratorHandler.as_view(), name='autoleads-generator'),
    path('<slug>/', LandingPageView.as_view(), name='landing-page'),
    path(
        'sitemap.xml',
        sitemap,
        {
            "sitemaps": {
                "items": HttpsSitemap(items_dict, priority=0.6),
                "landings": HttpsSitemap(landing_pages_dict, priority=0.6),
            }
        },
        name="django.contrib.sitemaps.views.sitemap"
    )
]