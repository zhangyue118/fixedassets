$(function(){
    $("#formKeywords").focus();
});
layui.use(['form','table','layer','laydate','upload'],function () {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laydate = layui.laydate,
        upload = layui.upload;

    //常规用法
    laydate.render({
        elem: '#test1',
        value: new Date((new Date).setMonth((new Date()).getMonth()-1)),
        theme: '#6595ed'
    });
    laydate.render({
        elem: '#test2',
        value: new Date(),
        theme: '#6595ed'
    });

    //初始化表格
    table.render({
        elem: '#s_formList',
        url:'/shmTask/getShmTaskList',   //有数据接口不需要data
        request: {
            pageName: 'current', //页码的参数名称，默认：page
            limitName: 'size', //每页数据量的参数名，默认：limit
        },
        where: {
            starttime:$("#test1").val(),
            endtime:$("#test2").val()
        },
        response: {
            statusCode:10001, //规定成功的状态码，默认：0
        },
        height: 'full-133',
        cols: [[
            {type:'numbers',"class":'num',align: "center",unresize:true,title: '序号'},
            {field:'subtaskName',align: "center",unresize:true,title: '任务名称'},
            {field:'tempName',align: "center",unresize:true,title: '模板类别'},
            {field:'filename',align: "center",unresize:true,title: '文件',templet: '#link'},
            {field:'qty',align: "center",unresize:true,title: '总数'},
            {field:'stateName',align: "center",unresize:true,title: '状态'},
            {field:'createrName',align: "center",unresize:true,title: '申请人'},
            {field:'createTime',align: "center",unresize:true,title: '申请时间'},
            {field:'options',align: "center",unresize:true,title: '审核意见'},
            {minWidth:'200',align: "center", title: '操作',fixed:'right',unresize:true,toolbar:'#typeOperate'}
        ]],
        page: true,
        align:"center",
        limit:15,
        limits:[15, 20, 30, 40, 50, 60, 70, 80, 90]
    });
    //顶部表单筛选
    $(".s-filter-btn").on('click',function () {
        var st =$("#test1").val(),et = $("#test2").val();
        if(main15.isStartLessThanEnd(st,et) === false) {
            return false
        }
        var formName = $("#formKeywords").val();
        table.reload('s_formList', {
            url: '/shmTask/getShmTaskList',
            where: {
                fileName:formName,
                state:$("#taskState").val(),
                starttime:$("#test1").val(),
                endtime:$("#test2").val(),
                tempType:$("#tempType").val()
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
            var skinType='s-update-file';
            if(t==='details'){
                skinType='s-alert-dataAudit';
            }
            addOrEdit = layer.open({
                type: 1,
                title:title,
                skin: 's-alert-data', //样式类名
                closeBtn:1,
                anim: 2,
                area: '480px',
                shadeClose: false, //开启遮罩关闭
                content:$('#'+skinType),
                end:function () {
                    params.reset()//每次关闭弹框调用清空值的方法
                }
            });
        },
        openUpload:function(url) {
            layer.open({
                type: 2,
                title:'数据上传',
                skin: 's-alert-data', //样式类名
                closeBtn:1,
                anim: 2,
                area: ['480px','400px'],
                shadeClose: false, //开启遮罩关闭
                content:[url],
                end:function () {
                    params.reset()//每次关闭弹框调用清空值的方法
                }
            });
        },
        url:{
            add:'',
            edit:'',
            del:'/shmFormbaseinfo/exDelete'
        },
        data:{
            state:'',
            id:'',
            name:'',
            remarks:''
        },
        reset:function () {

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
        if(layEvent === 'details'){ //审核详情
            params.open('details','审核详情');
            $.post("/shmData/getTempAuditDetail",{subTaskId:rowData.id},function(res){
                //console.log(res.data);
                if(res.data.repeatQty!=-1){
                    $("#errorPath").attr("href",res.data.path);
                    $("#errorPathTr").show();
                }
                if(res.data.repeatQty!=-1){
                    $("#repeatQty").val(res.data.repeatQty);
                }else {
                    $("#repeatQty").val(0);
                }
                $("#exceptQty").val(res.data.exceptQty);
                $("#weight1").val(res.data.weight);
                $("#state").val(res.data.resultName);
                $("#options1").val(res.data.options);
            });
        }
        else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除该任务?', {
                title:'删除确认',
                skin:'s-del-title'
            },function(index){
                layer.close(index);
                layer.load(2);
                //向服务端发送删除指令
                $.post('/shmTask/exDelete',{ids:params.data.id},function (res) {
                    layer.closeAll('loading');
                    if(res.code === 10001) {
                        layer.msg('删除成功');
                        table.reload('s_formList');
                    } else {
                        layer.msg(res.msg);
                    }
                });
            });
        }
    });
    //监听行单击事件
    table.on('row(s_formList)', function(obj){
        params.data.id = obj.data.id;
        params.data.name = obj.data.name;
        params.data.remarks = obj.data.remarks;
        $(".active-tr").removeClass("active-tr");
        obj.tr.addClass("active-tr");
    });

    //上传不带图片文件
    $(".s-add-btn").on('click',function () {
        params.openUpload('/shmTask/toFileUpload');
    });

    //上传带图片文件
    $(".s-addpic-btn").on('click',function () {
        params.openUpload('/shmTask/toFileUploadPicture');
    });

    $(".s-alert-send").on('click',function () {
        var url;
        if(type === 'add') {
            url = '/shmFormbaseinfo/exAddShmFormbaseinfo';
            params.data.id=null;
        } else if(type === 'edit') {
            url = '/shmFormbaseinfo/exEditName'
        }
        var name = $("#formName").val();
        var remarks=$("#remarks").val();
        if(name === '') {
            layer.alert('表单名称不能为空', {
                icon :2,
                shift : 6
            });
            return false
        }
        $.post(url,{id:params.data.id,name:name,remarks:remarks},function (res) {
            if(res.code === 10001) {
                layer.close(addOrEdit);
                layer.msg(res.msg);
                table.reload('s_formList');
            } else {
                layer.msg(res.msg);
            }
        });
    });
    $(".s-alert-close").on('click',function () {
        layer.close(addOrEdit);
    });

    //关闭
    $(".s-alert-close1").on('click',function () {
        $("#errorPath").attr("href","javascript:void(0);");
        $("#errorPathTr").hide();
        $("#repeatQty").val("");
        $("#exceptQty").val("");
        $("#weight1").val("");
        $("#state").val("");
        $("#options1").val("");
        layer.close(addOrEdit);
    });

});