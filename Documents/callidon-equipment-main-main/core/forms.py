from django import forms

class ReviewOrderForm(forms.Form):
    edit_address = forms.BooleanField(required=False, widget=forms.TextInput(attrs={
        'style': 'display:none;'
    }))
    edit_order = forms.BooleanField(required=False, widget=forms.TextInput(attrs={
        'style': 'display:none;'
    }))

class CheckoutForm(forms.Form):
    bill_name = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Individual or Business Name',
        'class': 'form-control'
    }))
    bill_street_address = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': '1234 Main St',
        'class': 'form-control'
    }))
    bill_apartment_address = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'placeholder': 'Apartment or suite',
        'class': 'form-control'
    }))
    bill_country = forms.CharField(widget=forms.Select(attrs={
        'class': 'custom-select d-block w-100',
        'onchange': "print_state('id_bill_state',this.selectedIndex);"
    }))
    bill_city = forms.CharField(widget=forms.TextInput(attrs={
        'class': 'form-control'
    }))
    bill_state = forms.CharField(widget=forms.Select(attrs={
        'class': 'custom-select d-block w-100'
    }))
    bill_zip = forms.CharField(widget=forms.TextInput(attrs={
        'class': 'form-control'
    }))
    local_pickup = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={
        'class': 'custom-control-input',
        'onchange': 'toggleShippingAddress()'
    }))
    same_shipping_address = forms.BooleanField(required=False,  widget=forms.CheckboxInput(attrs={
        'class': 'custom-control-input',
        'onchange': 'toggleShippingAddress()',
        'checked': ""
    }))
    ship_name = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'placeholder': 'Individual or Business Name',
        'class': 'form-control'
    }))
    ship_street_address = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'placeholder': '1234 Main St',
        'class': 'form-control'
    }))
    ship_apartment_address = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'placeholder': 'Apartment or suite',
        'class': 'form-control'
    }))
    ship_country = forms.CharField(required=False, widget=forms.Select(attrs={
        'class': 'custom-select d-block w-100',
        'onchange': "print_state('id_ship_state',this.selectedIndex);"
    }))
    ship_city = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'class': 'form-control'
    }))
    ship_state = forms.CharField(required=False, widget=forms.Select(attrs={
        'class': 'custom-select d-block w-100'
    }))
    ship_zip = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'class': 'form-control'
    }))


class EstimateShippingForm(forms.Form):
    # zip = forms.CharField(widget=forms.TextInput(attrs={
    #     'placeholder': '12345',
    #     'class': 'zip'
    # }))
    zip = forms.CharField(widget=forms.NumberInput(attrs={
        'placeholder': '12345',
        'class': 'zip',
        'min' : 0,
        'max' : 99999
    }))


class CouponForm(forms.Form):
    code = forms.CharField(widget=forms.TextInput(attrs={
        'class': 'form-control',
        'placeholder': 'Promo code'
    }))


class RefundForm(forms.Form):
    ref_code = forms.CharField()
    message = forms.CharField(widget=forms.Textarea(attrs={
        'rows': 4
    }))
    email = forms.EmailField()


