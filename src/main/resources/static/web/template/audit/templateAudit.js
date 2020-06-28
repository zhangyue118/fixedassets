$(document).ready(function(){
    $.get('/shmData/treeShmDepartment',function (res) {
        //渲染树形结构
        main15.moduleTree('deptTree',res.data,'/shmData/treeShmDepartment', {
            onCheck:function (event, treeId, treeNode) {
                if(treeNode !== null) {
                    var deptNames =[];
                    var treeObj = $.fn.zTree.getZTreeObj("deptTree");//获取到树
                    var nodesSys = treeObj.getNodes(); //可以获取所有的父节点
                    var nodesSysAll = treeObj.transformToArray(nodesSys); //获取树所有节点
                    nodesSysAll.forEach(function (item,index) {
                        if(item.checked&&!item.isParent){
                            deptNames.push(item.name);
                        }
                    })
                    $("#deptName").val(deptNames.join(','));
                }
            }
        })
    });
});


layui.use(['form','table','laydate','layer'],function () {
    var form = layui.form,
        table = layui.table,
        laydate = layui.laydate,
        layer = layui.layer;
    //常规用法
    laydate.render({
        elem: '#test1',
        // value: new Date((new Date).setMonth((new Date()).getMonth()-1)),
        theme: '#6595ed'
    });
    laydate.render({
        elem: '#test2',
        // value: new Date(),
        theme: '#6595ed'
    });
    //初始化表格
    table.render({
        elem: '#d_templateDataList',
        url:'/shmData/getShmDataList',
        id: 'd_templateDataList',
        request: {
            pageName: 'current', //页码的参数名称，默认：page
            limitName: 'size' //每页数据量的参数名，默认：limit
        },
        response: {
            statusCode:10001 //规定成功的状态码，默认：0
        },
        height:'full-235',
        cols: [[
            // {type:'checkbox'},
            {type:'numbers',"class":'num',align: "center",unresize:true,title: '序号'},
            {field:'deptName',align: "center",unresize:true,title: '上传派出所'},
            {field:'baseinfoName',align: "center",unresize:true,title: '上传类型'},
            {field:'qty',align: "center",unresize:true,title: '上传条数'},
            {field:'repeatQty',align: "center",unresize:true,title: '重复条数'},
            {field:'exceptQty',align: "center",unresize:true,title: '异常数据条数'},
            {field:'filename',align: "center",unresize:true,title: '数据文件',templet: '#link'},
            {field:'stateName',align: "center",unresize:true,title: '审核状态'},
            {field:'options',align: "center",unresize:true,title: '审核意见'},
            {field:'weight',align: "center",unresize:true,title: '分值'},
            {field:'createTime',align: "center",unresize:true,title: '上传时间'},
            {minWidth:'120',align: "center", title: '异常情况',fixed:'right',unresize:true,toolbar:'#typeOperate'}
        ]],
        page: true,
        align:"center",
        limit:15,
        limits:[15, 20, 30, 40, 50, 60, 70, 80, 90]
    });

    //定义一个用于存储参数方法的对象
    var addOrEdit,type;
    var datas=[];
    var params = {
        open:function (t,title) {
            type = t; //给type赋值
            var skinType='s-alert-data';
            if(t==='detail'){
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
            if(t!='detail'){
                $("#weight").val(1);
                $("#weight").focus();
            }
        },
        url:{
            add:'',
            edit:'',
            del:'/shmFormbaseinfo/exDelete'
        },
        data:{
            state:'',
            id:'',
            name:''
        },
        stateData:[],
        reset:function () {
            $("#options").val('');
            $("#weight").val('');
        }
    };

    //监听工具条
    table.on('tool(d_templateDataList)', function(obj){
        var rowData = obj.data; //获得当前行数据
        var layEvent = obj.event;
        var tr = obj.tr;
        if(layEvent === 'audit'){ //弹出类型为--编辑--的弹出框
            params.open('audit','数据审核');
        }
        if(layEvent === 'detail'){ //弹出类型为--编辑--的弹出框
            //console.log(rowData.id);
            params.open('detail','审核详情');
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
    });

    //监听行单击事件
    table.on('row(d_templateDataList)', function(obj){
        params.data.id = obj.data.id;
        params.data.name = obj.data.name;
        params.data.state = obj.data.state;

        $(".active-tr").removeClass("active-tr");
        obj.tr.addClass("active-tr");
    });
    table.on('checkbox(d_templateDataList)', function(obj){
        var checkStatus = table.checkStatus('d_templateDataList');
        datas = checkStatus.data;
    });
    //顶部字典筛选
    $(".s-filter-btn").on('click',function () {

        var treeObj = $.fn.zTree.getZTreeObj("deptTree");//获取到树
        var nodesSys = treeObj.getNodes(); //可以获取所有的父节点
        var nodesSysAll = treeObj.transformToArray(nodesSys); //获取树所有节点
        var deptIds=[];
        nodesSysAll.forEach(function (item,index) {
            if(item.checked&&!item.isParent){
                deptIds.push(item.id);
            }
        })

        var st =$("#test1").val(),et = $("#test2").val();
        if(main15.isStartLessThanEnd(st,et) === false) {
            return false
        }
        table.reload('d_templateDataList', {
            url:'/shmData/getShmDataList',
            where: {
                baseinfoId:$("#templateId").val(),
                state:params.stateData.join(),
                starttime:$("#test1").val(),
                endtime:$("#test2").val(),
                deptId:deptIds.join(',')
            }, //设定异步数据接口的额外参数
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });

    //审核
    $(".s-btn-danger").on('click',function () {
        if(datas.length>0){
            var ids='';
            var state=false;
            datas.forEach((item,index,array)=>{
                ids+=item.id+ ",";
                if(!state){
                    state=item.state == 'F';
                }
                if(!state){
                    state=item.state == 'C';
                }
                if(!state){
                    state=item.state == 'EF';
                }
            })
            if(state) {
                layer.alert('选中数据中存在上传失败，正在比对中，审核失败三种情况，不可以再次审核', {
                    icon :7,
                    shift : 6
                });
                return false
            }else{
                if (ids.length > 0) {
                    ids = ids.substr(0, ids.length - 1);
                }
                $.post('/shmData/checkDatas',{subtaskId:ids,state:1,weight:1},function (res) {
                    layer.closeAll('loading');
                    if(res.code === 10001) {
                        layer.msg(res.msg);
                        table.reload('d_templateDataList');
                    } else if(res.code === 10003) {
                        layer.msg(res.msg);
                    } else {
                        layer.msg(res.msg);
                    }
                });
            }
        }else{
            if(params.data.id === '') {
                layer.alert('请选择要审核的数据', {
                    icon :2,
                    shift : 6
                });
                return false
            } else if(params.data.state == 'F') {
                layer.alert('该条数据上传失败，不可以审核', {
                    icon :7,
                    shift : 6
                });
                return false
            } else if(params.data.state == 'C') {
                layer.alert('该条数据正在比对中,不可以审核', {
                    icon :7,
                    shift : 6
                });
                return false
            }else if(params.data.state == 'EF') {
                layer.alert('该条数据审核失败,不可以再次审核', {
                    icon :7,
                    shift : 6
                });
                return false
            } else {
                params.open('audit','数据审核');
            }
        }
    });

    //通过
    $(".s-alert-send").on('click',function () {
        var url;
        if(type === 'audit') {
            url = '/shmData/checkData';
        }
        var options = $("#options").val();
        var weight = $("#weight").val();
        if(weight === '') {
            layer.alert('请输入分值!', {
                icon :2,
                shift : 6
            });
            return false
        }
        layer.load(2);
        $.post(url,{subtaskId:params.data.id,name:params.data.name,options:options,state:1,weight:weight},function (res) {
            layer.closeAll('loading');
            if(res.code === 10001) {
                layer.close(addOrEdit);
                layer.msg(res.msg);
                table.reload('d_templateDataList');
            } else if(res.code === 10003) {
                layer.close(addOrEdit);
                layer.confirm(res.msg, {
                    btn: ['继续','返回'] //按钮
                }, function(){
                    layer.load(2);
                    $.post('/shmData/contiune',{subtaskId:params.data.id,name:params.data.name,options:options,state:1,weight:weight},
                        function (rest) {
                            layer.closeAll('loading');
                            layer.msg(rest.msg);
                            if(rest.code === 10001) {
                                table.reload('d_templateDataList');
                            }
                        })
                }, function(){
                    table.reload('d_templateDataList');
                });
            } else {
                layer.msg(res.msg);
            }
        });
    });
    //强制通过
    // $(".s-strong-send").on('click',function () {
    //     var url;
    //     if(type === 'audit') {
    //         url = '/shmData/checkData';
    //     }
    //     var options = $("#options").val();
    //     var weight = $("#weight").val();
    //     if(weight === '') {
    //         layer.alert('请输入权重!', {
    //             icon :2,
    //             shift : 6
    //         });
    //         return false
    //     }
    //     layer.load(2);
    //     $.post(url,{subtaskId:params.data.id,name:params.data.name,options:options,state:3,weight:weight},function (res) {
    //         layer.closeAll('loading');
    //         if(res.code === 10001) {
    //             layer.close(addOrEdit);
    //             layer.msg(res.msg);
    //             table.reload('d_templateDataList');
    //         } else {
    //             layer.msg(res.msg);
    //         }
    //     });
    // });
    //退回
    $(".s-alert-close").on('click',function () {
        var url;
        if(type === 'audit') {
            url = '/shmData/checkData';
        }
        var options = $("#options").val();
        if(options === '') {
            layer.alert('审核意见不能为空', {
                icon :2,
                shift : 6
            });
            return false
        }
        layer.load(2);
        $.post(url,{subtaskId:params.data.id,name:params.data.name,options:options,state:2},function (res) {
            layer.closeAll('loading');
            if(res.code === 10001) {
                layer.close(addOrEdit);
                layer.msg(res.msg);
                table.reload('d_templateDataList');
            } else {
                layer.msg(res.msg);
            }
        });
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

    // 下拉多选
    $("#layuiSelectCheckbox").on('click',function () {
        $(this).toggleClass("layui-form-selected")
    });
    $(".layui-anim").on('click',function () {
        return false
    });
    $("#layuiSelectCheckbox .s-selected-checkbox").each(function () {
        var f = $(this).attr("lay-filter");
        form.on('checkbox('+ f +')',function (data) {
            var strVal = '';
            params.stateData = [];
            $("input:checkbox[name='state']:checked").each(function () {
                strVal += $(this).attr("title") + '/';
                params.stateData.push($(this).val())
            });
            $("#selectedView").val(strVal.substring(0,strVal.length-1));
        });
    });
    //下载
    $("body").on("click",".s-downlaod-btn",function () {
        var id = $(this).attr("id");
        $.get('/shmData/download',{subtaskId:id},function (res) {

        });
    })
});