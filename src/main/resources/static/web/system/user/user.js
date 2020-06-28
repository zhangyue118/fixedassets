$(function(){
    document.getElementById("name_id").focus();
});
//定义获取警员(警号)的方法
function getPoliceIdAndName() {
    var html = '';
    $.post("/shmUsers/getPoliceIdAndName",function(res){
        if(res.code === 10001) {
            res.data.forEach(function (item) {
                html += '<li>' + item.name + '(' + item.policeId + ')</li>';
            });
            $(".intelligence-search ul").html(html);
            onclick = function (e) {
                if(e.target.id === 'name_id') {
                    $(".intelligence-search ul").show();
                } else {
                    $(".intelligence-search ul").hide();
                }
            };
            $("#name_id").on('focus',function () {
                $(".intelligence-search ul").show();
            });
            $("#name_id").on('input propertychange',function () {
                var v = $(this).val();
                var l = v.length;
                var ul = '';
                if(l === 0) {
                    $(".intelligence-search ul").html(html);
                } else {
                    res.data.forEach(function (item) {
                        if(v === item.name.substring(0,l) || v === String(item.policeId).substring(0,l)) {
                            ul += '<li>' + item.name + ' (' + item.policeId + ')</li>';
                        }
                    });
                    if(ul === '') {
                        $(".intelligence-search ul").hide();
                    } else {
                        $(".intelligence-search ul").show();
                    }
                    $(".intelligence-search ul").html(ul);
                }
            });
        }
    });
    $("body").on('click','.intelligence-search ul li',function () {
        $("#name_id").val($(this).html());
        $(".intelligence-search ul").hide();
    });
}

layui.use(['form','table','layer'],function () {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer;

    //初始化表格
    table.render({
        elem: '#s_userList',
        url:'/shmUsers/listShmUsers',   //有数据接口不需要data
        request: {
            pageName: 'current', //页码的参数名称，默认：page
            limitName: 'size' //每页数据量的参数名，默认：limit
        },
        response: {
            statusCode:10001, //规定成功的状态码，默认：0
        },
        height: 'full-180',
        cols: [[
            {type:'numbers',"class":'num',align: "center",unresize:true,title: '序号'},
            {field:'loginName',align: "center",unresize:true,title: '用户名'},
            {field:'name',align: "center",unresize:true,title: '姓名'},
            {field:'policeId',align: "center",unresize:true,title: '警号'},
            {field:'departmentName',align: "center",unresize:true,title: '部门'},
            {field:'roleName',align: "center",unresize:true,title: '角色'},
            {field:'stateName',align: "center",unresize:true, templet: '#userState',title: '状态'},
            {field:'updateTime',align: "center",unresize:true,title: '更新时间'},
            {minWidth:'200',align: "center", title: '操作',fixed:'right',unresize:true,toolbar:'#typeOperate'}
        ]],
        page: true,
        align:"center",
        limit:15,
        limits:[15, 20, 30, 40, 50, 60, 70, 80, 90]
    });
    var department = '',role = '',state = ''; //定义了3个变量用于承接layui模态下拉框取到的值
    form.on('select(department)',function (data) {
        department = data.value;
    });
    form.on('select(role)',function (data) {
        role = data.value;
    });
    form.on('select(state)',function (data) {
        state = data.value;
    });
    //表格数据筛选
    $(".s-filter-btn").on('click',function () {
        var name = $("#name_id").val();
        if(name[name.length-1] === ')') {
            name = name.split('(')[1].split(')')[0];
        }
        //调取接口前打开loading动画
        var loading = layer.load(2, {
            shade: [0.1,'#333'] //0.1透明度的白色背景
        });
        table.reload('s_userList', {
            url: '/shmUsers/listShmUsers',
            where: {
                departmentId:department,
                roleId:role,
                state:state,
                name:name
            }, //设定异步数据接口的额外参数
            page: {
                curr: 1 //重新从第 1 页开始
            },
            done:function () {
                layer.close(loading)
            }
        });
    });
    // 弹出框
    var type; //定义弹出框的类型
    var data = {};//定义接口data
    var tips = { //定义提示语
        loginName:'用户名不能为空',
        name:'姓名不能为空',
        cardno:'身份证号不能为空',
        policeId:'警号不能为空',
        departmentId:'请选择部门',
        roleId:'请选择角色',
        dataPri:'请选择数据权限',
        state:'请选择状态',
    };
    var a = '',b = '',c = '',d = 1 ; //定义了四个变量用于承接layui模态下拉框取到的值,单选框的值默认为 1
    form.on('select(add-department)',function (data) {
        a = data.value;
    });
    form.on('select(add-role)',function (data) {
        b = data.value;
    });
    form.on('select(add-dataPri)',function (data) {
        c = data.value;
    });
    form.on('radio(add-state)',function (data) {
        d = data.value;
    });
    //定义新增和编辑接口函数用于提交
    function sendAPI() {
        data.loginName = $("#username").val();
        data.name = $("#name").val();
        data.cardno = $("#idCard").val();
        data.policeId = $("#policeId").val();
        data.departmentId = a;
        data.roleId = b;
        data.dataPri = c;
        data.state = d;
        data.loginPwd = '123456';
        //判断非空
        for(var k in data) {
            //判断身份证格式
            if(k === 'cardno') {
                if(data[k] != '') {
                    var reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                    if(reg.test(data.cardno) === false){
                        layer.msg("身份证输入不合法");
                        return  false;
                    }
                }
            } else {
                if(data[k] === '') {
                    layer.alert(tips[k], {
                        //1:正确；2:错误；3:询问；4:锁定；5:失败；6：成功；7:警告；16：加载
                        icon :2,
                        shift : 6, //抖动效果
                    });
                    return false

                }
            }
        }
        //调取接口前打开loading动画
        var loading = layer.load(2, {
            shade: [0.1,'#333'] //0.1透明度的白色背景
        });
        //根据type判断接口地址修改参数 -- 'add' = 新增 / -- 'edit' = 编辑
        var url;
        var method;
        if(type === 'add') {
            url = '/shmUsers/exAdd'
            method = 'post'
        } else if(type === 'edit') {
            url = '/shmUsers/exEdit';
            method = 'get'
        }
        //ajax 函数
        $.ajax({
            url:url,
            type:method,
            data:data,
            success:function (res) {
                //接口调用成功关闭loading动画
                layer.close(loading);
                if(res.code === 10001) {//状态码判断10001成功
                    layer.msg(res.msg);//提示语---成功
                    layer.close(addOrEdit);//关闭弹出框
                    getPoliceIdAndName();//刷新警员智能搜索列表数据
                    table.reload('s_userList')//重载表格更新视图
                } else {
                    //错误提示语
                    layer.msg(res.msg);
                }
            },
            error:function (err) {
                //接口异常错误抛出
                layer.close(loading);//关闭loading动画
                layer.msg(err.msg);//提示语---错误
            }
        })
    }
    // 定义重置密码的方法
    function reset_password(id) {
        var msg;
        if(id === '' || id === null || id=== undefined) {
            msg = '是否重置所有密码?'
        } else {
            msg = '是否重置该账号的密码?'
        }
        layer.confirm(msg, {
            title:'重置确认',
            skin:'s-del-title',
            btn: ['是','否'] //按钮
        }, function(){
            $.post("/shmUsers/resetPassword",{id:id},function(res){
                if(res.code === 10001) {
                    layer.msg('重置密码成功');//提示语---成功
                }
            });
        })

    }
    // 重置所有密码的点击事件
    $(".s-reset-all").on('click',function () {
        reset_password();
    })
    // 提交或取消后置空上一次所填
    function reset() {
        $("#username").val('');
        $("#name").val('');
        $("#idCard").val('');
        $("#policeId").val('');
        form.val("add-user", {
            "add-department": '',
            "add-role": '',
            "add-dataPri": '',
            "add-state": ''
        });
        $(".add-state").eq(0).attr('checked',true);
        form.render('radio');
        data = {};
        a = '';b = '';c = '';d = 1
    }
    // 弹出新增和编辑弹框的公共方法
    var addOrEdit;
    function open(t,title) {
        $("#name_id").blur();
        type = t; //给type赋值
        addOrEdit = layer.open({
            type: 1,
            title:title,
            skin: 's-alert-data', //样式类名
            closeBtn:1,
            anim: 2,
            area: '480px',
            shadeClose: false, //开启遮罩关闭
            content:$('#s-alert-data'),
            end:function () {
                reset();//每次关闭弹框调用清空值的方法
            }
        });
        $("#username").focus();
    }
    //弹出类型为--新增--的弹出框
    $(".s-add-user").on('click',function () {
        open('add','用户新增');
    });
    //提交弹出框所填信息
    $(".s-alert-send").on('click',function () {
        sendAPI();
    });
    //自定义关闭按钮关闭弹出框
    $(".s-alert-close").on('click',function () {
        layer.close(addOrEdit);
    });
    //监听工具条
    table.on('tool(s_userList)', function(obj){
        var rowData = obj.data; //获得当前行数据
        var layEvent = obj.event;
        var tr = obj.tr;
        if(layEvent === 'detail'){ //查看

        } else if(layEvent === 'del'){ //删除
            layer.confirm('是否删除您选择的用户?', {
                title:'确认删除',
                skin:'s-del-title'
            },function(index){
                obj.del();
                layer.close(index);
                //向服务端发送删除指令
                $.post("/shmUsers/exDelete",{ids:rowData.id},function(res){
                    layer.msg('删除成功');//提示语---成功
                    table.reload('s_userList');
                    getPoliceIdAndName();//刷新警员智能搜索列表数据
                });
            });
        } else if(layEvent === 'edit'){ //弹出类型为--编辑--的弹出框
            //视图回显
            $("#username").val(rowData.loginName);
            $("#name").val(rowData.name);
            $("#idCard").val(rowData.cardno);
            $("#policeId").val(rowData.policeId);
            form.val("add-user", {
                "add-department": rowData.departmentId,
                "add-role": rowData.roleId,
                "add-dataPri": rowData.dataPri,
                "add-state": rowData.state
            });
            //接口data赋值
            a = rowData.departmentId;
            b = rowData.roleId;
            c = rowData.dataPri;
            d = rowData.state;
            data.id = rowData.id;
            open('edit','用户编辑');
            //同步更新缓存对应的值
        } else if(layEvent === 'reset') {
            reset_password(rowData.id)
        }
    });
    //监听行单击事件
    table.on('row(s_userList)', function(obj){
        $(".active-tr").removeClass("active-tr");
        obj.tr.addClass("active-tr");
    });
});