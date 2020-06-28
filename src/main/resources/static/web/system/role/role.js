$(function(){
    $("#roleName").focus();
});
layui.use(['form','table','layer','tree'],function () {
    var form = layui.form,
        table = layui.table,
        tree = layui.tree,
        layer = layui.layer;

    //初始化表格
    table.render({
        elem: '#s_roleList',
        url:'/shmRole/listShmRoleList',
        request: {
            pageName: 'current', //页码的参数名称，默认：page
            limitName: 'size' //每页数据量的参数名，默认：limit
        },
        response: {
            statusCode:10001, //规定成功的状态码，默认：0
        },
        height:'full-235',
        cols: [[
            {type:'numbers',"class":'num',align: "center",unresize:true,title: '序号'},
            {field:'name',align: "center",unresize:true,title: '角色名称'},
            {field:'userCount',align: "center",unresize:true,title: '用户数量'},
            {field:'updateTime',align: "center",unresize:true,title: '更新时间'},
            {field:'createTime',align: "center",unresize:true,title: '创建时间'},
            {minWidth:'120',align: "center", title: '操作',fixed:'right',unresize:true,toolbar:'#typeOperate'}
        ]],
        page: true,
        align:"center",
        limit:15,
        limits:[15, 20, 30, 40, 50, 60, 70, 80, 90]
    });
    //节点树初始化
    $.post('/shmRole/treeShmRoleList',function (res) {
        if(res.code === 10001) {
            tree.render({
                elem: '#s_roleList_tree',
                data:res.data,
                showCheckbox: true,  //是否显示复选框
                id: 'roleTree',
                click: function(obj){

                }
            });
        }
    });
    //保存节点树勾选的数据
    $(".tree-save-btn").on('click',function () {
        var checkData = tree.getChecked('roleTree');
        var arr = [];
        checkData.forEach(function (item) {
            arr.push(item);
            if(item.children !== undefined) {
                item.children.forEach(function (itemN) {
                    arr.push(itemN);
                    if(itemN.children !== undefined) {
                        itemN.children.forEach(function (itemNN) {
                            arr.push(itemNN);
                        })
                    }
                })
            }
        });

        var strData = '';
        arr.forEach(function (k) {
            strData += k.id + ','
        });
        strData = strData.substring(0,strData.length-1);
        $.post('/shmRole/saveRole',{roleId:params.data.roleId,actionIds:strData},function (res) {
            if(res.code === 10001) {
                layer.msg('保存成功')
            }
        });
    });
    //顶部角色筛选
    $(".s-filter-btn").on('click',function () {
        var loading = layer.load(2, {
            shade: [0.1,'#333'] //0.1透明度的白色背景
        });
        var name = $("#roleName").val();
        table.reload('s_roleList', {
            url: '/shmRole/listShmRoleList',
            where: {
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

    //定义一个用于存储参数方法的对象
    var addOrEdit;
    var params = {
        open:function (t,title) {
            params.type = t; //给type赋值
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
                    params.reset()//每次关闭弹框调用清空值的方法
                }
            });
        },
        type:'add', //弹出框的类型 新增 = add / 编辑 = edit
        url:{       //新增编辑接口地址
            add:'/shmRole/exAdd',
            edit:'/shmRole/exEdit',
            del:'/shmRole/exDelete'
        },
        tips:{
            name:'角色名称不能为空'
        },
        must:{
            name:''
        },
        data:{ //存储新增编辑的数据
            id:'',
            roleId:'',
        },
        ifEmpty:function() {//判断非空
            for(var k in params.must) {
                if(params.must[k] === '') {
                    layer.alert(params.tips[k], {
                        //1:正确；2:错误；3:询问；4:锁定；5:失败；6：成功；7:警告；16：加载
                        icon :2,
                        shift : 6, //抖动效果
                    });
                    return false
                }
            }
        },
        sendAPI:function () {
            var url = params.url.add,data = {},name = $("#addRoleName").val(),remark = $("#addRoleRemark").val(),successMsg = '角色新增';
            data.name = name;
            data.remarks = remark;
            params.must.name = name;
            if(params.ifEmpty() === false){
                return false
            }
            if(params.type === 'edit') {
                data.id = params.data.id;
                url = params.url.edit;
                successMsg = '角色编辑'
            }
            //调取接口前打开loading动画
            var loading = layer.load(2, {
                    shade: [0.1,'#333'] //0.1透明度的白色背景
                });
            $.post(url,data,function (res) {
                //接口调用成功关闭loading动画
                layer.close(loading);
                if(res.code === 10001) {//状态码判断10001成功
                    layer.msg(successMsg+'成功');//提示语---成功
                    layer.close(addOrEdit);//关闭弹出框
                    table.reload('s_roleList')//重载表格更新视图
                } else {
                    //错误提示语
                    layer.close(loading);//关闭loading动画
                    layer.msg(res.msg);//提示语---错误
                }
            })
        },
        reset:function () {
            $("#addRoleName").val('');
            $("#addRoleRemark").val('');
        },
    };
    //弹出类型为--新增--的弹出框
    $(".s-add-role").on('click',function () {
        $("#roleName").blur();
        params.open('add','角色新增');
        $("#addRoleName").focus();
    });
    //提交弹出框所填信息
    $(".s-alert-send").on('click',function () {
        params.sendAPI();
    });
    //自定义关闭按钮关闭弹出框
    $(".s-alert-close").on('click',function () {
        layer.close(addOrEdit);
    });
    //监听工具条
    table.on('tool(s_roleList)', function(obj){
        var rowData = obj.data; //获得当前行数据
        var layEvent = obj.event;
        var tr = obj.tr;
        if(layEvent === 'detail'){ //查看

        } else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除该角色?', {
                title:'重置确认',
                skin:'s-del-title'
            },function(index){
                layer.close(index);
                //向服务端发送删除指令
                $.post(params.url.del,{ids:rowData.id},function(res){
                    if(res.code === 10001) {
                        table.reload('s_roleList');
                        layer.msg('角色删除成功');//提示语---成功
                    }else {
                        layer.msg(res.msg);
                    }
                });
            });
        } else if(layEvent === 'edit'){ //弹出类型为--编辑--的弹出框
            //视图回显
            $("#addRoleName").val(rowData.name);
            $("#addRoleRemark").val(rowData.remarks);
            //接口data赋值
            params.data.id = rowData.id;
            $("#roleName").blur();
            params.open('edit','角色编辑');
            //同步更新缓存对应的值
            $("#addRoleName").focus();
        }
    });
    //监听行单击事件
    table.on('row(s_roleList)', function(obj){
        params.data.roleId = obj.data.id;
        $(".active-tr").removeClass("active-tr");
        obj.tr.addClass("active-tr");
        $.post('/shmRole/treeShmRoleList',{roleId:obj.data.id},function (res) {
            if(res.code === 10001) {
                tree.reload('roleTree', {
                    elem: '#s_roleList_tree',
                    data: res.data
                });
            }
        });
    });
});