$(function(){
    $("#formKeywords").focus();
});
layui.use(['form','table','layer'],function () {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer;

    //初始化表格
    table.render({
        elem: '#s_formList',
        url:'/shmTemplatebaseinfo/getShmTemplatebaseinfoList',   //有数据接口不需要data
        request: {
            pageName: 'current', //页码的参数名称，默认：page
            limitName: 'size' //每页数据量的参数名，默认：limit
        },
        response: {
            statusCode:10001, //规定成功的状态码，默认：0
        },
        cols: [[
            {type:'numbers',"class":'num',align: "center",unresize:true,title: '序号'},
            {field:'name',align: "center",unresize:true,title: '模板名称'},
            {field:'weight',align: "center",unresize:true,title: '权重'},
            {field:'remarks',align: "center",unresize:true,title: '备注'},
            {field:'formTypeName',align: "center",unresize:true,title: '模板类别'},
            {field:'createrName',align: "center",unresize:true,title: '创建用户'},
            {field:'createTime',align: "center",unresize:true,title: '创建时间'},
            {field:'updateTime',align: "center",unresize:true,title: '修改时间'},
            {minWidth:'200',align: "center", title: '操作',fixed:'right',unresize:true,toolbar:'#typeOperate'}
        ]],
        page: true,
        align:"center",
        limit:15,
        limits:[15, 20, 30, 40, 50, 60, 70, 80, 90]
    });
    //顶部表单筛选
    $(".s-filter-btn").on('click',function () {
        var formName = $("#formKeywords").val();
        table.reload('s_formList', {
            url: '/shmTemplatebaseinfo/getShmTemplatebaseinfoList',
            where: {
                name:formName,
                formType:$("#type").val()
            }, //设定异步数据接口的额外参数
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });
    //定义一个用于存储参数方法的对象
    var addOrEdit,type;
    var params = {
        open:function (t,title) {
            type = t; //给type赋值
            $("#formKeywords").blur();
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
            $("#templateName").focus();
        },
        url:{
            add:'',
            edit:'',
            del:'/shmTemplatebaseinfo/exDelete'
        },
        data:{
            state:'',
            id:'',
            remarks:'',
            weight:'',
            formType:''
        },
        reset:function () {
            $("#templateName").val('');
            $("#weight").val('');
            $("#remarks").val('');
            form.val("add-department", {
                "formType": ''
            });
        }
    };
    form.on('select(formState)',function (data) {
        params.data.state = data.value;
    });
    //监听工具条
    table.on('tool(s_formList)', function(obj){
        var rowData = obj.data; //获得当前行数据
        var layEvent = obj.event;
        var tr = obj.tr;
        if(layEvent === 'detail'){ //查看

        } else if(layEvent === 'edit'){ //弹出类型为--编辑--的弹出框
            //带参数跳转编辑页面
            location.href = '/shmTemplatebaseinfo/getTemplatebaseinfoEdit?templateId=' + rowData.id
        }
    });
    //监听行单击事件
    table.on('row(s_formList)', function(obj){
        params.data.id = obj.data.id;
        params.data.name = obj.data.name;
        params.data.weight = obj.data.weight;
        params.data.remarks = obj.data.remarks;
        params.data.formType = obj.data.formType;
        $(".active-tr").removeClass("active-tr");
        obj.tr.addClass("active-tr");
    });
    //定义判重
    $(".s-app").on('click',function () {
        if(params.data.id === '') {
            layer.alert('请选择要定义判重的模板', {
                icon :2,
                shift : 6
            });
            return false
        } else {
            layer.open({
                type:2,
                title:'字段判重',
                skin: 's-alert-data', //样式类名
                closeBtn:1,
                anim: 2,
                area:['600px','460px'],
                shadeClose: false, //开启遮罩关闭
                content:['/shmTemplatebaseinfo/toDuplicateFactor?id='+params.data.id],
                end:function () {

                }
            })
        }
    });
    //修改模板
    $(".s-resetName").on('click',function () {
        if(params.data.id === '') {
            layer.alert('请选择要修改的模板', {
                icon :2,
                shift : 6
            });
            return false
        }
        form.val("add-department", {
            "formType":params.data.formType
        });
        $("#templateName").val(params.data.name);
        $("#weight").val(params.data.weight);
        $("#remarks").val(params.data.remarks);
        if(params.data.formType==1){
            $("#trFormType").hide();
        }
        params.open('edit','模板修改');
    });
    $(".s-alert-send").on('click',function () {
        var url;
        if(type === 'add') {
            url = '/shmTemplatebaseinfo/exAdd';
            params.data.id=null;
        } else if(type === 'edit') {
            url = '/shmTemplatebaseinfo/exEditName'
        }
        var name = $("#templateName").val();
        var weight = $("#weight").val();
        var remarks = $("#remarks").val();
        if(name === '') {
            layer.alert('模板名称不能为空', {
                icon :2,
                shift : 6
            });
            return false
        }
        if(weight === '') {
            layer.alert('模板权重不能为空', {
                icon :2,
                shift : 6
            });
            return false
        }
        if($("#formType").val() === '') {
            layer.alert('模板类别不能为空', {
                icon :2,
                shift : 6
            });
            return false
        }
        if(isNaN(weight)){
            layer.alert('模板权重应该为数字', {
                icon :2,
                shift : 6
            });
            return false
        }
        layer.load(2);
        $.post(url,{id:params.data.id,name:name,weight:weight,remarks:remarks,formType:$("#formType").val()},function (res) {
            layer.closeAll('loading');
            if(res.code === 10001) {
                layer.close(addOrEdit);
                layer.msg(res.msg);
                table.reload('s_formList');
            } else {
                layer.msg(res.msg);
            }
        });
    })
    $(".s-alert-close").on('click',function () {
        $("#trFormType").show();
        layer.close(addOrEdit);
    });

    //删除表单
    $(".s-add-user").on('click',function () {
        if(params.data.id === '') {
            layer.alert('请选择要删除的模板', {
                icon :2,
                shift : 6
            });
            return false
        }
        layer.confirm('确定删除该模板?', {
            title:'删除确认',
            skin:'s-del-title'
        },function(index){
            layer.close(index);
            //向服务端发送删除指令
            $.post('/shmTemplatebaseinfo/exDelete',{ids:params.data.id},function (res) {
                if(res.code === 10001) {
                    layer.msg('删除成功');
                    table.reload('s_formList');
                } else {
                    layer.msg(res.msg);
                }
            });
        });
    })

    //新增表单
    $(".s-reset-all").on('click',function () {
        params.open('add','模板新增');
    })
});