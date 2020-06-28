layui.use(['form','table','layer'],function () {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer;

    //初始化表格
    table.render({
        elem: '#s_formList',
        url:'/shmPhonesConfig/getShmPhonesConfigList',   //有数据接口不需要data
        response: {
            statusCode:10001, //规定成功的状态码，默认：0
        },
        cols: [[
            {type:'numbers',"class":'num',align: "center",unresize:true,title: '序号'},
            {field:'deptName',align: "center",unresize:true,title: '单位名称'},
            {field:'phones',align: "center",unresize:true,title: '电话号码',edit: 'text'}
        ]],
        page: false,
        align:"center"
    });

    //监听单元格编辑
    table.on('edit(s_formList)', function(obj){
        var value = obj.value //得到修改后的值
            ,data = obj.data //得到所在行所有键值
            ,field = obj.field; //得到字段
        //layer.msg('[ID: '+ data.id +'] ' + field + ' 字段更改为：'+ value);
        var url="/shmPhonesConfig/exEdit";
        if(value.length>200){
            layer.msg("号码不能太长!");
            return;
        }
        $.post(url,{id:data.id,deptId:data.deptId,phones:value},function (res) {
            if(res.code === 10001) {
                layer.msg(res.msg);
                //location.href ="/shmInterface/toShmInterfaceList";
            } else {
                layer.msg(res.msg);
            }
        });
    });

});