(function($) {
    $(document).ready(function(){
        //number filter
        $("body" ).on( "keydown", ".only-num", function(event) {
            if ( $.inArray(event.keyCode,[46,8,9,27,13]) !== -1 ||
                (event.keyCode == 65 && event.ctrlKey === true) ||
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                return;
            } else {
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                    event.preventDefault();
                }
            }
        });

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
        if( /iPhone|iPad|iPod|/i.test(navigator.userAgent) ) {
            $(".js-tooltip").on('click touchstart', function(e){
                $(this).tooltip( "open" );
            });
            $('body').on('click touchstart', function(e){
                var target = $(e.target);
                if ( !target.is( ".ui-tooltip" ) && !target.is( ".js-tooltip" ) ) {
                    $( ".js-tooltip" ).tooltip( "close" );
                }
            });
        }

        //colorbox popup
        $('.open-popup').colorbox({
            inline:true,
            close: "",
            width: "675px",
            maxWidth: "90%",
            fixed: false,
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

            $('.'+id).on('change keyup', function(event){
                if(event.keyCode == 8 || event.keyCode == 46) return;
                var val = $(this).val();
                if(val < min){
                    obj[id].setValue(0, '', true);
                } else if (val > max) {
                    obj[id].setValue(1, '', true);
                } else {
                    obj[id].setValue(($(this).val() - min ) / (max - min), '', true);
                }
                obj[id].reflow();
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
                if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                    $('.js-mousenum', cblock).each(function () {
                        addNumPad($(this));
                    });
                }
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

        /*скрывание выбраного элеемнта в зависимости от состояния радиокнопки
        * Отдельно сделано из расчета на то что возможно будет нужно изменить алгоритм для радиокнопок(например их будет 3-4)
        * */

        $('body').on('change', '.js-hideany[type="radio"]', function(){
            var elm = $('.js-'+$(this).attr('name'));
            if($(this).data('element') == "" || $(this).data('element') == "undefined"){
                elm.stop().hide('fast');
            } else {
                elm.stop().hide('fast');
                $('.'+$(this).data('element')).stop().show('fast');
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

        //цифровая клавиатура
        if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            $('.js-mousenum').each(function () {
                addNumPad($(this));
            });
            $(document).on('focus', '.js-mousenum', function () {
                var elem = $(this);
                $('.b-mousenum').stop().hide(0, function () {
                    var parent = elem.closest('.b-mousenum__wrap');
                    $('.b-mousenum', parent).stop().show(0);
                });
                console.log('focus');
            });
            $(document).on('click', 'td', '.b-mousenum__table', function () {
                var parent = $(this).closest('.b-mousenum__wrap');
                var input = parent.children('input'),
                    key = $(this).data('key'),
                    val = input.val();
                if (key == '8') {
                    input.val(val.substring(0, val.length - 1));
                    input.focus();
                } else if (key == 'close') {
                    $('.b-mousenum', parent).stop().hide(0);
                } else {
                    input.val(val + String.fromCharCode($(this).data('key')));
                    input.focus();
                }
            });
            $(document).click(function () {
                $(".b-mousenum").stop().hide(0);
            });
            $(document).on('click', '.b-mousenum, .js-mousenum', function (event) {
                event.stopPropagation();
            });
        }
        /*
        * Добавлет цифровую клавиатуру к выбраному полю
        *
        * @param {obj} - jquery объкт поля.
        * */
        function addNumPad(elem){
            var numpad = '<div class="b-mousenum" style="display: none;"><table class="b-mousenum__table"><tr><td data-key="55">7</td><td data-key="56">8</td><td data-key="57">9</td></tr><tr><td data-key="52">4</td><td data-key="53">5</td><td data-key="54">6</td></tr><tr><td data-key="49">1</td><td data-key="50">2</td><td data-key="51">3</td></tr><tr><td class="backspace" data-key="8"><span class="arrow">Стереть</span></td><td data-key="48">0</td><td  class="close" data-key="close"><span class="arrow right">Далее</span></td></tr></table></div>';
            elem.wrap('<div class="b-mousenum__wrap"></div><div>');
            elem.parent().append(numpad);
        }

        //открытие меню на мобиле
        $('.b-header__nav-open').on('click', function(){
            $menu = $('.b-header__mob-nav');
            if($menu.hasClass('open')){
                $menu.slideUp(150, function(){
                    $(this).removeClass('open');
                });
                return false;
            }
            $menu.slideDown(150, function(){
                $(this).addClass('open');
            });
        });
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