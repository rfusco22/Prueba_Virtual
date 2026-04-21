
(function ($) {
    "use strict";

    /*[ Load page ]
    ===========================================================*/
    $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 1500,
        outDuration: 800,
        linkElement: '.animsition-link',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'animsition-loading-1',
        loadingInner: '<div data-loader="ball-scale"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: [ 'animation-duration', '-webkit-animation-duration'],
        overlay : false,
        overlayClass : 'animsition-overlay-slide',
        overlayParentElement : 'html',
        transition: function(url){ window.location.href = url; }
    });
    
    /*[ Back to top ]
    ===========================================================*/
    var windowH = $(window).height()/2;

    $(window).on('scroll',function(){
        if ($(this).scrollTop() > windowH) {
            $("#myBtn").css('display','flex');
        } else {
            $("#myBtn").css('display','none');
        }
    });

    $('#myBtn').on("click", function(){
        $('html, body').animate({scrollTop: 0}, 300);
    });


    /*[ Show header dropdown ]
    ===========================================================*/
    $('.js-show-header-dropdown').on('click', function(){
        $(this).parent().find('.header-dropdown')
    });

    var menu = $('.js-show-header-dropdown');
    var sub_menu_is_showed = -1;

    for(var i=0; i<menu.length; i++){
        $(menu[i]).on('click', function(){ 
            
                if(jQuery.inArray( this, menu ) == sub_menu_is_showed){
                    $(this).parent().find('.header-dropdown').toggleClass('show-header-dropdown');
                    sub_menu_is_showed = -1;
                }
                else {
                    for (var i = 0; i < menu.length; i++) {
                        $(menu[i]).parent().find('.header-dropdown').removeClass("show-header-dropdown");
                    }

                    $(this).parent().find('.header-dropdown').toggleClass('show-header-dropdown');
                    sub_menu_is_showed = jQuery.inArray( this, menu );
                }
        });
    }

    $(".js-show-header-dropdown, .header-dropdown").click(function(event){
        event.stopPropagation();
    });

    $(window).on("click", function(){
        for (var i = 0; i < menu.length; i++) {
            $(menu[i]).parent().find('.header-dropdown').removeClass("show-header-dropdown");
        }
        sub_menu_is_showed = -1;
    });


     /*[ Fixed Header ]
    ===========================================================*/
    var posWrapHeader = $('.topbar').height();
    var header = $('.container-menu-header');

    $(window).on('scroll',function(){

        if($(this).scrollTop() >= posWrapHeader) {
            $('.header1').addClass('fixed-header');
            $(header).css('top',-posWrapHeader); 

        }  
        else {
            var x = - $(this).scrollTop(); 
            $(header).css('top',x); 
            $('.header1').removeClass('fixed-header');
        } 

        if($(this).scrollTop() >= 200 && $(window).width() > 992) {
            $('.fixed-header2').addClass('show-fixed-header2');
            $('.header2').css('visibility','hidden'); 
            $('.header2').find('.header-dropdown').removeClass("show-header-dropdown");
            
        }  
        else {
            $('.fixed-header2').removeClass('show-fixed-header2');
            $('.header2').css('visibility','visible'); 
            $('.fixed-header2').find('.header-dropdown').removeClass("show-header-dropdown");
        } 

    });
    
    /*[ Icon bar toggle on click/touch ]
    ===========================================================*/
    var iconBarExpanded = false;
    
    $('.icon-bar').on('click', function(e){
        // Only toggle on click if not a direct link click
        if(!$(e.target).is('a')) {
            e.preventDefault();
            iconBarExpanded = !iconBarExpanded;
            $(this).toggleClass('expanded');
            
            // Close on click outside (on mobile/touch devices)
            if(iconBarExpanded) {
                $(document).one('click', function(){
                    iconBarExpanded = false;
                    $('.icon-bar').removeClass('expanded');
                });
            }
        }
    });
    
    // Allow direct link clicks in expanded state
    $('.icon-bar a').on('click', function(e){
        e.stopPropagation();
    });

    /*[ Show menu mobile ]
    ===========================================================*/
    $('.btn-show-menu-mobile').on('click', function(){
        $(this).toggleClass('is-active');
        $('.wrap-side-menu').slideToggle();
    });

    var arrowMainMenu = $('.arrow-main-menu');

    for(var i=0; i<arrowMainMenu.length; i++){
        $(arrowMainMenu[i]).on('click', function(){
            $(this).parent().find('.sub-menu').slideToggle();
            $(this).toggleClass('turn-arrow');
        })
    }

    $(window).resize(function(){
        if($(window).width() >= 992){
            if($('.wrap-side-menu').css('display') == 'block'){
                $('.wrap-side-menu').css('display','none');
                $('.btn-show-menu-mobile').toggleClass('is-active');
            }
            if($('.sub-menu').css('display') == 'block'){
                $('.sub-menu').css('display','none');
                $('.arrow-main-menu').removeClass('turn-arrow');
            }
        }
    });


    /*[ remove top noti ]
    ===========================================================*/
    $('.btn-romove-top-noti').on('click', function(){
        $(this).parent().remove();
    })


    /*[ Block2 button wishlist ]
    ===========================================================*/
    $('.block2-btn-addwishlist').on('click', function(e){
        e.preventDefault();
        $(this).addClass('block2-btn-towishlist');
        $(this).removeClass('block2-btn-addwishlist');
        $(this).off('click');
    });

    /*[ +/- num product ]
    ===========================================================*/
    $('.btn-num-product-down').on('click', function(e){
        e.preventDefault();
        var numProduct = Number($(this).next().val());
        if(numProduct > 1) $(this).next().val(numProduct - 1);
    });

    $('.btn-num-product-up').on('click', function(e){
        e.preventDefault();
        var numProduct = Number($(this).prev().val());
        $(this).prev().val(numProduct + 1);
    });


    /*[ Show content Product detail ]
    ===========================================================*/
    $('.active-dropdown-content .js-toggle-dropdown-content').toggleClass('show-dropdown-content');
    $('.active-dropdown-content .dropdown-content').slideToggle('fast');

    $('.js-toggle-dropdown-content').on('click', function(){
        $(this).toggleClass('show-dropdown-content');
        $(this).parent().find('.dropdown-content').slideToggle('fast');
    });


    /*[ Play video 01]
    ===========================================================*/
    var srcOld = $('.video-mo-01').children('iframe').attr('src');

    $('[data-target="#modal-video-01"]').on('click',function(){
        $('.video-mo-01').children('iframe')[0].src += "&autoplay=1";

        setTimeout(function(){
            $('.video-mo-01').css('opacity','1');
        },300);      
    });

    $('[data-dismiss="modal"]').on('click',function(){
        $('.video-mo-01').children('iframe')[0].src = srcOld;
        $('.video-mo-01').css('opacity','0');
    });

    /* Google Recaptcha token generation for login  */
    grecaptcha.ready(function() {
        $('#login').on('submit', function(e) {
            e.preventDefault();

            grecaptcha.execute('6Le01WgqAAAAAIpydD93bGTrhcqwk4Xc5c2jZ0D6', { action: 'login' }).then(function(token) {
                $.ajax('/accounts/login/', {
                    method: 'POST',
                    contentType: 'application/x-www-form-urlencoded',
                    beforeSend: function(xhr) { 
                        xhr.setRequestHeader('X-CSRFToken', $('input[name="csrfmiddlewaretoken"]').val()); 
                    },
                    data: {
                        login: $('#id_login').val(),
                        password: $('#id_password').val(),
                        remember: $('#id_remember').val(),
                        recaptcha_token: token,
                    },
                    success: function( result ) {
                        window.alert('Login successful');
                        window.location.href = "/";
                    },
                    error: function( err ) {
                        window.location.href = "/accounts/login/error";
                    },
                });
            });
        });
    });

    /* Google Recaptcha token generation for signup  */
    grecaptcha.ready(function() {
        $('#signup_form').on('submit', function(e) {
            e.preventDefault();

            grecaptcha.execute('6Le01WgqAAAAAIpydD93bGTrhcqwk4Xc5c2jZ0D6', { action: 'signup' }).then(function(token) {
                $.ajax('/accounts/signup/', {
                    method: 'POST',
                    contentType: 'application/x-www-form-urlencoded',
                    beforeSend: function(xhr) { 
                        xhr.setRequestHeader('X-CSRFToken', $('input[name="csrfmiddlewaretoken"]').val()); 
                    },
                    data: {
                        email: $('#id_email').val(),
                        password1: $('#id_password1').val(),
                        password2: $('#id_password2').val(),
                        recaptcha_token: token,
                    },
                    success: function( result ) {
                        window.location.href="/";
                    },
                    error: function( err ) {
                        window.location.href="/accounts/login/error";
                    },
                });
            });
        });
    });

    /* Google Recaptcha token generation for password change  */
    grecaptcha.ready(function() {
        $('#password_change_form').on('submit', function(e) {
            e.preventDefault();

            grecaptcha.execute('6Le01WgqAAAAAIpydD93bGTrhcqwk4Xc5c2jZ0D6', { action: 'password_change' }).then(function(token) {
                $.ajax('/accounts/password/change/', {
                    method: 'POST',
                    contentType: 'application/x-www-form-urlencoded',
                    beforeSend: function(xhr) { 
                        xhr.setRequestHeader('X-CSRFToken', $('input[name="csrfmiddlewaretoken"]').val()); 
                    },
                    data: {
                        oldpassword: $('#id_oldpassword').val(),
                        password1: $('#id_password1').val(),
                        password2: $('#id_password2').val(),
                        recaptcha_token: token,
                    },
                    success: function( result ) {
                        window.location.href="/";
                    },
                    error: function( err ) {
                        window.location.href="/accounts/login/error";
                    },
                });
            });
        });
    });

    /* Google Recaptcha token generation for password change  */
    grecaptcha.ready(function() {
        $('#password_reset_form').on('submit', function(e) {
            e.preventDefault();

            grecaptcha.execute('6Le01WgqAAAAAIpydD93bGTrhcqwk4Xc5c2jZ0D6', { action: 'password_reset' }).then(function(token) {
                $.ajax('/accounts/password/reset/', {
                    method: 'POST',
                    contentType: 'application/x-www-form-urlencoded',
                    beforeSend: function(xhr) { 
                        xhr.setRequestHeader('X-CSRFToken', $('input[name="csrfmiddlewaretoken"]').val()); 
                    },
                    data: {
                        email: $('#id_email').val(),
                        recaptcha_token: token,
                    },
                    success: function( result ) {
                        window.location.href="/";
                    },
                    error: function( err ) {
                        window.location.href="/accounts/login/error";
                    },
                });
            });
        });
    });

    /* Google Recaptcha token generation for freight quote request form  */
    grecaptcha.ready(function() {
        $('#leads_form').on('submit', function(e) {
            e.preventDefault();

            grecaptcha.execute('6Le01WgqAAAAAIpydD93bGTrhcqwk4Xc5c2jZ0D6', { action: 'freight_quote_req' }).then(function(token) {
                $.ajax('/autoleads-collect/', {
                    method: 'POST',
                    contentType: 'application/x-www-form-urlencoded',
                    beforeSend: function(xhr) { 
                        xhr.setRequestHeader('X-CSRFToken', $('input[name="csrfmiddlewaretoken"]').val()); 
                    },
                    data: {
                        name: $('#name').val(),
                        email: $('#email').val(),
                        city: $('#city').val(),
                        phone: $('#phone').val(),
                        zip: $('#zip').val(),
                        commodity: $('#commodity').val(),
                        product: $('#product').val(),
                        recaptcha_token: token,
                    },
                    success: function( result ) {
                        console.log(result);
                        // window.alert('Result was success');
                        window.location.href = result.redirect_url;
                    },
                    error: function( err ) {
                        console.err(err);
                        // window.alert('Result was error');
                        window.location.href = result.redirect_url;
                    },
                });
            });
        });
    });

    /* Google Recaptcha token generation for add to cart  */
    grecaptcha.ready(function() {
        $('a[href*="/add-to-cart/"]').on('click', function(e) {
            console.log('Add to cart clicked');
            
            e.preventDefault();
            var cartUrl = $(this).attr('href');
            
            grecaptcha.execute('6Le01WgqAAAAAIpydD93bGTrhcqwk4Xc5c2jZ0D6', { action: 'add_to_cart' }).then(function(token) {
                // Redirect to add-to-cart with token as query parameter
                window.location.href = cartUrl + '?recaptcha_token=' + token;
            });
        });
    });

    // $('#leads_form').on('submit', function(e) {
    //     e.preventDefault();

    //     $.ajax('/autoleads-collect/', {
    //         method: 'POST',
    //         contentType: 'application/json',
    //         beforeSend: function(xhr) { 
    //             xhr.setRequestHeader('X-CSRFToken', $('input[name="csrfmiddlewaretoken"]').val()); 
    //         },
    //         data: {
    //             name: $('#name').val(),
    //             email: $('#email').val(),
    //             city: $('#city').val(),
    //             phone: $('#phone').val(),
    //             zip: $('#zip').val(),
    //             commodity: $('#commodity').val()
    //         },
    //         success: function( result ) {
    //             console.log(result);
    //             window.alert('Result was success');
    //             // window.location.href = "/";
    //         },
    //         error: function( err ) {
    //             console.err(err);
    //             window.alert('Result was error');
    //             // window.location.href = "/accounts/login/error";
    //         },
    //     });
    // });

})(jQuery);