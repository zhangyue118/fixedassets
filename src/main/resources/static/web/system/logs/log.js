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
        url:'/shmLogs/listShmLogs',   //有数据接口不需要data
        request: {
            pageName: 'current', //页码的参数名称，默认：page
            limitName: 'size' //每页数据量的参数名，默认：limit
        },
        response: {
            statusCode:10001, //规定成功的状态码，默认：0
        },
        cols: [[
            {type:'numbers',"class":'num',align: "center",unresize:true,title: '序号'},
            {field:'loginName',align: "center",unresize:true,title: '登录名'},
            {field:'userName',align: "center",unresize:true,title: '用户名'},
            {field:'policeId',align: "center",unresize:true,title: '警号'},
            {field:'deptName',align: "center",unresize:true,title: '部门'},
            {field:'moduleName',align: "center",unresize:true,title: '模块名称'},
            {field:'functionName',align: "center",unresize:true,title: '功能名称'},
            {field:'operateContent',align: "center",unresize:true,title: '内容'},
            {field:'operationTime',align: "center",unresize:true,title: '操作时间'},
            {field:'ip',align: "center",unresize:true,title: 'IP'}
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
            url: '/shmLogs/listShmLogs',
            where: {
                userName:formName,
                moduleName:$("#moduleName").val(),
                functionName:$("#functionName").val(),
                startTime:$("#test1").val(),
                endTime:$("#test2").val()
            }, //设定异步数据接口的额外参数
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });
});