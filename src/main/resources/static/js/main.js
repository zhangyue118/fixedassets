$(function (){
	//main高度设置
	function setBody(){
        var oBodyH=$(".I108_box").outerHeight(true);
        var oHeaderH=$(".I108_header").outerHeight(true);
        var oFooterH=$(".I108_footer").outerHeight(true);
        $(".I108_main").css("height",oBodyH - oHeaderH - oFooterH - 48);
    };setBody();
    $(window).resize(function (){
        setBody();
    });
    // 首页幻灯片
    $('#I108_hotNews').slideBox({
		direction : 'left',//left,top#方向
		duration : 0.3,//滚动持续时间，单位：秒
		easing : 'linear',//swing,linear//滚动特效
		delay : 5,//滚动延迟时间，单位：秒
		hideClickBar : false,//不自动隐藏点选按键
		clickBarRadius : 50,
		startIndex : 1//初始焦点顺序
	});
	//Tab切换
	$('.I108_middleTab li').click(function() {
        var i = $(this).index();//下标第一种写法
        $(this).addClass('I108_tabActive').siblings().removeClass('I108_tabActive');
        $('.I108_middleMain ul').eq(i).addClass('I108_showActive').siblings().removeClass('I108_showActive');
    });
    // 限制字数
    $('.I108_valLength').each(function() {
         var maxwidth = 56;
         if($(this).text().length > maxwidth) {
             $(this).text($(this).text().substring(0, maxwidth));
             $(this).html($(this).html() + "...");
         }
    });
    //Tab切换2
	$('.I108_footTab li').click(function() {
        var i = $(this).index();//下标第一种写法
        $(this).addClass('I108_footTabActive').siblings().removeClass('I108_footTabActive');
        $('.I108_tabFootContent>div').eq(i).addClass('I108_footLeftShow').siblings().removeClass('I108_footLeftShow');
        $('.I108_footMiddle>div').eq(i).addClass('I108_footMiddleShow').siblings().removeClass('I108_footMiddleShow');
    });
})