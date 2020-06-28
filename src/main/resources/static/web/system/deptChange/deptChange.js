layui.use(['form','table','layer'],function () {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer;

    //初始化表格
    table.render({
        elem: '#s_formList',
        url:'/shmDeptchangeinfo/getShmDeptchangeinfoList',   //有数据接口不需要data
        response: {
            statusCode:10001, //规定成功的状态码，默认：0
        },
        cols: [[
            {type:'numbers',"class":'num',align: "center",unresize:true,title: '序号'},
            {field:'deptName',align: "center",unresize:true,title: '新部门'},
            {field:'applyTime',align: "center",unresize:true,title: '申请时间'},
            {field:'auditTime',align: "center",unresize:true,title: '审核时间'},
            {field:'state',align: "center",unresize:true,title: '状态'},
            {field:'auditOpinion',align: "center",unresize:true,title: '审核意见'}
        ]],
        page: false,
        align:"center"
    });

    //监听单元格编辑
    // table.on('edit(s_formList)', function(obj){
    //     var value = obj.value //得到修改后的值
    //         ,data = obj.data //得到所在行所有键值
    //         ,field = obj.field; //得到字段
    //     //layer.msg('[ID: '+ data.id +'] ' + field + ' 字段更改为：'+ value);
    //     var url="/shmPhonesConfig/exEdit";
    //     $.post(url,{id:data.id,deptId:data.deptId,phones:value},function (res) {
    //         if(res.code === 10001) {
    //             layer.msg(res.msg);
    //             //location.href ="/shmInterface/toShmInterfaceList";
    //         } else {
    //             layer.msg(res.msg);
    //         }
    //     });
    // });

});