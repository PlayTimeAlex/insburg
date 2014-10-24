(function($){

    $.fn.sendkeys = function (x){
        x = x.replace(/([^{])\n/g, '$1{enter}'); // turn line feeds into explicit break insertions, but not if escaped
        return this.each( function(){
            bililiteRange(this).bounds('selection').sendkeys(x).select();
        });
    }; // sendkeys


})(jQuery);