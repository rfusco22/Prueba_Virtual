from django.contrib import messages
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render, get_object_or_404
from django.contrib.sites.shortcuts import get_current_site
from django.views.generic import ListView, View
from django.views.generic.base import TemplateResponseMixin
from django.shortcuts import redirect
from django.utils import timezone
from django.conf import settings
from django.http import JsonResponse, Http404
from django.core.mail import send_mail
from django.contrib.auth import login as auth_login

from allauth.account import app_settings
from allauth.account.adapter import get_adapter
from allauth.account.utils import url_str_to_user_pk, perform_login
from allauth.account.models import EmailConfirmationHMAC, EmailConfirmation
from allauth.account.views import (
    LoginView,
    SignupView,
    PasswordChangeView,
    PasswordResetView,
    LogoutFunctionalityMixin
)

from urllib.parse import parse_qs
import requests
import random
import string
import json
import re
import uuid

from .forms import CheckoutForm, CouponForm, RefundForm, EstimateShippingForm, ReviewOrderForm
from .models import (
    Item,
    OrderItem,
    Order,
    BillingAddress,
    Coupon,
    Refund,
    Category,
    LandingPage
)

# Creating views.

def create_ref_code():
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=20))
    all_orders = Order.objects.all()
    i = 0
    # check for duplicates
    while i < len(all_orders):
        order = all_orders[i]
        if code == order.ref_code:
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=20))
            # recheck with the new code
            i = 0
        i += 1
    return code

def create_anonymous_user():
    """
    Create an anonymous user with a unique email based on UUID.
    This allows unauthenticated users to add items to their cart.
    """
    from django.contrib.auth.models import User
    import uuid
    
    # Generate a unique email for this anonymous user
    unique_id = str(uuid.uuid4())[:12]
    email = f"guest-{unique_id}@callidonequipment.com"
    
    # Create the user
    user = User.objects.create_user(
        username=email,
        email=email,
        password=uuid.uuid4().hex  # Random password they won't use
    )
    
    return user

def verify_recaptcha(token):
    """
    Verify reCAPTCHA token with Google's API.
    Returns the response from Google in JSON format.
    """
    recaptcha_secret = settings.RECAPTCHA_SECRET_KEY
    url = "https://www.google.com/recaptcha/api/siteverify"
    payload = {
        'secret': recaptcha_secret,
        'response': token
    }
    
    response = requests.post(url, data=payload)
    return response.json()

ORDER_CONFIRMATION_EMAIL = """
Hello from Callidon Group!

Thank you for your order. Your order confirmation number is: {}

Order summary:
    {}

Next steps:

    Our team will send a sales quote and official shipping quote shortly along with detailed instructions for payment.

If you have any questions on concerns, feel free to reply to this email, or give us a call at (786) 674-1345.

Thank you for your business.

Best regards,
The Callidon Equipment Team

"""

SALES_CONFIRMATION_EMAIL = """
    Order confirmation number: {}

    Order summary:
        {}

    Customer information:

    Billing Address:
    {}

    Email:      {}

    Shipping Address:
    {}

    Shipping estimate:      {}
"""

NEW_USER_SIGNUP_EMAIL = """
    Email:  {}
"""

NEW_LEAD_GENERATED_EMAIL = """
Hello from Callidon Group!

You're receiving this mail because a new lead request was generated for product: {}

Here is more information about this request:

Name: {}
Email: {}
Phone: {}
City: {}
Zip Code: {}
"""

class ReviewOrderView(View):
    def get(self, *args, **kwargs):
        order = Order.objects.get(user=self.request.user, ordered=False)
        form = ReviewOrderForm()
        if order.billing_address:
            context = {
                'order': order,
                'form': form
            }
            return render(self.request, "review_order.html", context)
        else:
            messages.warning(
                self.request, "Please provide a billing address")
            return redirect("core:checkout")

    def post(self, *args, **kwargs):
        form = ReviewOrderForm(self.request.POST or None)
        if form.is_valid():
            print('valid form')
            if form.cleaned_data.get('edit_address') is True:
                return redirect('core:checkout')
            if form.cleaned_data.get('edit_order') is True:
                return redirect('core:order-summary')
            
            # Order was submitted
            order = Order.objects.get(user=self.request.user, ordered=False)
            order.ordered = True

            # Generate ref code
            order.ref_code = create_ref_code()

            order.save()

            # Send confirmation email to customer
            order_summary = ''
            items = order.items.all()
            for i in items:
                order_summary += "   -" + i.item.title + "\n"
            send_mail("Your Order from Callidon Equipment",
                      ORDER_CONFIRMATION_EMAIL.format(order.ref_code, order_summary),
                      "info@callidongroup.com", [self.request.user.get_username()])

            # Send confirmation email to sales

            if order.local_pickup:
                send_mail("NEW ORDER #" + order.ref_code,
                      SALES_CONFIRMATION_EMAIL.format(order.ref_code, order_summary,
                                                      order.billing_address.to_str(),
                                                      self.request.user.get_username(),
                                                      "N/A - LOCAL PICKUP",
                                                      "N/A - LOCAL PICKUP"),
                      "info@callidongroup.com", ["callidonsales@gmail.com"])
            else:
                send_mail("NEW ORDER #" + order.ref_code,
                        SALES_CONFIRMATION_EMAIL.format(order.ref_code, order_summary,
                                                        order.billing_address.to_str(),
                                                        self.request.user.get_username(),
                                                        order.shipping_address.to_str(),
                                                        order.freight_estimate),
                        "info@callidongroup.com", ["callidonsales@gmail.com"])

            messages.info(self.request, 'Order placed successfully! Confirmation number ' + order.ref_code)
            return redirect('core:home')
        else:
            print('invalid form')
            messages.error(self.request, "Something went wrong")
            return redirect('core:home')
        
            
            
        # try:
            # Interact with Quickbooks API:
            # 1. Create customer
            # request = {
            #     "FullyQualifiedName": "", 
            #     "PrimaryEmailAddr": {
            #         "Address": "jdrew@myemail.com"
            #     }, 
            #     "DisplayName": "King's Groceries", 
            #     "Suffix": "Jr", 
            #     "Title": "Mr", 
            #     "MiddleName": "B", 
            #     "Notes": "Here are other details.", 
            #     "FamilyName": "King", 
            #     "PrimaryPhone": {
            #         "FreeFormNumber": "(555) 555-5555"
            #     }, 
            #     "CompanyName": "King Groceries", 
            #     "BillAddr": {
            #         "CountrySubDivisionCode": "CA", 
            #         "City": "Mountain View", 
            #         "PostalCode": "94042", 
            #         "Line1": "123 Main Street", 
            #         "Country": "USA"
            #     }, 
            #     "GivenName": "James"
            # }
            # 2. Create Invoice
            #   a. Select recently created customer
            #   b. Select inventory item
            #   c. Delete item description in Quickbooks
            #   d. Unselect Tax, and re-apply as 7%

        # order = Order.objects.get(user=self.request.user, ordered=False)
        # token = self.request.POST.get('stripeToken')
        
        # except Exception as e:
        #     # send an email to ourselves
        #     messages.error(self.request, "Serious Error occured")
        #     return redirect("/")


class HomeView(ListView):
    template_name = "index.html"
    # display only items on sale as featured
    queryset = Item.objects.filter(is_active=True, label='S').order_by('discount_price')
    queryset = queryset.reverse()
    context_object_name = 'object_list'


class FinancingView(View):
    def get(self ,*args, **kwargs):
        return render(self.request, 'financing.html')
    

class FCBView(View):
    def get(self ,*args, **kwargs):
        return render(self.request, 'first-citizens-bank.html')
    

class MAZOCapitalView(View):
    def get(self ,*args, **kwargs):
        return render(self.request, 'mazo-capital-solutions.html')


class WarrantyView(View):
    def get(self, *args, **kwargs):
        return render(self.request, 'warranty.html')


class ReturnPolicyView(View):
    def get(self, *args, **kwargs):
        return render(self.request, 'return-policy.html')

class PrivacyPolicyView(View):
    def get(self, *args, **kwargs):
        return render(self.request, 'privacy-policy.html')


class ContactUsView(View):
    def get(self, *args, **kwargs):
        return render(self.request, 'contact.html')
    

class AboutUsView(View):
    def get(self, *args, **kwargs):
        return render(self.request, 'about-us.html')


class OrderSummaryView(View):
    def get(self, *args, **kwargs):
        try:
            user = self.request.user
            if user.is_anonymous:
                order = []
            else:
                order = Order.objects.get(user=self.request.user, ordered=False)
            context = {
                'object': order
            }
            return render(self.request, 'order_summary.html', context)
        except ObjectDoesNotExist:
            messages.error(self.request, "You do not have an active order")
            return redirect("/")

class InventoryView(ListView):
    model = Item
    paginate_by = 6
    template_name = "inventory.html"

    def get(self, *args, **kwargs):
        items = Item.objects.filter(is_active=True)
        context = {}
        context['category'] = 'All'
        
        if 'category' in self.request.GET and self.request.GET['category'] != "All":
            context['category'] = self.request.GET['category']
            category = Category.objects.get(title=self.request.GET['category'])
            items = Item.objects.filter(category=category, is_active=True)
        
        if 'min_price' in self.request.GET and len(self.request.GET['min_price']) > 0:
            context['min_price'] = self.request.GET['min_price']
            items = items.filter(price__gte=self.request.GET['min_price'])
        
        if 'max_price' in self.request.GET and len(self.request.GET['max_price']) > 0:
            context['max_price'] = self.request.GET['max_price']
            items = items.filter(price__lte=self.request.GET['max_price'])
        
        if 'min_hours' in self.request.GET and len(self.request.GET['min_hours']) > 0:
            context['min_hours'] = self.request.GET['min_hours']
            items = items.filter(hours__gte=self.request.GET['min_hours'])
        
        if 'max_hours' in self.request.GET and len(self.request.GET['max_hours']) > 0:
            context['max_hours'] = self.request.GET['max_hours']
            items = items.filter(hours__lte=self.request.GET['max_hours'])

        if 'min_year' in self.request.GET and len(self.request.GET['min_year']) > 0:
            context['min_year'] = self.request.GET['min_year']
            items = items.filter(year__gte=self.request.GET['min_year'])
        if 'max_year' in self.request.GET and len(self.request.GET['max_year']) > 0:
            context['max_year'] = self.request.GET['max_year']
            items = items.filter(year__lte=self.request.GET['max_year'])
        
        if 'search' in self.request.GET and len(self.request.GET['search']) > 0:
            context['search'] = self.request.GET['search']
            items = items.filter(title__icontains=self.request.GET['search'])

        # by default
        sort = "relevance"

        if 'category' in self.request.GET and self.request.GET['category'] == 'Diesel Generators':
            if 'sort' in self.request.GET:
                sort = self.request.GET['sort']
            else:
               sort = 'priority' 

            if sort == 'price_l2h':
                items = sorted(items, key=lambda item: item.price, reverse=False)
            
            if sort == 'price_h2l':
                items = sorted(items, key=lambda item: item.price, reverse=True)

            if sort == 'priority':
                items = sorted(items, key=lambda item: item.sorting_position, reverse=False)

            if sort == 'not_priority':
                items = sorted(items, key=lambda item: item.sorting_position, reverse=True)

        elif 'sort' in self.request.GET:
            sort = self.request.GET['sort']

            if sort == 'price_l2h':
                items = sorted(items, key=lambda item: item.price, reverse=False)
            
            if sort == 'price_h2l':
                items = sorted(items, key=lambda item: item.price, reverse=True)

            if sort == 'priority':
                items = sorted(items, key=lambda item: item.sorting_position, reverse=True)

            if sort == 'not_priority':
                items = sorted(items, key=lambda item: item.sorting_position, reverse=False)

        context['sort_by'] = sort

        context['object_list'] = items
        context['num_objects'] = len(items)

        return render(self.request, "inventory.html", context)


def get_distance(dest_zip):
    """
    Get driving distance between origin zip (33142 - Miami) and destination zip.
    Uses OpenRouteService API instead of Google Maps.
    
    Args:
        dest_zip: Destination zip code as string
        
    Returns:
        Distance in miles (rounded)
    """
    try:
        # Geocode both zip codes to get coordinates
        origin_coords = geocode_zip_code('33142')
        dest_coords = geocode_zip_code(dest_zip)

        print(f"Origin coords: {origin_coords}, Dest coords: {dest_coords}")
        
        if not origin_coords or not dest_coords:
            # Fallback to a default shipping cost if geocoding fails
            print("Geocoding failed for one of the zip codes.")
            return None
        
        # Call OpenRouteService Matrix API
        api_key = settings.OPENROUTE_API_KEY
        url = "https://api.openrouteservice.org/v2/matrix/driving-car"
        
        headers = {
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
            'Authorization': api_key,
            'Content-Type': 'application/json'
        }
        
        body = {
            'locations': [
                [origin_coords['lon'], origin_coords['lat']],
                [dest_coords['lon'], dest_coords['lat']]
            ],
            'metrics': ['distance'],
            'units': 'm'
        }
        
        print(f"Requesting distance with body: {body}")
        
        response = requests.post(url, json=body, headers=headers)
        
        if response.status_code != 200:
            print(f"Error response status: {response.status_code}")
            print(f"Error response body: {response.text}")
        
        response.raise_for_status()
        
        result = response.json()
        dist_m = result['distances'][0][1]  # Distance in meters
        dist_mi = dist_m / 1609.34  # Convert to miles
        return round(dist_mi)
        
    except Exception as e:
        print(f"Error getting distance: {e}")
        return None
        
    # except Exception as e:
    #     print(f"Error getting distance: {e}")
    #     return None


def geocode_zip_code(zip_code):
    """
    Convert a US zip code to latitude and longitude coordinates.
    Uses OpenRouteService Geocoding API.
    
    Args:
        zip_code: US zip code as string
        
    Returns:
        Dictionary with 'lat' and 'lon' keys, or None if geocoding fails
    """
    try:
        api_key = settings.OPENROUTE_API_KEY
        url = "https://api.openrouteservice.org/geocode/search"
        
        params = {
            'api_key': api_key,
            'text': zip_code,
            'boundary.country': 'US'
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        result = response.json()
        
        if result.get('features') and len(result['features']) > 0:
            coords = result['features'][0]['geometry']['coordinates']
            return {
                'lon': coords[0],
                'lat': coords[1]
            }
        else:
            print(f"No geocoding results found for zip code: {zip_code}")
            return None
            
    except Exception as e:
        print(f"Error geocoding zip code {zip_code}: {e}")
        return None


def get_freight_estimate(item, dest_zip):
    cost = 0
    dist = get_distance(dest_zip)
    print('Distance: ' + str(dist))
    val = get_dollar_per_mile(item.weight)
    cost = dist * val
    if cost < 500:
        cost = 500
    return round(cost)

def get_dollar_per_mile(weight):
    return weight / 10000 + 0.9

class ItemDetailView(View):
    model = Item
    template_name = "product-content.html"
    canonical_base_url = 'https://callidonequipment.com/inventory/'

    def get(self, *args, **kwargs):
        item = Item.objects.get(slug=self.kwargs['slug'])
        form = EstimateShippingForm(self.request.GET or None)
        item_in_order = False
        if not self.request.user.is_anonymous:
            try:
                order = Order.objects.get(user=self.request.user, ordered=False)
                for i in order.items.all():
                    if i.item == item:
                        item_in_order = True
                        break
            except Order.DoesNotExist:
                pass
        category = item.category
        featured_items = Item.objects.filter(category=category, is_active=True)
        context = {
            'object': item,
            'form': form,
            'shipping': 0,
            'item_in_order': item_in_order,
            'title': item.title,
            'meta_title': item.meta_title,
            'meta_description': item.meta_description,
            'meta_keywords': item.meta_keywords,
            'is_indexable': item.is_indexable,
            'canonical_url': self.canonical_base_url + item.slug,
            'object_list': featured_items
        }
        return render(self.request, self.template_name, context)

    def post(self, *args, **kwargs):
        """
        Handle AJAX POST requests for freight estimate calculation.
        Returns JSON with the shipping cost.
        """
        try:
            item = Item.objects.get(slug=self.kwargs['slug'])
            dest_zip = self.request.POST.get('zip')
            
            if not dest_zip:
                return JsonResponse({
                    'success': False,
                    'error': 'Zip code is required'
                }, status=400)
            
            # Calculate freight estimate
            cost = get_freight_estimate(item, dest_zip)
            
            if cost is None:
                return JsonResponse({
                    'success': False,
                    'error': 'Unable to calculate shipping estimate. Please call us for a quote.'
                }, status=400)
            
            return JsonResponse({
                'success': True,
                'shipping_cost': cost,
                'formatted_cost': f'${cost:,.0f}'
            })
        
        except Item.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Item not found'
            }, status=404)
        except Exception as e:
            print(f"Error calculating freight estimate: {e}")
            return JsonResponse({
                'success': False,
                'error': 'An error occurred while calculating the estimate'
            }, status=500)


class CategoryView(View):
    def get(self, *args, **kwargs):
        category = Category.objects.get(slug=self.kwargs['slug'])
        item = Item.objects.filter(category=category, is_active=True)
        context = {
            'object_list': item,
            'category_title': category,
            'category_description': category.description,
            'category_image': category.image
        }
        return render(self.request, "category.html", context)


class CheckoutView(View):
    def get(self, *args, **kwargs):
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            form = CheckoutForm()
            context = {
                'form': form,
                'order': order
            }
            return render(self.request, "checkout.html", context)

        except ObjectDoesNotExist:
            messages.info(self.request, "You do not have an active order")
            return redirect("core:checkout")
        except TypeError:
            messages.info(self.request, "You are not signed in")
            return redirect("core:home")

    def post(self, *args, **kwargs):
        form = CheckoutForm(self.request.POST or None)
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            print(self.request.POST)
            if form.is_valid():
                bill_name = form.cleaned_data.get('bill_name')
                bill_street_address = form.cleaned_data.get('bill_street_address')
                bill_apartment_address = form.cleaned_data.get('bill_apartment_address')
                bill_country = form.cleaned_data.get('bill_country')
                bill_city = form.cleaned_data.get('bill_city')
                bill_state = form.cleaned_data.get('bill_state')
                bill_zip = form.cleaned_data.get('bill_zip')
                # add functionality for these fields
                same_shipping_address = form.cleaned_data.get(
                    'same_shipping_address')
                billing_address = BillingAddress(
                    user=self.request.user,
                    name=bill_name,
                    street_address=bill_street_address,
                    apartment_address=bill_apartment_address,
                    country=bill_country,
                    state=bill_state,
                    city=bill_city,
                    zip=bill_zip,
                    address_type='B'
                )
                billing_address.save()
                order.billing_address = billing_address
                local_pickup = form.cleaned_data.get('local_pickup')
                print('local_pickup is ' + str(local_pickup))
                if local_pickup is False:
                    if same_shipping_address:
                        ship_name = form.cleaned_data.get('bill_name')
                        ship_street_address = form.cleaned_data.get('bill_street_address')
                        ship_apartment_address = form.cleaned_data.get('bill_apartment_address')
                        ship_country = form.cleaned_data.get('bill_country')
                        ship_city = form.cleaned_data.get('bill_city')
                        ship_state = form.cleaned_data.get('bill_state')
                        ship_zip = form.cleaned_data.get('bill_zip')
                    else:
                        ship_name = form.cleaned_data.get('ship_name')
                        ship_street_address = form.cleaned_data.get('ship_street_address')
                        ship_apartment_address = form.cleaned_data.get('ship_apartment_address')
                        ship_country = form.cleaned_data.get('ship_country')
                        ship_city = form.cleaned_data.get('ship_city')
                        ship_state = form.cleaned_data.get('ship_state')
                        ship_zip = form.cleaned_data.get('ship_zip')
                    shipping_address = BillingAddress(
                        user=self.request.user,
                        name=ship_name,
                        street_address=ship_street_address,
                        apartment_address=ship_apartment_address,
                        country=ship_country,
                        state=ship_state,
                        city=ship_city,
                        zip=ship_zip,
                        address_type='S'
                    )
                    shipping_address.save()
                    order.shipping_address = shipping_address
                else:
                    order.local_pickup = True
                    order.shipping_address = None

                order.freight_estimate = 0
                if not local_pickup and order.shipping_address.country == 'United States':
                    for i in order.items.all():
                        order.freight_estimate += get_freight_estimate(i.item, shipping_address.zip)

                order.save()

                # redirect to review the order
                return redirect('core:review')
            else:
                messages.error(self.request, "An error occurred. Please check and re-submit form")
                print(form)
                return redirect("core:checkout")
        except ObjectDoesNotExist:
            messages.error(self.request, "You do not have an active order")
            return redirect("core:order-summary")
        except Exception as e:
            messages.error(self.request, "An unexpected error occurred")
            print(e)
            return redirect("core:home")


def add_to_cart(request, slug):
    # Auto-create user if anonymous
    user = request.user
    if user.is_anonymous:
        # Verify reCAPTCHA token to ensure it's a human
        recaptcha_token = request.POST.get('recaptcha_token') if request.method == 'POST' else request.GET.get('recaptcha_token')
        if not recaptcha_token:
            messages.error(request, "reCAPTCHA verification failed. Please try again.")
            return redirect("core:product", slug=slug)
        
        recaptcha_response = verify_recaptcha(recaptcha_token)
        if not recaptcha_response.get('success', False):
            messages.error(request, "reCAPTCHA verification failed. Please try again.")
            return redirect("core:product", slug=slug)
        
        # Create the new user
        user = create_anonymous_user()
        # Log in the newly created user so request.user is bound
        auth_login(request, user, backend='django.contrib.auth.backends.ModelBackend')
    
    item = get_object_or_404(Item, slug=slug)
    order_item, created = OrderItem.objects.get_or_create(
        item=item,
        user=user,
        ordered=False
    )

    order_qs = Order.objects.filter(user=user, ordered=False)
    if order_qs.exists():
        order = order_qs[0]
        if order.items.filter(item__slug=item.slug).exists():
            messages.info(request, "Item was already in your cart.")
            return redirect("core:order-summary")
        else:
            order.items.add(order_item)
            messages.info(request, "Item was added to your cart.")
            return redirect("core:order-summary")
    else:
        ordered_date = timezone.now()
        order = Order.objects.create(
            user=user, ordered_date=ordered_date)
        order.items.add(order_item)
        messages.info(request, "Item was added to your cart.")
    return redirect("core:order-summary")


def remove_from_cart(request, slug):
    item = get_object_or_404(Item, slug=slug)
    order_qs = Order.objects.filter(
        user=request.user,
        ordered=False)
    if order_qs.exists():
        order = order_qs[0]
        # check if the order item is in the order
        if order.items.filter(item__slug=item.slug).exists():
            order_item = OrderItem.objects.filter(
                item=item,
                user=request.user,
                ordered=False
            )[0]
            order.items.remove(order_item)
            messages.info(request, "Item was removed from your cart.")
            return redirect("core:order-summary")
        else:
            # add a message saying the user dosent have an order
            messages.info(request, "Item was not in your cart.")
            return redirect("core:product", slug=slug)
    else:
        # add a message saying the user dosent have an order
        messages.info(request, "u don't have an active order.")
        return redirect("core:product", slug=slug)
    return redirect("core:product", slug=slug)

class CallidonLoginView(LoginView):

    def get(self, request, *args, **kwargs):
        return super(CallidonLoginView, self).get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        # Capturar el token de reCAPTCHA del request
        recaptcha_token = request.POST.get('recaptcha_token')
        if not recaptcha_token:
            messages.error(request, "Missing reCAPTCHA token")
            return redirect("accounts/login")

        # Enviar solicitud a Google para verificar el token
        recaptcha_response = self.verify_recaptcha(recaptcha_token)
        
        if not recaptcha_response['success']:
            # Si la verificación falla o el puntaje es bajo, retorna un error
            messages.error(request, "reCAPTCHA validation failed")
            return redirect("accounts/login")

        return super(CallidonLoginView, self).post(request, *args, **kwargs)
    
    def verify_recaptcha(self, token):
        """
        Verifica el token de reCAPTCHA con la API de Google.
        Retorna la respuesta de Google en formato JSON.
        """
        recaptcha_secret = settings.RECAPTCHA_SECRET_KEY
        url = "https://www.google.com/recaptcha/api/siteverify"
        payload = {
            'secret': recaptcha_secret,
            'response': token
        }
        
        # Realiza la solicitud POST a la API de Google
        response = requests.post(url, data=payload)
        return response.json()

class CallidonLoginErrorView(LoginView):
    def get(self, request, *args, **kwargs):
        messages.error(request, "Login failed. Please try again.")
        return redirect("/accounts/login")


class CallidonSignupView(SignupView):

    def get(self, request, *args, **kwargs):
        return super(CallidonSignupView, self).get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        # Capturar el token de reCAPTCHA del request
        recaptcha_token = request.POST.get('recaptcha_token')
        if not recaptcha_token:
            messages.error(request, "Missing reCAPTCHA token")
            return redirect("accounts/signup")

        # Enviar solicitud a Google para verificar el token
        recaptcha_response = self.verify_recaptcha(recaptcha_token)
        
        if not recaptcha_response['success']:
            # Si la verificación falla o el puntaje es bajo, retorna un error
            messages.error(request, "reCAPTCHA validation failed")
            return redirect("accounts/signup")
        else:
            send_mail("NEW USER SIGNUP: " + request.POST.get('email'),
                  NEW_USER_SIGNUP_EMAIL.format(request.POST.get('email')),
                  "info@callidongroup.com", ["callidonsales@gmail.com"])

        return super(CallidonSignupView, self).post(request, *args, **kwargs)
    
    def verify_recaptcha(self, token):
        """
        Verifica el token de reCAPTCHA con la API de Google.
        Retorna la respuesta de Google en formato JSON.
        """
        recaptcha_secret = settings.RECAPTCHA_SECRET_KEY
        url = "https://www.google.com/recaptcha/api/siteverify"
        payload = {
            'secret': recaptcha_secret,
            'response': token
        }
        
        # Realiza la solicitud POST a la API de Google
        response = requests.post(url, data=payload)
        return response.json()


class CallidonConfirmEmailView(TemplateResponseMixin, LogoutFunctionalityMixin, View):

    template_name = "account/email_confirm." + app_settings.TEMPLATE_EXTENSION

    def get(self, *args, **kwargs):
        try:
            self.object = self.get_object()
            if app_settings.CONFIRM_EMAIL_ON_GET:
                return self.post(*args, **kwargs)
        except Http404:
            self.object = None
        ctx = self.get_context_data()
        return self.render_to_response(ctx)

    def post(self, *args, **kwargs):
        self.object = confirmation = self.get_object()
        confirmation.confirm(self.request)

        # In the event someone clicks on an email confirmation link
        # for one account while logged into another account,
        # logout of the currently logged in account.
        if (
            self.request.user.is_authenticated
            and self.request.user.pk != confirmation.email_address.user_id
        ):
            self.logout()

        get_adapter(self.request).add_message(
            self.request,
            messages.SUCCESS,
            "account/messages/email_confirmed.txt",
            {"email": confirmation.email_address.email},
        )
        send_mail("USER " + confirmation.email_address.email + " CONFIRMED EMAIL",
                      " ",
                      "info@callidongroup.com", ["callidonsales@gmail.com"])
        if app_settings.LOGIN_ON_EMAIL_CONFIRMATION:
            resp = self.login_on_confirm(confirmation)
            if resp is not None:
                return resp
        # Don't -- allauth doesn't touch is_active so that sys admin can
        # use it to block users et al
        #
        # user = confirmation.email_address.user
        # user.is_active = True
        # user.save()
        redirect_url = self.get_redirect_url()
        if not redirect_url:
            ctx = self.get_context_data()
            return self.render_to_response(ctx)
        return redirect(redirect_url)

    def login_on_confirm(self, confirmation):
        """
        Simply logging in the user may become a security issue. If you
        do not take proper care (e.g. don't purge used email
        confirmations), a malicious person that got hold of the link
        will be able to login over and over again and the user is
        unable to do anything about it. Even restoring their own mailbox
        security will not help, as the links will still work. For
        password reset this is different, this mechanism works only as
        long as the attacker has access to the mailbox. If they no
        longer has access they cannot issue a password request and
        intercept it. Furthermore, all places where the links are
        listed (log files, but even Google Analytics) all of a sudden
        need to be secured. Purging the email confirmation once
        confirmed changes the behavior -- users will not be able to
        repeatedly confirm (in case they forgot that they already
        clicked the mail).

        All in all, opted for storing the user that is in the process
        of signing up in the session to avoid all of the above.  This
        may not 100% work in case the user closes the browser (and the
        session gets lost), but at least we're secure.
        """
        user_pk = None
        user_pk_str = get_adapter(self.request).unstash_user(self.request)
        if user_pk_str:
            user_pk = url_str_to_user_pk(user_pk_str)
        user = confirmation.email_address.user
        if user_pk == user.pk and self.request.user.is_anonymous:
            return perform_login(
                self.request,
                user,
                app_settings.EmailVerificationMethod.NONE,
                # passed as callable, as this method
                # depends on the authenticated state
                redirect_url=self.get_redirect_url,
            )

        return None

    def get_object(self, queryset=None):
        key = self.kwargs["key"]
        emailconfirmation = EmailConfirmationHMAC.from_key(key)
        if not emailconfirmation:
            if queryset is None:
                queryset = self.get_queryset()
            try:
                emailconfirmation = queryset.get(key=key.lower())
            except EmailConfirmation.DoesNotExist:
                raise Http404()
        return emailconfirmation

    def get_queryset(self):
        qs = EmailConfirmation.objects.all_valid()
        qs = qs.select_related("email_address__user")
        return qs

    def get_context_data(self, **kwargs):
        ctx = kwargs
        ctx["confirmation"] = self.object
        site = get_current_site(self.request)
        ctx.update({"site": site})
        return ctx

    def get_redirect_url(self):
        return get_adapter(self.request).get_email_confirmation_redirect_url(
            self.request
        )


class CallidonPasswordChangeView(PasswordChangeView):

    def get(self, request, *args, **kwargs):
        return super(CallidonPasswordChangeView, self).get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        # Capturar el token de reCAPTCHA del request
        recaptcha_token = request.POST.get('recaptcha_token')
        if not recaptcha_token:
            messages.error(request, "Missing reCAPTCHA token")
            return redirect("accounts/password/change/")

        # Enviar solicitud a Google para verificar el token
        recaptcha_response = self.verify_recaptcha(recaptcha_token)
        
        if not recaptcha_response['success']:
            # Si la verificación falla o el puntaje es bajo, retorna un error
            messages.error(request, "reCAPTCHA validation failed")
            return redirect("accounts/password/change/")

        return super(CallidonPasswordChangeView, self).post(request, *args, **kwargs)
    
    def verify_recaptcha(self, token):
        """
        Verifica el token de reCAPTCHA con la API de Google.
        Retorna la respuesta de Google en formato JSON.
        """
        recaptcha_secret = settings.RECAPTCHA_SECRET_KEY
        url = "https://www.google.com/recaptcha/api/siteverify"
        payload = {
            'secret': recaptcha_secret,
            'response': token
        }
        
        # Realiza la solicitud POST a la API de Google
        response = requests.post(url, data=payload)
        return response.json()

class CallidonPasswordResetView(PasswordResetView):
  
    def get(self, request, *args, **kwargs):
        return super(CallidonPasswordResetView, self).get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        # Capturar el token de reCAPTCHA del request
        recaptcha_token = request.POST.get('recaptcha_token')
        if not recaptcha_token:
            messages.error(request, "Missing reCAPTCHA token")
            return redirect("accounts/password/reset/")

        # Enviar solicitud a Google para verificar el token
        recaptcha_response = self.verify_recaptcha(recaptcha_token)
        
        if not recaptcha_response['success']:
            # Si la verificación falla o el puntaje es bajo, retorna un error
            messages.error(request, "reCAPTCHA validation failed")
            return redirect("accounts/password/reset/")

        return super(CallidonPasswordResetView, self).post(request, *args, **kwargs)
    
    def verify_recaptcha(self, token):
        """
        Verifica el token de reCAPTCHA con la API de Google.
        Retorna la respuesta de Google en formato JSON.
        """
        recaptcha_secret = settings.RECAPTCHA_SECRET_KEY
        url = "https://www.google.com/recaptcha/api/siteverify"
        payload = {
            'secret': recaptcha_secret,
            'response': token
        }
        
        # Realiza la solicitud POST a la API de Google
        response = requests.post(url, data=payload)
        return response.json()
    
class LandingPageView(View):
    model = LandingPage
    template_name = 'landing-page.html'
    canonical_base_url = 'https://callidonequipment.com/'

    def get(self, *args, **kwargs):
        landing = LandingPage.objects.get(slug=self.kwargs['slug'])
        style_files = []
        script_files = []
        split_lines_re = re.compile(r'\r|\n|\r\n*', re.IGNORECASE)
        # print(landing.style_files.split('\n'))
        # re.split()

        if landing.style_files is not None:
            style_files = [ file if file != '' else None for file in re.split(split_lines_re, landing.style_files) ]
            # print(style_files)
            # style_files = landing.style_files.split('\n')

        if landing.script_files is not None:
            script_files = [ file if file != '' else None for file in re.split(split_lines_re, landing.script_files) ]
        
        context = {
            'title': landing.title,
            'meta_title': landing.meta_title,
            'meta_description': landing.meta_description,
            'meta_keywords': landing.meta_keywords,
            'canonical_url':  self.canonical_base_url + landing.slug,
            'is_indexable': landing.is_indexable,
            'content': landing.content,
            'slug': landing.slug,
            'featured_image': landing.featured_image,
            'is_indexable': landing.is_indexable,
            'additional_css': landing.additional_css,
            'includes_icon_bar': landing.includes_icon_bar,
            'includes_floating_contact_icons': landing.includes_floating_contact_icons,
            'style_files': style_files,
            'script_files': script_files,
        }

        return render(self.request, self.template_name, context)
    
class CallidonAutoleadsGeneratorHandler(View):
    
    autoleads_token = 'ddv6ypwrm1o7qua32359m'
    template_name = "product-leads-success.html"

    def get(self, *args, **kwargs):
        context = self.request.session.pop('autoleads_context', None)
        print(context)
        if context:
            return render(self.request, self.template_name, context)
        else:
            return redirect("/")

    def post(self, *args, **kwargs):
        
        error = JsonResponse({
                    'error': True,
                    'redirect_url': '/autoleads-collect/'
                })
        if self.request.is_ajax:
            try:
                request_body = parse_qs(
                    self.request.body.decode('utf-8')
                )
            except json.JSONDecodeError:
                return error
            
            recaptcha_token = self.request.POST.get('recaptcha_token')
            if not recaptcha_token:
                messages.error(self.request, "Missing reCAPTCHA token")
                return error

            # Enviar solicitud a Google para verificar el token
            recaptcha_response = self.verify_recaptcha(recaptcha_token)
            
            if not recaptcha_response['success']:
                return error

            response = requests.post(
                'https://freight-quote-request.netlify.app/.netlify/functions/autolead',
                data={
                    'name': request_body['name'][0],
                    'email': request_body['email'][0],
                    'city': request_body['city'][0],
                    'phone': request_body['phone'][0],
                    'zip': request_body['zip'][0],
                    'commodity': request_body['commodity'][0],
                    'token': self.autoleads_token
                }
            )

            if response.ok:
                try:
                    send_mail(
                        "A NEW FREIGHT REQUEST WAS RECEIVED BY: %s" % ( request_body['name'][0].upper() ) ,
                        NEW_LEAD_GENERATED_EMAIL.format(
                            request_body['commodity'][0],
                            request_body['name'][0],
                            request_body['email'][0],
                            request_body['phone'][0],
                            request_body['city'][0],
                            request_body['zip'][0]
                        ),
                        "info@callidongroup.com",
                        [ "callidonsales@gmail.com" ]
                    )
                    
                    self.request.session['autoleads_context'] = {
                        'product_name': request_body['commodity'][0],
                        'error': False,
                        'product_url': '/inventory/' + request_body['product'][0]
                    }
                    self.request.session.save()

                    return JsonResponse({
                        'success': True,
                        'redirect_url': '/autoleads-collect/'
                    })
                except:
                    return error
            else:
                return error
        else:
            return error

    def verify_recaptcha(self, token):
        """
        Verifica el token de reCAPTCHA con la API de Google.
        Retorna la respuesta de Google en formato JSON.
        """
        recaptcha_secret = settings.RECAPTCHA_SECRET_KEY
        url = "https://www.google.com/recaptcha/api/siteverify"
        payload = {
            'secret': recaptcha_secret,
            'response': token
        }
        
        # Realiza la solicitud POST a la API de Google
        response = requests.post(url, data=payload)
        return response.json()


def remove_single_item_from_cart(request, slug):
    item = get_object_or_404(Item, slug=slug)
    order_qs = Order.objects.filter(
        user=request.user,
        ordered=False)
    if order_qs.exists():
        order = order_qs[0]
        # check if the order item is in the order
        if order.items.filter(item__slug=item.slug).exists():
            order_item = OrderItem.objects.filter(
                item=item,
                user=request.user,
                ordered=False
            )[0]
            if order_item.quantity > 1:
                order_item.quantity -= 1
                order_item.save()
            else:
                order.items.remove(order_item)
            messages.info(request, "This item qty was updated.")
            return redirect("core:order-summary")
        else:
            # add a message saying the user dosent have an order
            messages.info(request, "Item was not in your cart.")
            return redirect("core:product", slug=slug)
    else:
        # add a message saying the user dosent have an order
        messages.info(request, "u don't have an active order.")
        return redirect("core:product", slug=slug)
    return redirect("core:product", slug=slug)


def get_coupon(request, code):
    try:
        coupon = Coupon.objects.get(code=code)
        return coupon
    except ObjectDoesNotExist:
        messages.info(request, "This coupon does not exist")
        return redirect("core:checkout")


class AddCouponView(View):
    def post(self, *args, **kwargs):
        form = CouponForm(self.request.POST or None)
        if form.is_valid():
            try:
                code = form.cleaned_data.get('code')
                order = Order.objects.get(
                    user=self.request.user, ordered=False)
                order.coupon = get_coupon(self.request, code)
                order.save()
                messages.success(self.request, "Successfully added coupon")
                return redirect("core:checkout")

            except ObjectDoesNotExist:
                messages.info(self.request, "You do not have an active order")
                return redirect("core:checkout")


class RequestRefundView(View):
    def get(self, *args, **kwargs):
        form = RefundForm()
        context = {
            'form': form
        }
        return render(self.request, "request_refund.html", context)

    def post(self, *args, **kwargs):
        form = RefundForm(self.request.POST)
        if form.is_valid():
            ref_code = form.cleaned_data.get('ref_code')
            message = form.cleaned_data.get('message')
            email = form.cleaned_data.get('email')
            # edit the order
            try:
                order = Order.objects.get(ref_code=ref_code)
                order.refund_requested = True
                order.save()

                # store the refund
                refund = Refund()
                refund.order = order
                refund.reason = message
                refund.email = email
                refund.save()

                messages.info(self.request, "Your request was received")
                return redirect("core:request-refund")

            except ObjectDoesNotExist:
                messages.info(self.request, "This order does not exist")
                return redirect("core:request-refund")

class DieselGeneratorsView(View):
    def get(self, *args, **kwargs):
        return redirect('/inventory/?category=Diesel%20Generators')
