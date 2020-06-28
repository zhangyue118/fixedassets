$(function () {
    function resize() {
        //在1920px下 1em = 18px
        var windowW
      if ( document.body.clientWidth <$(parent.document).width()){
        windowW =$(parent.document).width()
      }else {
        windowW = document.body.clientWidth
      }
      var initWH = 1340 / 820;
        //1440尺寸下都用1280
        if (windowW <= 1280) {
            windowW = 1280;
        } else {
        }
      $("body,html").css({
          fontSize: windowW * 12 / 1280 + 'px'
      });

      var windowHeight = document.body.clientHeight;
      var windowWidth = document.body.clientWidth;
      // $('.jq_oldCase ').height(windowHeight - 20 - $('.I305_top ').height() - $('.I305_subtitle ').height() - 80)


    }
    resize();
    $(window).bind("resize", resize)
  getTime()
  setInterval("getTime();",1000); //每隔一秒运行一次

});

//取得系统当前时间
function getTime(){
  var myDate = new Date();
  var date = myDate.toLocaleDateString();
  var hours = myDate.getHours();
  var minutes = myDate.getMinutes();
  var seconds = myDate.getSeconds();
   minutes = minutes > 9 ? minutes : '0' + minutes;
   seconds = seconds > 9 ? seconds : '0' + seconds;

  $(".L105_dateTime").html(date+" "+hours+":"+minutes+":"+seconds); //将值赋给div
}

// $(document).ready(function () {
//     // 轮播图自适应
//     //$('.swiper-container').slide({mainCell:".bd ul",effect:"left",autoPlay:true});
//     $('.swiper-container').PageSwitch({
//         direction:'horizontal',
//         easing:'ease-in',
//         duration:1000,
//         autoPlay:true,
//         loop:'false'
//     });
//     //截取一定长度的字符串
//     function len(str,num){
//         if (str.length <= num){
//             return str;
//         }else{
//             return str.substring(0,num) + "...";
//         }
//     }
//     for (var i=0; i<$(".newsSubTitle>span").length; i++) {
//         var content = $(".newsSubTitle>span").eq(i).html();
//         $(".newsSubTitle>span").eq(i).html(len(content, 76));
//     }
// });