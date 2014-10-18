(function($) {
    $(document).ready(function(){
        $('input, select').styler({
            selectSearch: false
        });

        //jquery rating
        $('.pr-rating').raty({
            path: 'images',
            readOnly: function() {
                var ro = $(this).attr('data-ro');
                return ro === "undefined" ? 0 : ro;
            },
            score: function() {
                var score = $(this).attr('data-score');
                return score === "undefined" ? 0 : score;
            }
        });

        //tooltips
        $( ".js-tooltip" ).tooltip({ position: { my: "center top", at: "center top-58px" } });

        //colorbox popup
        $('.open-popup').colorbox({
            inline:true,
            close: "",
            width: "675px",
            onOpen: function(){
                setTimeout(function(){
                    $('#cboxClose').animate({
                        opacity: 1
                    }, 300);
                }, 500);
            },
            onClosed: function(){
                $('#cboxClose').animate({
                    opacity: 0
                }, 300);
            },
            onComplete:function(){
                $( ".js-tooltip", '#colorbox').tooltip({ position: { my: "center top", at: "center top-58px" } });
                $('.pr-rating', '#colorbox').raty({
                    path: 'images',
                    readOnly: function() {
                        var ro = $(this).attr('data-ro');
                        return ro === "undefined" ? 0 : ro;
                    },
                    score: function() {
                        var score = $(this).attr('data-score');
                        return score === "undefined" ? 0 : score;
                    }
                });
                $.colorbox.resize();
            }
        });

        //Добавление анонимного отзыва
        $('body').on('change', '.js-anonimreview[type="checkbox"]', function(){
            if($(this).prop('checked')){
                $('.js-anonimfiels').hide('fast', function(){
                    $.colorbox.resize();
                });
            } else {
                $('.js-anonimfiels').show('fast', function(){
                    $.colorbox.resize();
                });
            }
        });

        /*
        * Slider
        * */

var testet
        $(".pr-slider").each(function(){
            var min = ($(this).data('min') ===  'undefined') ? 0 : parseInt($(this).data('min'));
            var max = ($(this).data('max') ===  'undefined') ? 0 : parseInt($(this).data('max'));
            var field = $(".pr-slider__val", this);
            var id = $(this).attr('id');
            var obj = {};

            obj[id] = new Dragdealer($(this)[0], {
                slide: false,
                animationCallback: function(x, y) {
                    var val = Math.round(min + x*(max-min));
                    $(this.handle).find('.value').text(val);
                    field.val(val);
                    $('.'+id).val(val);

                }
            });

            $('.'+id).blur(function(){
                obj[id].setValue(($(this).val()-min)/max, '', true);
                //$('#'+id).find('.value').text($(this).val());
            });

        });



        /*
        * выбор количества водителей
        * */
        $('li', '.b-drivers__count').hover(function(){
            var parent = $(this).parent();
            var el_index = $(this).index();
            $('li:lt('+el_index + 1 +')', parent).addClass('active').removeClass('noactive');
            $('li:gt('+el_index+')', parent).removeClass('active').addClass('noactive');

            parent.siblings('.b-drivers__count-text').html($(this).index() + 1+" "+declOfNum(el_index + 1,['водитель', 'водителя', 'водителей']));
        }, function(){
            var parent = $(this).parent();
            $(this).removeClass('active').siblings('li').removeClass('active').removeClass('noactive');
            var count = $('li.selected',parent).length;
            if(count){
                console.log($('li.selected',parent).length);
                parent.siblings('.b-drivers__count-text').html(count+" "+declOfNum(count + 1,['водитель', 'водителя', 'водителей']));
            } else {
                parent.siblings('.b-drivers__count-text').html("0 водителей");
            }
        });
        $('li', '.b-drivers__count').click(function(){
            var parent = $(this).parent();
            var parent_main = $(this).closest('.b-drivers');
            var cblock = $('.b-drivers__area', parent_main);
            var $template = $('.b-drivers__template', parent_main);
            var drivers = $('.js-drivers', parent_main);
            var el_index = $(this).index();

            $('li:lt('+el_index + 1+')', parent).addClass('selected');
            $('li:gt('+el_index+')', parent).removeClass('selected');

            var i = 0;
            var html = "";

            if(drivers.length < el_index + 1) {
                i = drivers.length;
                for (i; i <= el_index; i++){
                    cblock.append($template.render([{
                        key: i
                    }]));
                }
                $(cblock).find('.js-newstyler').removeClass('js-newstyler').styler();
            } else if(drivers.length == el_index + 1){
                return;
            } else {
                $('.js-drivers:gt('+el_index+')', cblock).remove();
            }

        });

        //неограниченый список водителей
        $('body').on('change', '.js-hidedrivers[type="checkbox"]', function(){
            if($(this).prop('checked')){
                $('.js-hidedrivers_area').hide('fast');
            } else {
                $('.js-hidedrivers_area').show('fast');
            }
        });

        //скрывание выбраного элеемнта в зависимости от состояния чекбокса
        $('body').on('change', '.js-hideany[type="checkbox"]', function(){
            if($(this).hasClass('invert')){
                if(!$(this).prop('checked')){
                    $('.'+$(this).data('element')).hide('fast');
                } else {
                    $('.'+$(this).data('element')).show('fast');
                }
            } else {
                if($(this).prop('checked')){
                    $('.'+$(this).data('element')).hide('fast');
                } else {
                    $('.'+$(this).data('element')).show('fast');
                }
            }
        });

        /*
        * переключение вкладок в калькуляторе
        * */
        var $calcTabs = $('.b-calc__tab');
        var $calcTabsHeader = $('.b-calc__h-link');
        var currentTab = 0;
        $('.b-calc__next').click(function(){
            if(currentTab + 1 == $calcTabs.length) return;
            var $button = $(this);
            $calcTabsHeader.eq(currentTab).removeClass('active');
            $($calcTabs).eq(currentTab).stop().animate({
                opacity: 0
            },300 , function(){
                $(this).removeClass('active');
                $($calcTabs).eq(currentTab = currentTab+1).addClass('active').stop().animate({
                    opacity: 1
                },300 , function(){
                    if(currentTab + 1 == $calcTabs.length){
                        $button.hide('fast');
                    }
                    $calcTabsHeader.eq(currentTab).addClass('active');
                    $('.b-calc__prev').show('fast');
                });
            });
            return false;
        });

        $('.b-calc__prev').click(function(){
            if(currentTab == 0) return;
            var $button = $(this);
            $calcTabsHeader.eq(currentTab).removeClass('active');
            $($calcTabs).eq(currentTab).stop().animate({
                opacity: 0
            },300 , function(){
                $(this).removeClass('active');
                $($calcTabs).eq(currentTab = currentTab-1).addClass('active').stop().animate({
                    opacity: 1
                },300 , function(){
                    if(currentTab == 0){
                        $button.hide('fast');
                    }
                    $calcTabsHeader.eq(currentTab).addClass('active');
                    $('.b-calc__next').show('fast');
                });
            });
            return false;
        });

        /*
        * Уровень наполнености
        * */
        $('.b-result__filling').each(function(){
            var html = '';
            var fill = $(this).data('fill');
            for(i=0; i < 8; i++) {
                html += (i < fill) ? '<span class="fill"></span>' : '<span></span>';
            }
            $(this).html(html);
        });

        /*
        * календарик в калькуляторе
        * */
        jQuery(function($){
            $.datepicker.regional['ru'] = {
                closeText: 'Закрыть',
                prevText: '&#x3c;Пред',
                nextText: 'След&#x3e;',
                currentText: 'Сегодня',
                monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
                    'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
                monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
                    'Июл','Авг','Сен','Окт','Ноя','Дек'],
                dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
                dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
                dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
                weekHeader: 'Не',
                dateFormat: 'dd.mm.yy',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: ''};
            $.datepicker.setDefaults($.datepicker.regional['ru']);
        });
        $('.js-calc input').datepicker({
            onSelect: function(dateText) {
                $(this).parent().find('.date').html(dateText);
            },
            changeYear: true,
            yearRange: "1970:"+new Date().getFullYear()
        });
        $(".js-calc").click(function() {
            $("input", this).datepicker("show");
            console.log('test');
            return false;
        });

          /*
         * Функция склонения целых числительных
         *
         * @param {number} число
         * @param {boolean} массив слов для склонения
         *
         * @return {string}
         * */
        function declOfNum(number, titles) {
            cases = [2, 0, 1, 1, 1, 2];
            return titles[ (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5] ];
        }


    });

    $(window).load(function() {
        var revslider = $('.b-review__slider').flexslider({
            animation: "slide",
            slideshow: false,
            controlNav: false,
            directionNav: false
        });
        $('.b-review__slider-prev').click(function(){
            revslider.flexslider("prev");
            return false;
        });
        $('.b-review__slider-next').click(function(){
            revslider.flexslider("next");
            return false;
        });

        $('.b-catalog__slider').flexslider({
            animation: "slide",
            animationLoop: false,
            animationLoop: false,
            controlNav: false,
            slideshow: false,
            move: 1,
            itemWidth: 120,
            itemMargin: 0
        });
    });
}(jQuery));