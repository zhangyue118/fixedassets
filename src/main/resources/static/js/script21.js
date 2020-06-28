

$(document).ready(function(){

    var objtimer // 一秒后切换向左向右图标
    $(".I121_puleft i").on("click",function(){
        if($(".I121_puleft i").hasClass("icondouble-arrow-left")){
            $(".I121_m_text").toggle()
        }else{
            objtimer = setTimeout(function(){
                $(".I121_m_text").toggle()
            },400)
        }


        $(".I121_main > .I121_sidebar").toggleClass("I121_c_left")
        $(".I121_main > .I121_content").toggleClass("I121_c_right")

        $(".I121_puleft i").toggleClass("icondouble-arrow-left")
        $(".I121_puleft i").toggleClass("icondouble-arrow-left1")
    })





    $(".I121_sidebar .I121_menu > div").hover(function(){
        $(this).find(".I121_m_popup").show()
    },function(){
        $(this).find(".I121_m_popup").hide()
    })
})