(function ($) {

    'use strict';

    const scripts = {
        init: () => {
            scripts.mobileToggle();
            try {
                scripts.fixedHeader();
            } catch (e) {}
            scripts.scrollToTop();
            scripts.scrollAnimations();
            scripts.tabs();
            scripts.accordion();
            scripts.dropdown();
            scripts.toggles();
            scripts.datepicker();
            scripts.carousel();
            scripts.modals();
            scripts.countdown();
            scripts.timer();
            scripts.formElements();
            scripts.clipboard();
            scripts.fancybox();
            scripts.counter();
            scripts.masonry();
            scripts.onResize();
        },

        fixedHeader: () => {
            const offset = $('[data-sticky]').offset().top || 20
            const sticky = $('[data-sticky]')
            $(window).scroll(function(){
                $(window).scrollTop() >= offset ? sticky.addClass('fixed') : sticky.removeClass('fixed')
            });
        },

        mobileToggle: () => {
            const $body = $('body')
            const $toggle = $('[data-menu-toggle]')
            const $nav = $('[data-menu-nav]')

            $toggle.on('click', () => {
                $body.toggleClass('lock')
                $toggle.toggleClass('open')
                $nav.toggleClass('open')
            })
        },

        scrollToTop: () => {
            const offset = 500;
            const $button = $('[data-scroll-to-top]');

            $(window).scroll(function () {
                if ($(this).scrollTop() > offset) {
                    $button.addClass('show');
                } else {
                    $button.removeClass('show');
                }
            });

            $button.on('click', () => {
                $('html, body').animate({scrollTop: 0}, 400);
                return false;
            });
        },

        scrollAnimations: () => {
            AOS.init({
                offset: 120,
                delay: 0,
                duration: 1000,
                easing: 'ease',
                once: false,
                mirror: false,
                anchorPlacement: 'top-bottom',
            });
        },

        tabs: () => {
            const $tabs = $('[data-tab]');
            $tabs.each((i, tab) => {
                const $body = $('[data-tab-body]', tab);
                const $nav = $('[data-tab-nav]', tab);
                const isPreset = $(tab).is('[data-tab-preset]');

                $body.hide().filter(isPreset ? '[data-tab-active]' : ':first').show();

                $nav.on('click', function(e) {
                    e.preventDefault()

                    $body.hide();
                    $body.filter(this.hash).show();
                    $nav.removeClass('active');
                    $(this).addClass('active');
                    return false;
                }).filter(isPreset ? '[data-tab-active]' : ':first').click();
            })
        },
        
        accordion: () => {
            const $acc = $('[data-acc-body]');
            const $nav = $('[data-acc-nav]');

            $acc.hide().filter(':first').show();

            $nav.on('click', function(e) {
                e.preventDefault()

                $acc.hide();
                $acc.filter(this.hash).show();
                $nav.removeClass('active');
                $(this).addClass('active');
                return false;
            }).filter(':first').click();
        },

        dropdown: () => {
            $('[data-dropdown-toggle]').on('click', function() {
                $(this).toggleClass('open')
                $(this).next('[data-dropdown]').slideToggle(200);
            });

            $(document).click(function(e) {
                const target = e.target;
                if (!$(target).is('[data-dropdown-toggle]') && !$(target).parents().is('[data-dropdown-toggle]')) {
                    $('[data-dropdown-toggle]').removeClass('open');
                    $('[data-dropdown]').slideUp(200);
                }
            });
        },

        toggles: () => {
            $('[data-toggle]').on('click', function() {
                $(this).next('[data-toggle-target]').toggle();
                $(this).toggleClass('active');
            });
        },

        datepicker: () => {
            $('[data-datepicker]').datepicker({
                dateFormat: "yy-mm-dd"
            });
        },

        carousel: () => {
            try {
                new Carousel(document.querySelector("[data-stats-carousel]"), {
                    'slidesPerPage' : 1,
                    'infinite' : false,
                    'friction' : 0.8,
                    'center' : false,
                    Dots: false,
                    Navigation: false,
                    on: {
                        init: (carousel) => {
                            carousel.$viewport = carousel.$container.querySelector(".carousel__viewport");
                        },
                        change: (carousel) => {
                            if (carousel.page > 0) {
                                carousel.$viewport.classList.add(`viewport--finish`)
                            } else {
                                carousel.$viewport.classList.remove(`viewport--finish`)
                            }
                        },
                    },
                });
            } catch {}
        },

        modals: () => {
            const $modal = $('[data-modal]')
            const $openModal = $('[data-modal-opened]')
            const id = $openModal.attr('id')

            if ($openModal.length > 0) {
                Fancybox.show([{
                    src: `#${id}`,
                    type: "inline",
                    dragToClose: false
                }]);
            }

            $modal.on('click', '[data-modal-close]', function(e) {
                Fancybox.close();
            });
        },

        countdown: () => {
            let $countdown1 = $('.cb-countdown1');
            let $countdown2 = $('.cb-countdown2');

            $('[data-countdown-1]').each(function (i, item){
                let time = $(item).data('time');
                let timer = new Date().getTime() + parseInt(time)*60*60000;

                $(item).countdown(timer).on('update.countdown', function(event) {
                    $(this).html(event.strftime(
                        `<li>%H</li><li class="sep">:</li><li>%M</li><li class="sep">:</li><li>%S</li>`
                    ));
                });
            });

            $('[data-countdown-2]').each(function (i, item){
                let time = $(item).data('time');
                let timer = new Date().getTime() + parseInt(time)*60*60000;

                $(item).countdown(timer).on('update.countdown', function(event) {
                    $(this).html(event.strftime(`%H : %M : %S`));
                });
            });
        },

        timer: () => {
            let m
            const timer = function () {
                const isFull = $(this).is('[data-full-date]')

                let now = new Date($(this).attr('data-now')),
                    startTime = new Date($(this).attr('data-start')),
                    finishTime = new Date($(this).attr('data-end')),
                    startMS = startTime.getTime(),
                    finishMS = finishTime.getTime(),
                    nowMS = now.getTime(),
                    betweenMS = finishMS - startMS,
                    lastMS = finishMS - nowMS,
                    percent = lastMS * 100 / betweenMS,
                    lastDay,
                    lastHour,
                    lastMin,
                    lastSec;

                m = setInterval(function () {
                    nowMS = nowMS + 1000;
                    lastMS = finishMS - nowMS;

                    lastHour = Math.floor(lastMS / 1000 / 60 / 60)
                    lastDay = Math.floor(lastHour / 24)
                    lastMin = Math.floor((lastMS - (lastHour * 1000 * 60 * 60)) / 1000 / 60)
                    lastSec = Math.floor((lastMS - (lastHour * 1000 * 60 * 60) - (lastMin * 60 * 1000)) / 1000)

                    if (isFull && lastDay > 0) {
                        lastHour = Math.floor(lastHour % 24)
                    }

                    const $day = $(this).find('.day')
                    const $hour = $(this).find('.hour')
                    const $min = $(this).find('.min')
                    const $sec = $(this).find('.sec')

                    if (isFull) {
                        $day.html(`${checkTime(lastDay)}<sub>${$day.data('sub')}</sub>`);
                        $hour.html(`${checkTime(lastHour)}<sub>${$hour.data('sub')}</sub>`);
                        $min.html(`${checkTime(lastMin)}<sub>${$min.data('sub')}</sub>`);
                        $sec.html(`${checkTime(lastSec)}<sub>${$sec.data('sub')}</sub>`);
                    } else {
                        $hour.text(checkTime(lastHour));
                        $min.text(checkTime(lastMin));
                        $sec.text(checkTime(lastSec));
                    }

                    if (lastMS / 1000 < 0) {
                        $day.text('00');
                        $hour.text('00');
                        $min.text('00');
                        $sec.text('00');
                    }
                }.bind(this), 1000)
            }

            const checkTime = function (i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }

            if ($(".timer").length > 0) {
                $(".timer").map(timer)
            }
        },

        formElements: () => {
            // selectric.js
            try {
                $('[data-select]').selectric();

                $('[data-select-deposit]').selectric({
                    optionsItemBuilder: function(itemData, element, index) {
                        return `<img src="dist/images/pays/${itemData.value}.png" alt="${itemData.text}"/>
                                <span>${itemData.text}</span>`
                    },
                    labelBuilder: function(currItem) {
                        return `<i><img src="dist/images/pays/${currItem.value}.png" alt="${currItem.text}"/></i>
                                <span class="title-h6">${currItem.text}</span></div>`
                    },
                });
            } catch (e){}

            try {
                $('input[type=file]').on('change', function(){
                    const file = this.files[0];
                    $(this).closest('.file-group').find('.file-group__txt').html(file.name);
                });
            } catch (e){}
        },

        clipboard: () => {
            // clipboard.js
            try {
                const clipboard = new ClipboardJS('[data-clipboard]');

                clipboard.on('success', function (e) {
                    const id = e.trigger.getAttribute('data-clipboard-target');
                    id ? $(id).select() : $(e).select()

                    $('[data-clipboard-confirm]').addClass('active')
                    setTimeout(() => $('[data-clipboard-confirm]').removeClass('active'), 2000)
                });
            } catch (e){}
        },

        fancybox: () => {
            // fancybox.js
            Fancybox.bind("[data-fancybox]", {
                Html: {
                    video: {
                        autoplay: true,
                    }
                },
            })
        },

        counter: () => {
            let counter = document.querySelectorAll('[data-counter]')
            let limit = 0

            window.addEventListener('scroll', function(){
                if( limit == counter.length ){ return }

                for(let i = 0; i < counter.length; i++){
                    let pos = counter[i].getBoundingClientRect().top
                    let win = window.innerHeight - 40
                    if( pos < win && counter[i].dataset.stop === "0" ){
                        counter[i].dataset.stop = 1;
                        let x = 0
                        limit++
                        let int = setInterval(function(){
                            x = x + Math.ceil( counter[i].dataset.to / 50 )
                            counter[i].innerText = x
                            if( x > counter[i].dataset.to ){
                                counter[i].innerText = counter[i].dataset.to
                                clearInterval(int)
                            }
                        }, 60)
                    }
                }
            });
        },

        masonry: () => {
            $('[data-masonry]').masonry({
                itemSelector: '.masonry-grid__item',
                horizontalOrder: true,
                percentPosition: true,
                transitionDuration: 0
            });
        },

        onResize: () => {
            window.addEventListener("resize", function () {
            }, false);
        },
    };

    // Run the function
    $(function () {
        scripts.init();
    });
})(jQuery);