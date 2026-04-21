from django.conf import settings
from django.db import models
from django.shortcuts import reverse
from django_countries.fields import CountryField
from django.contrib.sitemaps import Sitemap

import datetime as dt
import os
# from django.views.generic.author import AuthorMixin

# Create your models here.
CATEGORY_CHOICES = (
    ('SB', 'Shirts And Blouses'),
    ('TS', 'T-Shirts'),
    ('SK', 'Skirts'),
    ('HS', 'Hoodies&Sweatshirts')
)

LABEL_CHOICES = (
    ('S', 'sale'),
    ('N', 'new'),
    ('P', 'promotion'),
    ('U', 'sold')
)

ADDRESS_CHOICES = (
    ('B', 'Billing'),
    ('S', 'Shipping'),
)

def comma_price(price):
    val = str(price)
    idx = len(val) - 1
    ret = ""
    count = 0
    while idx >= 0:
        if count > 0 and count % 3 == 0:
            ret = ',' + ret
        ret = val[idx] + ret
        idx -= 1
        count += 1
    
    if ret[0] == ',':
        ret = ret[1:]

    return ret

class Slide(models.Model):
    caption1 = models.CharField(max_length=100)
    caption2 = models.CharField(max_length=100)
    link = models.CharField(max_length=100)
    image = models.ImageField(help_text="Size: 1920x570")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return "{} - {}".format(self.caption1, self.caption2)

class Category(models.Model):
    title = models.CharField(max_length=100)
    slug = models.SlugField()
    description = models.TextField()
    image = models.ImageField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("core:category", kwargs={
            'slug': self.slug
        })

class LandingPage(models.Model):
    title = models.CharField(max_length=100)
    meta_title = models.CharField(max_length=100, null=True, blank=True)
    meta_description = models.TextField(null=True)
    meta_keywords = models.TextField()
    # canonical_url = models.TextField(default=None)
    is_indexable = models.BooleanField(default=True)
    slug = models.SlugField(max_length=255)
    featured_image = models.ImageField()
    # main_section_image = models.ImageField(blank=True)
    # is_published = models.BooleanField(default=False)
    # is_draft = models.BooleanField(default=False)
    # is_trash = models.BooleanField(default=False)
    content = models.TextField(default=None)
    # created_at = models.DateTimeField(default=Now())
    # edited_at = models.DateTimeField(default=Now())
    additional_css = models.TextField(default=None, null=True, blank=True)
    style_files = models.TextField(default=None, null=True, blank=True)
    script_files = models.TextField(default=None, null=True, blank=True)
    includes_icon_bar = models.BooleanField(default=True)
    includes_floating_contact_icons = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("core:landing-page", kwargs={
            'slug': self.slug
        })

class Item(models.Model):
    title = models.CharField(max_length=100)
    
    meta_title = models.CharField(max_length=100, null=True, blank=True)
    meta_description = models.TextField(null=True)
    meta_keywords = models.TextField(null=True)
    # canonical_url = models.TextField(blank=True)
    featured_image = models.ImageField(blank=True)
    is_indexable = models.BooleanField(default=True)
    # created_at = models.DateTimeField(auto_now=True)
    # edited_at = models.DateTimeField(auto_now=True)
    
    price = models.IntegerField()
    discount_price = models.IntegerField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    label = models.CharField(choices=LABEL_CHOICES, max_length=1, blank=True)
    slug = models.SlugField()
    make = models.CharField(max_length=30)
    model = models.CharField(max_length=30)
    year = models.IntegerField()
    engine = models.CharField(max_length=50)
    stock_no = models.CharField(max_length=10)
    hours = models.IntegerField()
    weight = models.IntegerField()
    description = models.TextField()
    sorting_position = models.FloatField(blank=True, default=0)
    image1 = models.ImageField()
    image2 = models.ImageField(blank=True)
    image3 = models.ImageField(blank=True)
    image4 = models.ImageField(blank=True)
    image5 = models.ImageField(blank=True)
    image6 = models.ImageField(blank=True)
    image7 = models.ImageField(blank=True)
    image8 = models.ImageField(blank=True)
    image9 = models.ImageField(blank=True)
    image10 = models.ImageField(blank=True)
    image11 = models.ImageField(blank=True)
    image12 = models.ImageField(blank=True)
    image13 = models.ImageField(blank=True)
    image14 = models.ImageField(blank=True)
    image15 = models.ImageField(blank=True)
    image16 = models.ImageField(blank=True)
    image17 = models.ImageField(blank=True)
    image18 = models.ImageField(blank=True)
    image19 = models.ImageField(blank=True)
    image20 = models.ImageField(blank=True)
    video = models.FileField(blank=True)
    youtube_iframe = models.TextField(blank=True, null=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("core:product", kwargs={
            'slug': self.slug
        })

    def get_add_to_cart_url(self):
        return reverse("core:add-to-cart", kwargs={
            'slug': self.slug
        })

    def get_remove_from_cart_url(self):
        return reverse("core:remove-from-cart", kwargs={
            'slug': self.slug
        })

    def is_warranty_eligible(self):
        year_elegible = dt.datetime.now().year - self.year <= 7
        hours_eligible = self.hours <= 7000
        return year_elegible and hours_eligible
    
    def price_str(self):
        return comma_price(self.price)
    
    def discount_price_str(self):
        if self.discount_price:
            return comma_price(self.discount_price)
        return None

class OrderItem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.item.title}"

    def get_total_item_price(self):
        return self.quantity * self.item.price

    def get_total_discount_item_price(self):
        return self.quantity * self.item.discount_price

    def get_amount_saved(self):
        return self.get_total_item_price() - self.get_total_discount_item_price()

    def get_final_price(self):
        if self.item.discount_price:
            return self.get_total_discount_item_price()
        return self.get_total_item_price()

class Order(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    ref_code = models.CharField(max_length=20)
    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()
    ordered = models.BooleanField(default=False)
    shipping_address = models.ForeignKey(
        'BillingAddress',
        related_name='shipping_address',
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    billing_address = models.ForeignKey(
        'BillingAddress',
        related_name='billing_address',
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    payment = models.ForeignKey(
        'Payment',
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    coupon = models.ForeignKey(
        'Coupon',
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    being_delivered = models.BooleanField(default=False)
    received = models.BooleanField(default=False)
    refund_requested = models.BooleanField(default=False)
    refund_granted = models.BooleanField(default=False)
    freight_estimate = models.FloatField(default=0)
    local_pickup = models.BooleanField(default=False)

    '''
    1. Item added to cart
    2. Adding a BillingAddress
    (Failed Checkout)
    3. Payment
    4. Being delivered
    5. Received
    6. Refunds
    '''

    def __str__(self):
        return self.user.username
    
    def get_tax(self):
        return round(self.get_total() * 0.07, 2)    

    def get_total_with_tax(self):
        return self.get_total() + self.get_tax()

    # def get_freight_cost(self, zip):
    #     url = f'https://www.uship.com/price_estimator.aspx?w=5000&z1=33142&z2={zip}&country1=US&country2=US&v=Widget&s=391&c=391'
    #     resp = requests.api.get(url)
    #     soup = BeautifulSoup(resp.content, 'html.parser')
    #     est_str = soup.find('div', id)
    #     return

    def get_total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_final_price()
        # if self.coupon:
        #     total -= self.coupon.amount
        
        return total


class BillingAddress(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)
    street_address = models.CharField(max_length=100)
    apartment_address = models.CharField(max_length=100)
    country = CountryField(multiple=False)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    zip = models.CharField(max_length=100)
    address_type = models.CharField(max_length=1, choices=ADDRESS_CHOICES)
    default = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name_plural = 'BillingAddresses'

    def to_str(self):
        return """
        Name:       {}
        Address:    {}
        City:       {}
        State:      {}
        Zip:        {}  
""".format(self.name,
           self.street_address,
           self.city, self.state,
           self.zip)


class Payment(models.Model):
    stripe_charge_id = models.CharField(max_length=50)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.SET_NULL, blank=True, null=True)
    amount = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username


class Coupon(models.Model):
    code = models.CharField(max_length=15)
    amount = models.FloatField()

    def __str__(self):
        return self.code


class Refund(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    reason = models.TextField()
    accepted = models.BooleanField(default=False)
    email = models.EmailField()

    def __str__(self):
        return f"{self.pk}"
    


class HttpsSitemap(Sitemap):
    priority = 0.7
    changefreq = 'weekly'
    protocol = 'https'

    def __init__(self, info_dict, priority=priority, changefreq=changefreq, protocol=protocol):
        self.queryset = info_dict['queryset']
        self.date_field = info_dict.get('date_field')
        self.priority = priority
        self.changefreq = changefreq
        self.protocol = protocol

    def items(self):
        # Make sure to return a clone; we don't want premature evaluation.
        return self.queryset.filter()

    def lastmod(self, item):
        if self.date_field is not None:
            return getattr(item, self.date_field)
        return None


from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.contrib.auth.models import User


@receiver(pre_save, sender=User)
def user_saved(sender, instance, **kwargs):
    instance.username = instance.email

@receiver(post_save, sender=Item)
def item_saved(sender, instance, **kwargs):
    # Change permissions anytime a new item is created
    os.system("sudo chown -cR nginx:nginx /var/www/callidonequipment.com/media/*")