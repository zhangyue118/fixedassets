layui.use(['form','table','layer'],function () {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer;

    //初始化表格
    var arrTable;
    $.ajaxSettings.async = false;//关闭异步
    $.post('/shmTemplatebaseinfo/getShmTemplateEditInfo',{templateId:$("body").data("id")},function (res) {
        if(res.code === 10001) {
            //$("#name").val(res.data.shmFormbaseinfo.name);
            //$("#remarks").val(res.data.shmFormbaseinfo.remarks);
            arrTable = res.data;
        }
    });
    $.ajaxSettings.async = true;//开启异步
    table.render({
        elem: '#s_formList',
        id:'s_formList',
        data:arrTable,
        cols: [[
            {type:'numbers',"class":'num',align: "center",unresize:true,title: '序号'},
            {field:'name',align: "center",unresize:true,title: '字段名称'},
            {field:'itemTypeName',align: "center",unresize:true,title: '输入形式'},
            {field:'isShowName',align: "center",unresize:true,title: '是否启用',templet:'#formState'},
            {field:'ruleTypeName',align: "center",unresize:true,title: '规则'},
            {minWidth:'200',align: "center", title: '操作',fixed:'right',unresize:true,toolbar:'#typeOperate'}
        ]],
        limit:200,
        align:"center"
    });

    //定义一个用于存储参数方法的对象
    var addOrEdit,setRule;
    var params = {
        open:function (t,title) {
            params.type = t; //给type赋值
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
            $("#nameZh").focus();
        },
        openRule:function(id) {
            setRule = layer.open({
                type:2,
                title:'定义规则',
                skin: 's-alert-data', //样式类名
                closeBtn:1,
                anim: 2,
                area:['480px','400px'],
                shadeClose: false, //开启遮罩关闭
                content:['/shmTemplatebaseinfo/toRule?id='+id],
                end:function () {

                }
            })
        },
        type:'add', //弹出框的类型 新增 = add / 编辑 = edit
        editDate:'',
        url:{       //新增编辑接口地址
            //edit:'/shmFormbaseinfo/exEdit',
            editRow:'/shmTemplatebaseinfo/exEditTemplatedataitem'
        },
        tips:{
            name:'中文显示名称不能为空',
            itemType:'请选择输入形式'
        },
        must:{
            name:'',
            itemType:''
        },
        data:{ //存储新增编辑的数据
            seq:'',
            name:'',
            itemType:'',
            isShow:0,
            isResult:0,
            isCondition:0,
            isEnablingRule:0
        },
        textData:{
            input:'',
            text:'',
            code:''
        },
        tableData:arrTable,
        ifEmpty:function() {//判断非空
            for(var k in params.must) {
                if(params.must[k] === '') {
                    layer.alert(params.tips[k], {
                        icon :2,
                        shift : 6
                    });
                    return false
                }
            }
        },
        addTable:function() {
            params.data.name = $("#nameZh").val();
            params.must.name = $("#nameZh").val();
            if(params.ifEmpty() === false) {
                return false
            }
            if(params.type === 'add') {
                var data = {
                    id:null,
                    name:params.data.name,
                    itemType:params.data.itemType,
                    isShow:params.data.isShow,
                    isResult:params.data.isResult,
                    isCondition:params.data.isCondition,
                    isEnablingRule:params.data.isEnablingRule,
                    templateId:$("body").data("id"),
                };
                $.post('/shmTemplatebaseinfo/exAddTemplatedataitem',data,function (res) {
                    layer.msg(res.msg);
                    if(res.code === 10001){
                        refreshList();
                    } else {

                    }
                });
                table.reload('s_formList', {
                    data:params.tableData,
                    done:function () {
                        layer.close(addOrEdit);//关闭弹出框
                    }
                });
            } else if(params.type === 'insert'){
                var data = {
                    id:null,
                    name:params.data.name,
                    seq:params.data.seq,
                    itemType:params.data.itemType,
                    isShow:params.data.isShow,
                    isResult:params.data.isResult,
                    isCondition:params.data.isCondition,
                    isEnablingRule:params.data.isEnablingRule,
                    templateId:$("body").data("id"),
                };
                $.post('/shmTemplatebaseinfo/exAddTemplatedataitem',data,function (res) {
                    layer.msg(res.msg);
                    if(res.code === 10001){
                        refreshList();
                    } else {
                    }
                });
                table.reload('s_formList', {
                    data:params.tableData,
                    done:function () {
                        layer.close(addOrEdit);//关闭弹出框
                    }
                });
            } else if(params.type === 'edit'){
                var editData = params.editDate;
                $.extend(true,editData, params.data);
                $.post(params.url.editRow,editData,function (res) {
                    if(res.code === 10001) {
                        layer.msg('编辑表单成功');
                        refreshList();
                    } else {
                        layer.msg(res.msg);
                    }
                });
            }
        },

        reset:function () {
            for (var k in params.data) {
                if(k === 'isShow' || k === 'isResult' || k === 'isCondition' || k=== 'isEnablingRule') {
                    params.data[k] = 0
                } else {
                    params.data[k] = ''
                }
            }
            for (var k in params.must) {
                params.must[k] = ''
            }
            $("#nameZh").val('');
            form.val("add-form", {
                "add-enterType": "",
                "add-state":false,
                "add-result":false,
                "add-params":false,
                "add-enabling":false
            });
            $(".s-checkbox").attr('checked',false).prop('checked',false);
            form.render();
        },
        move:function (arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        }
    };

    //监听行单击事件
    table.on('row(s_formList)', function(obj){
        params.data.id = obj.data.id;
        params.data.seq = obj.data.seq;
        params.data.templatebaseinfoId = obj.data.templatebaseinfoId;
        $(".active-tr").removeClass("active-tr");
        obj.tr.addClass("active-tr");
    });

    //弹窗模态下拉框取值
    function turnVal(v) { // 值类型转换
        if(v === true) {
            return 1
        } else if (v === false) {
            return 0
        } else if (v === 1) {
            return true
        } else if (v === 0) {
            return false
        }
    }
    form.on('select(add-enterType)',function (data) {
        params.data.itemType = data.value;
        if(params.data.itemType === 'P'){
            $("input[name='add-params']").attr('checked',false);
            $("input[name='add-params']").attr("disabled",true);
        }else {
            $("input[name='add-params']").attr("disabled",false);
        }
        params.must.itemType = data.value;
        params.textData.input = data.elem.selectedOptions[0].text;
        form.render();
    });

    form.on('checkbox(add-state)',function (data) {
        params.data.isShow = turnVal(data.elem.checked);
    });
    form.on('checkbox(add-result)',function (data) {
        params.data.isResult = turnVal(data.elem.checked);
    });
    form.on('checkbox(add-params)',function (data) {
        params.data.isCondition = turnVal(data.elem.checked);
    });
    form.on('checkbox(add-enabling)',function (data) {
        params.data.isEnablingRule = turnVal(data.elem.checked);
    });
    //弹出类型为--新增--的弹出框
    $(".s-add-form").on('click',function () {
        params.open('add','新建字段');
    });
    //弹出类型为--插入--的弹出框
    $(".s-insert-template").on('click',function () {
        if(params.data.id === ''||params.data.id===undefined) {
            layer.alert('请选择要插入的模板', {
                icon :2,
                shift : 6
            });
            return false
        }
        params.open('insert','插入字段');
    });

    //弹出类型为--删除--的弹出框
    $(".s-btn-danger").on('click',function () {
        if(params.data.id === ''||params.data.id===undefined) {
            layer.alert('请选择要删除的字段', {
                icon :2,
                shift : 6
            });
            return false
        }

        layer.confirm('确定删除该字段?', {
            title:'删除确认',
            skin:'s-del-title'
        },function(index){
            layer.close(index);
            $.post('/shmTemplatebaseinfo/exDelTemplatedataitem',{id:params.data.id,templateId:params.data.templatebaseinfoId},function (res) {
                if(res.code === 10001) {
                    layer.msg('删除成功');
                    refreshList();
                } else {
                    layer.msg(res.msg)
                }
            });
        });
    });

    function refreshList(){
        $.post('/shmTemplatebaseinfo/getShmTemplateEditInfo',{templateId:$("body").data("id")},function (rest) {
            if(rest.code === 10001) {
                params.tableData = rest.data;
                table.reload('s_formList', {
                    data:params.tableData,

                    done:function () {
                        layer.close(addOrEdit);//关闭弹出框
                    }
                });
            }
        });
    }

    //提交弹出框所填信息
    $(".s-alert-send").on('click',function () {
        params.addTable();
    });

    //自定义关闭按钮关闭弹出框
    $(".s-alert-close").on('click',function () {
        layer.close(addOrEdit);
    });
    //返回列表
    $(".s-back").on('click',function () {
        location.href = '/shmTemplatebaseinfo/getShmTemplateList'
    });
    //监听工具条
    table.on('tool(s_formList)', function(obj){
        var rowData = obj.data; //获得当前行数据
        var layEvent = obj.event;
        var tr = obj.tr;
        var rowIndex=$($(this)[0].parentNode.parentNode.parentNode).data("index");
        if(layEvent === 'detail'){ //查看

        }

        else if(layEvent === 'edit'){ //弹出类型为--编辑--的弹出框
            //视图回显
            $("#nameZh").val(rowData.name);
            form.val("add-form", {
                "add-enterType":rowData.itemType,
                "add-state":turnVal(rowData.isShow),
                "add-result":turnVal(rowData.isResult),
                "add-params":turnVal(rowData.isCondition),
                "add-enabling":turnVal(rowData.isEnablingRule)
            });

            $(".input[name='add-state']").attr('checked',turnVal(rowData.isShow));
            $(".input[name='add-result']").attr('checked',turnVal(rowData.isResult));
            $(".input[name='add-params']").attr('checked',turnVal(rowData.isCondition));
            $(".input[name='add-enabling']").attr('checked',turnVal(rowData.isEnablingRule));
            if(rowData.itemType === 'P'){
                $("input[name='add-params']").attr('checked',false);
                $("input[name='add-params']").attr("disabled",true);
            }else {
                $("input[name='add-params']").attr("disabled",false);
            }
            form.render();
            //接口data赋值
            params.data.seq = rowData.seq;
            params.data.name = rowData.name;
            params.data.itemType = rowData.itemType;
            params.data.isShow = rowData.isShow;
            params.data.isResult = rowData.isResult;
            params.data.isCondition = rowData.isCondition;
            params.data.isEnablingRule = rowData.isEnablingRule;
            params.editDate = {
                id:rowData.id,
                templatebaseinfoId:rowData.templatebaseinfoId,
                templateId:rowData.templatebaseinfoId
            };
            //必填项must赋值
            params.must.name = rowData.name;
            params.must.itemType = rowData.itemType;
            params.open('edit','编辑模板字段');
        } else if(layEvent === 'up') {
            if(rowIndex === 0) {
                layer.msg('已经是第一位',{time:800})
            } else {
                $.post('/shmTemplatebaseinfo/updateDataitemSeq',{
                    templateId:rowData.templatebaseinfoId,
                    id1:rowData.id,
                    id2:params.tableData[rowIndex-1].id,
                    seq1:rowData.seq - 1,
                    seq2:rowData.seq
                },function (res) {
                    if(res.code === 10001) {
                        params.tableData = params.move(params.tableData,rowIndex-1,rowIndex);
                        params.tableData[rowIndex].seq = rowData.seq;
                        params.tableData[rowIndex-1].seq = rowData.seq - 1;
                        table.reload('s_formList', {
                            data:params.tableData
                        });
                    } else {
                        layer.msg(res.msg)
                    }
                });
            }
        } else if(layEvent === 'down') {
            var count = params.tableData.length;
            if(rowData.id === params.tableData[count-1].id) {
                layer.msg('已经是最后一位',{time:800})
            } else {
                $.post('/shmTemplatebaseinfo/updateDataitemSeq',{
                    templateId:rowData.templatebaseinfoId,
                    id1:rowData.id,
                    id2:params.tableData[rowIndex+1].id,
                    seq1:rowData.seq + 1,
                    seq2:rowData.seq
                },function (res) {
                    if(res.code === 10001) {
                        params.tableData = params.move(params.tableData,rowIndex,rowIndex+1);
                        params.tableData[rowIndex].seq = rowData.seq;
                        params.tableData[rowIndex+1].seq = rowData.seq + 1;
                        table.reload('s_formList', {
                            data:params.tableData
                        });
                    } else {
                        layer.msg(res.msg)
                    }
                });
            }
        } else if(layEvent === 'rule') {
            params.openRule(rowData.id)
        }
    });

    window.reloadTable = function() {
        $.post('/shmTemplatebaseinfo/getShmTemplateEditInfo',{templateId:$("body").data("id")},function (res) {
            if(res.code === 10001) {
                //$("#name").val(res.data.shmFormbaseinfo.name);
                //$("#remarks").val(res.data.shmFormbaseinfo.remarks);
                table.reload('s_formList',{
                    data:res.data
                })//重载表格更新视图
            }
        });
    }
});