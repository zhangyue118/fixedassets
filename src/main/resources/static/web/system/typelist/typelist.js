$(function(){
    $("#typeName").focus();
});
layui.use(['form','table','layer','tree'],function () {
    var form = layui.form,
        table = layui.table,
        tree = layui.tree,
        layer = layui.layer;

    //初始化表格
    table.render({
        elem: '#s_typeList',
        url:'/shmTypelist/listShmTypelist',
        where:{
            parentCode:'-1'
        },
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
            {field:'typeName',align: "center",unresize:true,title: '字典名称'},
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
    function treeReady() {
        $.post('/shmTypelist/treeShmDepartment',function (res) {
            if(res.code === 10001) {
                var data = [
                    {
                        title:'全部',
                        children:res.data,
                        spread:true
                    }
                ];
                tree.render({
                    elem: '#s_typeList_tree',
                    data: data,
                    id: 'typeTree',
                    onlyIconControl:true,
                    click:function (obj) {
                        var code = obj.data.parentCode === undefined?'-1':obj.data.code;
                        params.data.parentCode = obj.data.code;
                        $(".layui-tree-txt").removeClass("s-tree-active");
                        obj.elem.children().eq(0).find(".layui-tree-txt").addClass("s-tree-active");
                        table.reload('s_typeList', {
                            url: '/shmTypelist/listShmTypelist',
                            where: {
                                parentCode:code,
                                name:null
                            }, //设定异步数据接口的额外参数
                            page: {
                                curr: 1 //重新从第 1 页开始
                            }
                        });
                    }
                });
            }
        });
    }
    treeReady();
    //父级字典下拉框数据源
    function selectData() {
        var str = '<option value="-1">请选择</option>';
        $.post('/shmTypelist/getAllShmType',function (res) {
            if(res.code === 10001) {
                res.data.forEach(function (item) {
                    str += '<option value="'+ item.code +'">'+ item.typeName +'</option>'
                });
                $("select[name='add-type-code']").html(str);
                form.render('select');
            } else {
                layer.msg('父级字典下拉列表数据接口异常')
            }
        })
    }
    //顶部字典筛选
    $(".s-filter-btn").on('click',function () {
        var name = $("#typeName").val();
        table.reload('s_typeList', {
            url: '/shmTypelist/listShmTypelist',
            where: {
                parentCode:params.data.parentCode,
                name:name
            }, //设定异步数据接口的额外参数
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });
    //模拟下拉框取值
    form.on('select(add-type-code)',function (data) {
        params.data.parentCode = data.value;
    });
    form.on('radio(add-state)',function (data) {
        params.data.state = data.value;
    });
    //定义一个用于存储参数方法的对象
    var addOrEdit;
    var params = {
        open:function (t,title) {
            params.type = t; //给type赋值
            if(t === 'add') {
                $(".s-ifShow-row").hide();
                form.val("add-type", {
                    "add-type-code": params.data.parentCode
                });
                form.render();
            } else if(t === 'edit') {
                $(".s-ifShow-row").show();
            } else {
                $(".s-ifShow-row").hide();
            }
            $("#typeName").blur();
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
            $("#addTypeName").focus();
        },
        type:'add', //弹出框的类型 新增 = add / 编辑 = edit
        url:{       //新增编辑接口地址
            add:'/shmTypelist/exAdd',
            edit:'/shmTypelist/exEdit',
            del:'/shmTypelist/exDelete'
        },
        tips:{
            typeName:'字典名称不能为空'
        },
        must:{
            typeName:''
        },
        data:{ //存储新增编辑的数据
            parentCode:-1,
            state:1
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
            var url = params.url.add,data = {},typeName = $("#addTypeName").val(),
                successMsg = '字典新增',remarks = $("#addTypeDescription").val();
            data.typeName = typeName;
            data.parentCode = params.data.parentCode;
            data.remarks = remarks;
            data.state = params.data.state;
            params.must.typeName = typeName;
            if(params.ifEmpty() === false){
                return false
            }
            if(params.type === 'add') {

            } else if(params.type === 'edit') {
                data.id = params.data.id;
                url = params.url.edit;
                successMsg = '字典编辑'
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
                    table.reload('s_typeList');//--表格
                    treeReady();//--树的视图
                    selectData();//--上一级部门下拉框
                } else {
                    //错误提示语
                    layer.close(loading);//关闭loading动画
                    layer.msg(res.msg);//提示语---错误
                }
            })
        },
        reset:function () {
            $("#addTypeName").val('');
            form.val("add-type", {
                "add-type-code": '',
                'add-state':1
            });
            form.render();
            // params.data.parentCode = '-1';
            params.data.state = 1
        },
    };
    //弹出类型为--新增--的弹出框
    $(".s-add-type").on('click',function () {
        $("#addTypeName").val('');
        $("#addTypeCode").val('');
        $("#addTypeDescription").val('');
        params.open('add','字典新增');
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
    table.on('tool(s_typeList)', function(obj){
        var rowData = obj.data; //获得当前行数据
        var layEvent = obj.event;
        var tr = obj.tr;
        if(layEvent === 'detail'){ //查看

        } else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除该字典类型?', {
                title:'删除确认',
                skin:'s-del-title'
            },function(index){
                layer.close(index);
                //向服务端发送删除指令
                $.post(params.url.del,{codes:rowData.code},function(res){
                    if(res.code === 10001) {
                        //刷新视图
                        table.reload('s_typeList');//--表格
                        treeReady();//--树的视图
                        selectData();//--上一级部门下拉框
                    }else {
                        layer.msg(res.msg);
                    }
                });
            });
        } else if(layEvent === 'edit'){ //弹出类型为--编辑--的弹出框
            //视图回显
            $("#addTypeName").val(rowData.typeName);
            $("#addTypeCode").val(rowData.code);
            $("#addTypeDescription").val(rowData.remarks);
            form.val("add-type", {
                "add-type-code": rowData.parentCode,
                "add-state":rowData.state
            });
            form.render();
            //接口data赋值
            params.data.parentCode = rowData.parentCode;
            params.data.id = rowData.id;
            params.data.state = rowData.state;
            params.open('edit','字典类型编辑');
        }
    });
    //监听行单击事件
    table.on('row(s_typeList)', function(obj){
        $(".active-tr").removeClass("active-tr");
        obj.tr.addClass("active-tr");
    });

});