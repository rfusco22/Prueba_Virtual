from django import template
from django.utils.safestring import mark_safe

from core.models import Item

register = template.Library()


@register.simple_tag
def product_images(object):
    
    imgtempl = """
        <div class="item-slick3" data-thumb="{img}">
            <div class="wrap-pic-w" style="display: flex; justify-content: center; align-items: center;">
                <img src="{img}" alt="{title}" class="slideshow-img" style="height:700px; width:auto;" onclick="loadmodal({idx})">
            </div>
            {iframe}
        </div>
    """
    videotempl = """
        <div class="wrap-pic-w">
            <video class="wrap-pic-w" height="700" controls="controls" preload="metadata" id="listing-video">
                <source src="{url}" type="video/mp4">
            </video>
        </div>
    """
    ret = ""
    for i in range(20):
        imgfield = "image" + str(i+1)
        if getattr(object, imgfield) != "":
            ret += imgtempl.format(
                img=getattr(object, imgfield).url,
                title=object.title,
                idx=i,
                iframe=object.youtube_iframe if object.youtube_iframe != None else ""
            )
    if object.video != "":
        ret += videotempl.format(url=object.video.url)

    return mark_safe(ret)