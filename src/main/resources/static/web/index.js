$(function() {
    setDateTime();
})
//设置时间
function setDateTime(){
    var myDate = new Date();
    var month=myDate.getMonth()+1+"";
    if (month.length==1) {
        month="0"+month;
    }
    var hour=myDate.getHours()+"";
    if (hour.length==1) {
        hour="0"+hour;
    }
    var minutes=myDate.getMinutes()+"";
    if (minutes.length==1) {
        minutes="0"+minutes;
    }
    var secondss=myDate.getSeconds()+"";
    if (secondss.length==1) {
        secondss="0"+secondss;
    }
    $("#showTime").html(myDate.getFullYear()+"-"+month+"-"+myDate.getDate()+" "+hour+":"+minutes+":"+secondss);
    setTimeout('setDateTime()',1000);
}

function jumpNew(id,url) {
    if(url!=null){
        if(url=='/home'){
            top.location.href='main';
        }else {
        window.parent.document.getElementById("indexContentIframe").setAttribute("src",url+"?menuId="+id);
        }
    }
}

function myNotice(userId) {

}

function logout() {
    layui.use(['layer'], function(){
        var layer = layui.layer;
        layer.confirm('确定退出系统?', {
            title:'确定退出',
            skin:'s-del-title'
        },function(index){
            layer.close(index);
            top.location.href = "/logout";
        });
    });
}