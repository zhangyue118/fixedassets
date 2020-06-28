$(function(){
    $("#messageTitle").focus();
});
layui.use(['form','table','layer','tree'],function () {
    var form = layui.form,
        table = layui.table,
        tree = layui.tree,
        layer = layui.layer;

    //初始化表格
    table.render({
        elem: '#s_messageList',
        url:'/shmMessage/listShmMessage',
        request: {
            pageName: 'current', //页码的参数名称，默认：page
            limitName: 'size' //每页数据量的参数名，默认：limit
        },
        response: {
            statusCode:10001 //规定成功的状态码，默认：0
        },
        height:'full-235',
        cols: [[
            {type:'numbers',"class":'num',align: "center",unresize:true,title: '序号'},
            {field:'title',align: "center",unresize:true,title: '标题'},
            {field:'createTime',align: "center",unresize:true,title: '添加时间'},
            {field:'updateTime',align: "center",unresize:true,title: '修改时间'},
            {field:'createrName',align: "center",unresize:true,title: '创建人'},
            {field:'updaterName',align: "center",unresize:true,title: '修改人'},
            {minWidth:'120',align: "center", title: '操作',fixed:'right',unresize:true,toolbar:'#typeOperate'}
        ]],
        page: true,
        align:"center",
        limit:15,
        limits:[15, 20, 30, 40, 50, 60, 70, 80, 90]
    });
    //顶部字典筛选
    $(".s-filter-btn").on('click',function () {
        var title = $("#messageTitle").val();
        table.reload('s_messageList', {
            url: '/shmMessage/listShmMessage',
            where: {
                title:title
            }, //设定异步数据接口的额外参数
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });
    //定义一个用于存储参数方法的对象
    var addOrEdit;
    var params = {
        open:function (t,title) {
            params.type = t; //给type赋值
            $("#messageTitle").blur();
            addOrEdit = layer.open({
                type: 1,
                title:title,
                skin: 's-alert-data', //样式类名
                closeBtn:1,
                anim: 2,
                area:['820px','480px'],
                shadeClose: false, //开启遮罩关闭
                content:$('#s-alert-data'),
                end:function () {
                    params.reset()//每次关闭弹框调用清空值的方法
                }
            });
            $("#addMsgTitle").focus();
        },
        type:'add', //弹出框的类型 新增 = add / 编辑 = edit
        url:{       //新增编辑接口地址
            add:'/shmMessage/exAdd',
            edit:'/shmMessage/exEdit',
            del:'/shmMessage/exDelete'
        },
        tips:{
            title:'标题不能为空'
        },
        must:{
            title:''
        },
        data:{ //存储新增编辑的数据
            id:''
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
            var url = params.url.add,data = {},title = $("#addMsgTitle").val(),
                successMsg = '通告新增',contents = editor.$txt.html();
            data.title = title;
            data.parentCode = params.data.parentCode;
            data.contents = contents;
            data.state = params.data.state;
            params.must.title = title;
            if(params.ifEmpty() === false){
                return false
            }
            if(params.type === 'edit') {
                data.id = params.data.id;
                url = params.url.edit;
                successMsg = '通告编辑'
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
                    //刷新视图
                    table.reload('s_messageList');//--表格
                } else {
                    //错误提示语
                    layer.close(loading);//关闭loading动画
                    layer.msg(res.msg);//提示语---错误
                }
            })
        },
        reset:function () {
            $("#addMsgTitle").val('');
            editor.$txt.html('');
            params.data.state = '';
        },
    };
    //弹出类型为--新增--的弹出框
    $(".s-add-type").on('click',function () {
        params.open('add','新建通知通告');
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
    table.on('tool(s_messageList)', function(obj){
        var rowData = obj.data; //获得当前行数据
        var layEvent = obj.event;
        var tr = obj.tr;
        if(layEvent === 'detail'){ //查看

        } else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除该通告?', {
                title:'删除确认',
                skin:'s-del-title'
            },function(index){
                layer.close(index);
                //向服务端发送删除指令
                $.post(params.url.del,{ids:rowData.id},function(res){
                    if(res.code === 10001) {
                        //刷新视图
                        layer.msg('删除成功');
                        table.reload('s_messageList');//--表格
                    }else {
                        layer.msg(res.msg);
                    }
                });
            });
        } else if(layEvent === 'edit'){ //弹出类型为--编辑--的弹出框
            //视图回显
            $("#addMsgTitle").val(rowData.title);
            editor.$txt.html('<p>'+ rowData.contents  +'</p>');
            //接口data赋值
            params.data.id = rowData.id;
            params.open('edit','编辑通知通告');
        }
    });
    //监听行单击事件
    table.on('row(s_messageList)', function(obj){
        $(".active-tr").removeClass("active-tr");
        obj.tr.addClass("active-tr");
    });

});