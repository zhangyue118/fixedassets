$(function(){
    $("#departmentId").focus();
});
layui.use(['form','table','layer','tree'],function () {
    var form = layui.form,
        table = layui.table,
        tree = layui.tree,
        layer = layui.layer;

    //初始化表格
    var pId = -1;//最初始parentId
    table.render({
        elem: '#s_departmentList',
        url:'/shmDepartment/listShmDepartment',
        where:{
            paretDept:-1
        },//有数据接口不需要data
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
            {field:'name',align: "center",unresize:true,title: '部门名称'},
            {field:'categoryName',align: "center",unresize:true,title: '部门类别'},
            {field:'paretDeptName',align: "center",unresize:true,title: '上-级部门'},
            {field:'updateTime',align: "center",unresize:true,title: '更新时间'},
            {field:'createTime',align: "center",unresize:true,title: '创建时间'},
            {minWidth:'120',align: "center", title: '操作',fixed:'right',unresize:true,toolbar:'#typeOperate'}
        ]],
        page: true,
        align:"center",
        limit:15,
        limits:[15, 20, 30, 40, 50, 60, 70, 80, 90]
    });
    //顶部部门筛选
    $(".s-filter-btn").on('click',function () {
        var loading = layer.load(2, {
            shade: [0.1,'#333'] //0.1透明度的白色背景
        });
        var name = $("#departmentId").val();
        table.reload('s_departmentList', {
            url: '/shmDepartment/listShmDepartment',
            where: {
                name:name,
                paretDept:pId
            }, //设定异步数据接口的额外参数
            page: {
                curr: 1 //重新从第 1 页开始
            },
            done:function () {
                layer.close(loading)
            }
        });
    });
    //部门节点树tree
    function treeReady() {
        $.get('/shmDepartment/treeShmDepartment',function (res) {
            if(res.code === 10001) {
                var data = res.data;
                tree.render({
                    elem: '#s_departmentList_tree',  //绑定元素
                    id:'departmentTree',
                    data: [
                        {
                            title:'全部',
                            children:data,
                            spread:true
                        }
                    ],
                    onlyIconControl:true,
                    click:function (obj) {
                        var loading = layer.load(2, {
                            shade: [0.1,'#333'] //0.1透明度的白色背景
                        });
                        var id = obj.data.id === undefined?-1:obj.data.id;
                        pId = obj.data.id;
                        form.val("add-department",{
                            "add-parentDepartment":id
                        });
                        form.render();
                        $(".layui-tree-txt").removeClass("s-tree-active");
                        obj.elem.children().eq(0).find(".layui-tree-txt").addClass("s-tree-active");
                        table.reload('s_departmentList', {
                            url: '/shmDepartment/listShmDepartment',
                            where: {
                                paretDept:id,
                                name:''
                            }, //设定异步数据接口的额外参数
                            page: {
                                curr: 1 //重新从第 1 页开始
                            },
                            done:function () {
                                layer.close(loading)
                            }
                        });
                    }
                });
            }
        });
    }
    treeReady();
    //上一级部门下拉框数据源
    function selectData() {
        var str = '<option value="-1">请选择</option>';
        $.post('/shmDepartment/getAllShmType',function (res) {
            if(res.code === 10001) {
                res.data.forEach(function (item) {
                    str += '<option value="'+ item.id +'">'+ item.name +'</option>'
                });
                $("select[name='add-parentDepartment']").html(str);
                form.render('select');
            } else {
                layer.msg('上一级部门下拉列表数据接口异常')
            }
        })
    }
    // 弹出新增和编辑弹框的公共方法
    var addOrEdit,type,id;
    function open(t,title) {
        type = t; //给type赋值
        $("#departmentId").blur();
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
                reset()//每次关闭弹框调用清空值的方法
            }
        });
        $("#addDepartmentName").focus();
    }
    //弹出类型为--新增--的弹出框
    $(".s-add-department").on('click',function () {
        open('add','部门新增');
    });
    //提交弹出框所填信息
    $(".s-alert-send").on('click',function () {
        sendAPI();
    });
    //自定义关闭按钮关闭弹出框
    $(".s-alert-close").on('click',function () {
        layer.close(addOrEdit);
    });
    //定义2个变量用于承接layui模态下拉框取到的值
    var a = -1,b = -1;
    form.on('select(add-parentDepartment)',function (data) {
        a = data.value;
    });
    form.on('select(add-departmentType)',function (data) {
        b = data.value;
    });
    //定义新增和编辑接口函数用于提交
    function sendAPI() {
        var name = $("#addDepartmentName").val();
        //非空判断
        if(name === '') {
            layer.alert('部门名称不能为空', {
                //1:正确；2:错误；3:询问；4:锁定；5:失败；6：成功；7:警告；16：加载
                icon :2,
                shift : 6, //抖动效果
            });
            return false
        }
        //调取接口前打开loading动画
        var loading = layer.load(2, {
            shade: [0.1,'#333'] //0.1透明度的白色背景
        });
        var url;
        var data = {
            name:name,
            paretDept:$("select[name='add-parentDepartment']").val(),
            category:b,
            id:id
        };
        if(type === 'add') {
            url = '/shmDepartment/exAdd';
            delete data.id;
        } else if(type === 'edit') {
            url = '/shmDepartment/exEdit'
        }
        $.post(url,data,function (res) {
            //接口调用成功关闭loading动画
            layer.close(loading);
            if(res.code === 10001) {//状态码判断10001成功
                layer.msg(res.msg);//提示语---成功
                layer.close(addOrEdit);//关闭弹出框
                //刷新视图
                table.reload('s_departmentList');//--表格
                treeReady();//--树的视图
                selectData();//--上一级部门下拉框
            } else {
                //错误提示语
                layer.close(loading);//关闭loading动画
                layer.msg(res.msg);//提示语---错误
            }
        })
    }
    // 提交或取消后置空上一次所填
    function reset() {
        $("#addDepartmentName").val('');
        form.val("add-department", {
            "add-parentDepartment": '',
            "add-departmentType": ''
        });
        form.render('select');
        a = -1;b = -1;id = null
    }
    //监听工具条
    table.on('tool(s_departmentList)', function(obj){
        var rowData = obj.data; //获得当前行数据
        var layEvent = obj.event;
        var tr = obj.tr;
        if(layEvent === 'detail'){ //查看

        } else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除所选的部门吗？',{
                title:'确认删除',
                skin:'s-del-title'
            }, function(index){
                layer.close(index);
                //向服务端发送删除指令
                $.post("/shmDepartment/exDelete",{ids:rowData.id},function(res){
                    layer.msg(res.msg);
                    if(res.code === 10001) {//状态码判断10001成功
                        //刷新视图
                        table.reload('s_departmentList');//--表格
                        treeReady();//--树的视图
                        selectData();//--上一级部门下拉框
                    }
                });
            });
        } else if(layEvent === 'edit'){ //弹出类型为--编辑--的弹出框
            //视图回显
            $("#addDepartmentName").val(rowData.name);
            form.val("add-department", {
                "add-parentDepartment": rowData.paretDept,
                "add-departmentType": rowData.category
            });
            //接口data赋值
            a = rowData.paretDept;
            b = rowData.category;
            id = rowData.id;
            open('edit','部门编辑');
            //同步更新缓存对应的值
        }
    });
    //监听行单击事件
    table.on('row(s_departmentList)', function(obj){
        $(".active-tr").removeClass("active-tr");
        obj.tr.addClass("active-tr");
    });
});