$(function(){
    $("#formKeywords").focus();
});
layui.use(['form','table','layer','laydate'],function () {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laydate = layui.laydate;

    //常规用法
    laydate.render({
        elem: '#test1',
        theme: '#6595ed'
    });
    laydate.render({
        elem: '#test2',
        theme: '#6595ed'
    });

    //初始化表格
    table.render({
        elem: '#s_formList',
        url:'/shmDeptAudit/getShmDeptAuditList',   //有数据接口不需要data
        request: {
            pageName: 'current', //页码的参数名称，默认：page
            limitName: 'size' //每页数据量的参数名，默认：limit
        },
        response: {
            statusCode:10001, //规定成功的状态码，默认：0
        },
        cols: [[
            {type:'numbers',"class":'num',align: "center",unresize:true,title: '序号'},
            {field:'userName',align: "center",unresize:true,title: '登录名'},
            {field:'deptNameOld',align: "center",unresize:true,title: '原部门'},
            {field:'deptName',align: "center",unresize:true,title: '新部门'},
            {field:'applyTime',align: "center",unresize:true,title: '申请时间'},
            {field:'auditTime',align: "center",unresize:true,title: '审核时间'},
            {field:'state',align: "center",unresize:true,title: '状态'},
            {field:'auditOpinion',align: "center",unresize:true,title: '审核意见'},
            {minWidth:'200',align: "center", title: '审核',fixed:'right',unresize:true,toolbar:'#typeOperate'}
        ]],
        page: true,
        align:"center",
        limit:15,
        limits:[15, 20, 30, 40, 50, 60, 70, 80, 90]
    });
    //顶部表单筛选
    $(".s-filter-btn").on('click',function () {
        var formName = $("#formKeywords").val();
        var st =$("#test1").val(),et = $("#test2").val();
        if(main15.isStartLessThanEnd(st,et) === false) {
            return false
        }
        table.reload('s_formList', {
            url: '/shmDeptAudit/getShmDeptAuditList',
            where: {
                userName:formName,
                state:$("#state").val(),
                starttime:$("#test1").val(),
                endtime:$("#test2").val()
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
            $("#opinion").focus();
        },
        url:{
            add:'',
            edit:'/shmDeptAudit/exEdit',
            del:'/shmFormbaseinfo/exDelete'
        },
        data:{
            id:'',
            name:'',
            state:''
        },
        reset:function () {
            $("#name").val('');
            $("#opinion").val('');
        }
    };
    // form.on('select(formState)',function (data) {
    //     params.data.state = data.value;
    // });
    // //监听工具条
    table.on('tool(s_formList)', function(obj){
        var rowData = obj.data; //获得当前行数据
        var layEvent = obj.event;
        var tr = obj.tr;
        params.data.id=rowData.id;
        if(layEvent === 'examine'){ //审核
            $("#name").val(user.name);
            params.open('edit','部门变更审核');
        }
    });

    $(".s-alert-send").on('click',function () {

        var opinion=$("#opinion").val();
        if(opinion === '') {
            layer.alert('审核意见不能为空', {
                icon :2,
                shift : 6
            });
            return false
        }
        $.post(params.url.edit,{deptchangeinfoId:params.data.id,auditResult:1,auditOpinion:opinion},function (res) {
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
        var opinion=$("#opinion").val();
        if(opinion === '') {
            layer.alert('审核意见不能为空', {
                icon :2,
                shift : 6
            });
            return false
        }
        $.post(params.url.edit,{deptchangeinfoId:params.data.id,auditResult:0,auditOpinion:opinion},function (res) {
            if(res.code === 10001) {
                layer.close(addOrEdit);
                layer.msg(res.msg);
                table.reload('s_formList');
            } else {
                layer.msg(res.msg);
            }
        });
    });
});