$(document).ready(function(){
    function setMainHeight(){
        if($(window).height() <= 700){
            $(".main").height(700)
            return false // 小于800就不改变高度了
        }
        var mainHeight = $(window).height() - $(".I121_header").height() - 40
        $(".I121_main").height(mainHeight)
    }
    setMainHeight()
    $(window).bind("resize", setMainHeight)
    $(".H121_lb_n").css('background-size', '100% 100%');
    $(".H121_br_tr P").css('background-size', '85% 100%');
})

