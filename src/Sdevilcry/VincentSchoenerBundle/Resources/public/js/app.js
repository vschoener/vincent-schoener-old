
"use strict";
var scrollDirection, $ = jQuery;

// for scrolling to targeted sections

(function($) {
    $.fn.scrollingTo = function( opts ) {
        var defaults = {
            animationTime : 1000,
            easing : 'ease',
            topSpace : 0,
            callbackBeforeTransition : function(){},
            callbackAfterTransition : function(){}
        };

        var config = $.extend( {}, defaults, opts );

        $(this).on('click', function(e){
            var eventVal = e;
            e.preventDefault();

            var $section = $(document).find( $(this).data('section') );
            if ( $section.length < 1 ) {
                return false;
            }

            if ( $('html, body').is(':animated') ) {
                $('html, body').stop( true, true );
            }

            var scrollPos = $section.offset().top;

            if ( $(window).scrollTop() == ( scrollPos + config.topSpace ) ) {
                return false;
            }

            config.callbackBeforeTransition(eventVal, $section);

            var newScrollPos = Math.round(scrollPos - config.topSpace);

            $('html, body').animate({scrollTop: newScrollPos}, 1000, 'swing', function() {
                config.callbackAfterTransition(eventVal, $section);
            });

            return $(this);
        });

        $(this).data('scrollOps', config);
        return $(this);
    };
}(jQuery));

/**
 *
 * @param $container
 * @param y
 * @param duration
 */
function scrollYByRange($container, y, duration) {
    var height = $container[0].scrollHeight;
    var currentScrollPosition = $container.scrollTop();
    var newPosition = currentScrollPosition + y;

    if (newPosition > height) {
        newPosition = height;
    } else if (newPosition < 0) {
        newPosition = 0;
    }

    $container.getNiceScroll(0).doScrollTop(newPosition, duration);
}

$(document).ready(function($) {

    var $skillContainer = $('.skill-container-list');
    var $htmlScroll = $("html").niceScroll();
    var $skillScroll = $skillContainer.niceScroll({cursorcolor:"#008CBA"});

    $('.card').matchHeight();
    $(window).on('scroll', function() {
        // Look to display skill bar with animation
        var skillAnimation = false;
        if ($('#skill').is(':visible') && !skillAnimation) {
            $('.skill-item').each(function() {
                var width = $(this).data('percent') + '%';
                $(this).css('width', width);
            });
            skillAnimation = true;
        }
    });

    $('.skl-ctrl a.go-left').on('click', function() {
        scrollYByRange($skillContainer, -50, 1000);
    });

    $('.skl-ctrl a.go-right').on('click', function() {
        scrollYByRange($skillContainer, 50, 1000);
    });

    var edSlider = $("#educationSlider");
    edSlider.owlCarousel({
        slideSpeed : 600,
        items : 3,
        itemsDesktop : [1000,3],
        itemsDesktopSmall : [900,3],
        itemsTablet: [800,2],
        itemsMobile : [500, 1],
        pagination : false
    });
    var edData = edSlider.data('owlCarousel');


    var edTgt = $('.edu-ctrl').find('.go');
    edTgt.on('click', function(e){
        e.preventDefault();

        if($(this).hasClass('go-left')){
            edData.prev();
        } else {
            edData.next();
        }
    });

    var tesMoSlider = $("#testimonialSlider");
    tesMoSlider.owlCarousel({
        slideSpeed : 600,
        items : 2,
        itemsDesktop : [1000,2],
        itemsDesktopSmall : [900,2],
        itemsTablet: [600,1],
        itemsMobile : false,
        pagination : false
    });

    var tmoData = tesMoSlider.data('owlCarousel');


    var tmoTgt = $('.tmo-ctrl').find('.go');


    tmoTgt.on('click', function(e){
        e.preventDefault();

        if($(this).hasClass('go-left')){
            tmoData.prev();
        } else {
            tmoData.next();
        }
    });

    $('header section.top-bar-section a').scrollingTo({
        easing : 'easeOutQuart',
        animationTime : 1800,
        callbackAfterTransition : function(e){
            if (e.currentTarget.hash !== "") {
                if ( e.currentTarget.hash === '#home' ) {
                    window.location.hash = '';
                } else {
                    window.location.hash = e.currentTarget.hash;
                }

            }
        }
    });

    $('.section-call-to-btn').scrollingTo({
        easing : 'easeOutQuart',
        animationTime : 1800,
        callbackBeforeTransition : function(e){

        },
        callbackAfterTransition : function(e){
        }
    });

    // Animate scrolling on hire me button
    $('.hire-me-btn').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: $("#contact").offset().top}, 500);
    });


    // Menu animations plugin
    (function(){
        function Menu($element, options){

            var handler,
                defaults = {
                    domObj : $element,
                    className : 'small-menu',
                    position : '100px',
                    onIntellingenceMenu : function(){},
                    onNormalMenu : function(){}
                },
                config = $.extend({}, defaults, options),
                coreFuns = {
                    displayMenu : function(){
                        if ( config.domObj.hasClass(config.className) ) {
                            config.domObj.removeClass(config.className);
                        }
                    },
                    hideMenu : function(){
                        if ( !config.domObj.hasClass(config.className) ) {
                            config.domObj.addClass(config.className);
                        }
                    }
                },
                publicFuns = {
                    intelligent_menu : function(){

                        var lastScrollTop = 0, direction;

                        if ( handler != undefined ) {
                            $(window).unbind('scroll', handler);
                        }

                        handler = function(e){
                            if (e.currentTarget.scrollY > lastScrollTop){
                                direction = 'down';
                            } else {
                                direction = 'up';
                            }
                            lastScrollTop = e.currentTarget.scrollY;

                            // check is user scrolling to up or down?
                            if ( direction == 'up' ) {
                                // so you are scrolling to up...

                                // lets display menu
                                coreFuns.displayMenu();

                            } else {
                                // so you are scrolling to down...

                                // se we have to hide only the small menu because the normal menu isn't sticky!
                                coreFuns.hideMenu();
                            }
                        };
                        $(window).bind('scroll', handler);

                        config.onNormalMenu();
                    },
                    fixed_menu : function(){
                        if ( handler != undefined ) {
                            $(window).unbind('scroll', handler);
                        }

                        handler = function(e){
                            // check have we display small menu or normal menu ?
                            coreFuns.displayMenu();
                        };

                        $(window).bind('scroll', handler);

                        config.onNormalMenu();
                    },
                    mobile_intelligent_menu : function(){

                        if ( jQuery.browser.mobile === true ) {
                            this.intelligent_menu();
                        } else {
                            this.fixed_menu();
                        }
                    }
                };

            return publicFuns;
        }

        $.fn.menu = function( options ){
            var $element = this.first();
            var menuFuns = new Menu( $element, options );
            return menuFuns;
        };

    })();


    // call to Menu plugin
    var menuFun = $('header').menu({
        className : 'hide-menu',
        position : '100px'
    });

    window.menuFun = menuFun;


    /* Choose your navigation style */

    menuFun.intelligent_menu(); // Hide intelligently
    // menuFun.fixed_menu(); // Always fixed
    // menuFun.mobile_intelligent_menu(); // Hide on Mobile Devices


    $('#switch input').on('change', function(e){

        var menuId = this.id;

        if ( menuId === 'menu1' ) {

            menuFun.fixed_menu();

        } else if( menuId === 'menu2' ) {

            menuFun.intelligent_menu();

        } else {

            menuFun.mobile_intelligent_menu();

        }
    });

    // window scroll Sections scrolling
    (function(){
        var $sectionsList = $(".scroll-section");

        function getActiveSectionLength(section, sections) {
            return sections.index(section);
        }

        if ( $sectionsList.length > 0 ) {

            $sectionsList.waypoint({
                handler: function(event) {
                    var active_section, active_section_index, prev_section_index;
                    active_section = $(this.element);
                    active_section_index = getActiveSectionLength(active_section, $sectionsList);
                    prev_section_index = ( active_section_index - 1 );

                    if (event === "up") {
                        scrollDirection = "up";
                        if ( prev_section_index < 0 ) {
                            active_section = active_section;
                        } else {
                            active_section = $sectionsList.eq(prev_section_index);
                        }
                    } else {
                        scrollDirection = "Down";
                    }


                    $('header section.top-bar-section a').removeClass('active');
                    if ( active_section.attr('id') != 'home' ) {
                        $('a[href="#' + active_section.attr("id") + '"]').addClass('  active');
                    }
                },
                offset: '35%'
            });
        }

    }());

}(jQuery));

$(window).load(function(){

    $('#map').gmap3({
        map:{
            options:{
                center:[48.8630375, 2.332297],
                zoom:12,
                mapTypeId: google.maps.MapTypeId.PLAN,
                mapTypeControl: false,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                },
                navigationControl: false,
                scrollwheel: false,
                streetViewControl: false
            }
        },
        marker: {
            values: [
                {latLng: [48.8630375, 2.332297], data: "Paris !"}
            ],
            options: {
                draggable: false
            }
        }
    });

    // section calling
    $('.section-call-to-btn.call-to-home').waypoint({
        handler: function(event, direction) {
            var $this = $(this);
            $this.fadeIn(0).removeClass('btn-hidden');
            var showHandler = setTimeout(function(){
                $this.addClass('btn-show').removeClass('btn-up');
                clearTimeout(showHandler);
            }, 1500);
        },
        offset: '90%'
    });


    $('.section-call-to-btn.call-to-about').delay(1000).fadeIn(0, function(){
        var $this = $(this);
        $this.removeClass('btn-hidden');
        var showHandler = setTimeout(function(){
            $this.addClass('btn-show').removeClass('btn-up');
            clearTimeout(showHandler);
        }, 1600);
    });



    // portfolio Mesonary
    if ( $('#protfolio-msnry').length > 0 ) {
        // init Isotope
        var loading = 0;
        var portfolioMsnry = $('#protfolio-msnry').isotope({
            itemSelector: '.single-port-item',
            layoutMode: 'fitRows'
        });


        $('#portfolio-msnry-sort a').on( 'click', function(e) {

            e.preventDefault();

            if ( $(this).parent('li').hasClass('active') ) {
                return false;
            } else {
                $(this).parent('li').addClass('active').siblings('li').removeClass('active');
            }

            var $this = $(this);
            var filterValue = $this.data('target');

            // set filter for Isotope
            portfolioMsnry.isotope({ filter: filterValue });

            return $(this);
        });

        $('#portfolio-item-loader').on( 'click', function(e) {
            e.preventDefault();
            var $this = $(this);

            for (var i = 0; i < 3; i++) {
                $.get("portfolioitems.html", function(data, status){
                    var lists, numb, target = $('#portfolio-msnry-sort li.active a').data('target');

                    lists = ( target != '*' ) ? $(data).find('li'+target) : $(data).find('li');

                    if (lists.length > 0) {
                        numb = Math.floor(Math.random() * lists.length);
                        portfolioMsnry.isotope( 'insert', lists.eq(numb) );

                        loading++;
                        ( loading == 9 ) ? $this.remove() : "";
                    }

                });
            }

        });

        var portfolioModal = $('#portfolioModal'),
            portImgArea = portfolioModal.find('.model-img'),
            portTitle = portfolioModal.find('.modal-content .title'),
            portContent = portfolioModal.find('.modal-content .m-content'),
            portLink = portfolioModal.find('.modal-footer .modal-action');

        $('#protfolio-msnry').delegate('a.modal-trigger', 'click', function(e){
            e.preventDefault();
            var $this = $(this);
            portfolioModal.openModal({
                dismissible: true,
                opacity: '.4',
                in_duration: 400,
                out_duration: 400,
                ready: function() {
                    var imgSrc = $this.data('image-source'),
                        title = $this.data('title'),
                        content = $this.data('content'),
                        demoLink = $this.data('demo-link');


                    if ( imgSrc ) {
                        portImgArea.html('<img src="'+imgSrc+'" alt="Portfolio Image" />');
                    };


                    portTitle.text(title);
                    portContent.text(content);
                    portLink.attr('href', demoLink);
                }
            });
        });
    }

    // skills animation
    $('#skillSlider').waypoint({
        handler: function(event, direction) {
            $(this).find('.singel-hr-inner').each(function(){
                var height = $(this).data('height');
                $(this).css('height', height);
            });
        },
        offset: '60%'
    });


    /* // Wow init
     new WOW({
     offset: 200,
     mobile: false
     }).init();*/
});


/*=========== count up statistic ==========*/

var $countNumb = $('.countNumb');

if ( $countNumb.length > 0 ) {
    $countNumb.counterUp({
        delay: 15,
        time: 1700
    });
}



$('#contactForm').on('submit', function(e){
    e.preventDefault();
    var $this = $(this),
        data = $(this).serialize(),
        name = $this.find('#contact_name'),
        email = $this.find('#email'),
        message = $this.find('#textarea1'),
        loader = $this.find('.form-loader-area'),
        submitBtn = $this.find('button, input[type="submit"]');

    loader.show();
    submitBtn.attr('disabled', 'disabled');

    function success(response) {
        swal("Thanks!", "Your message has been sent successfully!", "success");
        $this.find("input, textarea").val("");
    }

    function error(response) {
        $this.find('input.invalid, textarea.invalid').removeClass('invalid');
        if ( response.name ) {
            name.removeClass('valid').addClass('invalid');
        }

        if ( response.email ) {
            email.removeClass('valid').addClass('invalid');
        }

        if ( response.message ) {
            message.removeClass('valid').addClass('invalid');
        }
    }

    $.ajax({
        type: "POST",
        url: "inc/sendEmail.php",
        data: data
    }).done(function(res){

        var response = JSON.parse(res);

        if ( response.OK ) {
            success(response);
        } else {
            error(response);
        }


        var hand = setTimeout(function(){
            loader.hide();
            submitBtn.removeAttr('disabled');
            clearTimeout(hand);
        }, 1000);

    }).fail(function(){
        sweetAlert("Oops...", "Something went wrong, Try again later!", "error");
        var hand = setTimeout(function(){
            loader.hide();
            submitBtn.removeAttr('disabled');
            clearTimeout(hand);
        }, 1000);
    });
});

$(function() {
    $(document).foundation();
})