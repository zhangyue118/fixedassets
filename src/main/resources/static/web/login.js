$(function() {
    var user = JSON.parse(localStorage.getItem("USER"));
    //已经记住了用户名密码
    if (null != user) {
        if ("" != user.password) {
            document.getElementById("if_save").checked = true;
            $("#loginPwd").val(new Base64().decode(user.password));
        }
        $("#loginName").val(user.username);
    }else{
        var cookieName = $.cookie("cookieName");
        if(cookieName!=""&&cookieName!=null&&cookieName!=undefined){
            $("#loginName").val(cookieName);
        }
    }
})

/**
 * 登录
 */
function onlogin(){
    layui.use(['layer'], function(){
        var layer = layui.layer;
        var userName = $("#loginName").val();
        var passWord = $("#loginPwd").val();
        var data = {loginName:"input NotNull",loginPwd:"input NotNull"}
        var flag = V_CHECK(data);
        if(!flag){return;}

        $.post("/login", {
            loginName: userName,
            loginPwd: hex_md5(passWord),
        }, function (response) {

            if (response.code == 10001) {
                $.cookie("count", 0);
                //默认记住用户名
                $.cookie("cookieName", userName,{ expires: 1 });

                //记住密码
                if (document.getElementById("if_save").checked) {
                    var user = {};
                    user.username = $("#loginName").val();
                    user.password = new Base64().encode($("#loginPwd").val());
                    localStorage.setItem("USER", JSON.stringify(user));

                }else{
                    localStorage.removeItem("USER");
                }

                window.location.href = response.nextUrl;
            } else {

                if(countRead()>=3){
                    $.cookie("count", 0);
                    layer.alert("您已经尝试了太多次，请稍后再试！");
                    //需要计算登录次数与倒计时
                    LockButton('#submitButton', 30);
                    cookieRead();
                }

                if (response.code == 10002) {
                    layer.msg(response.msg);
                } else if (response.code == 10003) {
                    layer.msg(response.msg);
                } else if (response.code == 10004) {
                    layer.msg(response.msg);
                } else if(response.code == 10008){
                    layui.use('layer',function () {
                        var layer = layui.layer;
                        layerPass = layer.open({
                            type: 2,
                            title:'修改密码',
                            skin:'s-alert-data',
                            closeBtn:1, //不显示关闭按钮
                            area: ['480px','322px'],
                            content: ['/toPassword', 'no'], //iframe的url，no代表不显示滚动条
                        });
                    });
                    layer.msg(response.msg);
                }
                else {
                    layer.msg("登录失败");
                }
            }
        });
    });
}

/**
 * 数字证书登录
 */
function onCaLogin() {
    window.location.href = "/caLogin";
}