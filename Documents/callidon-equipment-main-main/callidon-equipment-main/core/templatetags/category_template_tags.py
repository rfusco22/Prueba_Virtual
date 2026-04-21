from django import template
from django.utils.safestring import mark_safe
import re

from core.models import Category

register = template.Library()


@register.simple_tag
def categories():
    items = Category.objects.filter(is_active=True).order_by('title')
    items_li = ""
    for i in items:
        items_li += """<li><a href="/inventory/?category={}">{}</a></li>""".format(i.title, i.title)
    return mark_safe(items_li)

@register.simple_tag
def categories_mobile():
    items = Category.objects.filter(is_active=True).order_by('title')
    items_li = ""
    for i in items:
        items_li += """<li class="item-menu-mobile"><a href="/inventory/?category={}">{}</a></li>""".format(i.title, i.title)
    return mark_safe(items_li)


@register.simple_tag
def categories_li_a():
    items = Category.objects.filter(is_active=True).order_by('title')
    items_li_a = ""
    for i in items:
        items_li_a += """<li class="p-t-4"><a href="/inventory/?category={}" class="s-text13">{}</a></li>""".format(i.title,
                                                                                                         i.title)
    return mark_safe(items_li_a)


@register.simple_tag
def category_selector(selected_category):
    items = Category.objects.filter(is_active=True).order_by('title')
    html = '<select class="selection-2 mb-2" name="category" selected="Air Compressors" id="category" onchange="update_sorting(this.form);clear_empty_fields(this.form);this.form.submit();">\n'
    html += '<option value="All">All</option>\n'
    for i in items:
        if selected_category == i.title:
            html += '<option value="{}" selected="selected">{}</option>'.format(i.title, i.title)    
        else:
            html += '<option value="{}">{}</option>'.format(i.title, i.title)
    html += '</select>\n'
    return mark_safe(html)


@register.simple_tag
def categories_div():
    """
    section banner
    :return:
    """
    items = Category.objects.filter(is_active=True).order_by('title')
    items_div = ""
    item_div_list = ""
    for i, j in enumerate(items):
        if (i+1) % 3:
            items_div += """
                <a href="/inventory/?category={}">
                    <div class="block1 hov-img-zoom pos-relative m-b-30">
                        <img src="/media/{}" alt="IMG-BENNER">
                        <div class="block1-wrapbtn w-size2">
                            <a href="/inventory/?category={}" class="flex-c-m size2 m-text2 bg3 hov1 trans-0-4">
                                {}
                            </a>
                        </div>
                    </div>
                </a>""".format(j.title, j.image, j.title, j.title)
        else:
            items_div_ = """
                <a href="/inventory/?category={}">
                    <div class="block1 hov-img-zoom pos-relative m-b-30">
                        <img src="/media/{}" alt="IMG-BENNER">
                        <div class="block1-wrapbtn w-size2">
                            <a href="/inventory/?category={}" class="flex-c-m size2 m-text2 bg3 hov1 trans-0-4">
                                {}
                            </a> 
                        </div>
                    </div>
                </a>""".format(j.title, j.image, j.title, j.title)
            item_div_list += """<div class="col-sm-10 col-md-8 col-lg-4 m-l-r-auto">""" + \
                             items_div + items_div_ + """</div>"""
            items_div = ""

    return mark_safe(item_div_list)


@register.filter
def regex_extract(text, pattern):
    """
    Extract first match from text using regex pattern, including units for capacity.
    Usage: {{ item.title|regex_extract:"(\d+(?:\.\d+)?)\s*(kW|kVA)" }}
    Returns the entire matched string (number + unit), otherwise empty string.
    """
    if not text:
        return ""
    try:
        match = re.search(pattern, str(text))
        if match:
            # Return the entire match (includes both number and unit)
            return match.group(0)
        return ""
    except Exception:
        return ""

