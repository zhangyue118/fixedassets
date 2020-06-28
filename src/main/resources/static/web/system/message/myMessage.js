layui.use(['form','table','layer'],function () {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer,
        userId = $(".s-my-msg", window.parent.document).data('userid');
    //初始化表格
    table.render({
        elem: '#s_myMsgList',
        url:'/shmMessage/myShmMessageList',
        where:{
            userId:userId
        },
        request: {
            pageName: 'current', //页码的参数名称，默认：page
            limitName: 'size' //每页数据量的参数名，默认：limit
        },
        response: {
            statusCode:10001 //规定成功的状态码，默认：0
        },
        height:'full',
        cols: [[
            {field:'title',align: "left",unresize:true,templet:"#s_myMsg_link"},
            {field:'createTime',align: "center",unresize:true}
        ]],
        page: true,
        align:"center",
        limit:15,
        limits:[15, 20, 30, 40, 50, 60, 70, 80, 90],
        done:function () {
            $(".layui-table-header").hide();
        }
    });
    $(".layui-table-header").hide();//表头隐藏的样式
    //顶部查询
    $(".s-filter-btn").on('click',function () {
        var data = {};
        data.userId = userId;
        data.title = $("#messageTitle").val();
        table.reload('s_myMsgList', {
            url: '/shmMessage/myShmMessageList',
            where: data,//设定异步数据接口的额外参数
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });
    //未读消息条数显示 是否已读状态更新
    $("body").on("click",".s-row-link",function () {
        var id = $(this).data("id"),
            isRead = $(this).data("read");
        if(isRead === 0) {
            $.post('/shmMessage/updateMyShmMessage',{messageId:id,userId:userId},function (res) {
                if(res.code === 10001) {
                    var count = $(".s-my-msg span",window.parent.document).text();
                    if(count === '1') {
                        $(".s-my-msg span",window.parent.document).hide();
                    } else {
                        $(".s-my-msg span",window.parent.document).text(Number(count)-1);
                    }
                    location.href = '/shmMessage/getMyShmMessageDetails?messageId='+id
                }
            });
        } else {
            location.href = '/shmMessage/getMyShmMessageDetails?messageId='+id
        }
    });
});