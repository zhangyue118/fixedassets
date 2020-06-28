layui.use(['form','table','layer'],function () {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer,
        id = $("body").data('id'),
        n = 0 //定义初始化type = 2 时的规则个数
    ;
    var params = { //定义参数
        ltShmValidateRule:[{relationCode:1}],
        shmTemplatedataitem:{
            id:id
        },
        type:1
    },isEmpty; // 非空;
    var optDOM = $(".s-select-data").html();
    //规则回显
    $.post('/shmTemplatebaseinfo/getShmValidateRule',{id:id},function (res) {
        if(res.code === 10001) {
            params.type = res.data.ruleType; //回显将规则类型赋值到参数
            form.val("rule-content", {
                "rule": res.data.ruleType
            });
            $(".s-rule-item").removeClass("s-show");
            $(".s-rule-item").eq(res.data.ruleType - 1).addClass("s-show");
            if(res.data.ruleType === 1) {
                //type为 1 时 的回显
                if(res.data.list.length !== 0) {
                    form.val("rule-content", {
                        "rule-type-0":res.data.list[0].relationCode
                    });
                    form.render('select');
                }
            } else {
                //type为 2 时 的回显
                var tr = '',obj = {};
                n = res.data.list.length;
                res.data.list.forEach(function (item,index) {
                    var selectDOM = '<select class="rule" data-num="'+ index +'" name="rule'+ index +'" lay-filter="rule">'+ optDOM +'</select>';
                    if(item.relationCode !== '21') {
                        var valDOM = '';
                        if(item.relationCode === '14') {
                            valDOM = '<input type="text" class="s-rule-value s-rule-value-2 s-input-def" value="'+ item.relationValue.split(',')[0] +'"> - ' +
                                '<input type="text" class="s-rule-value s-rule-value-2 s-input-def" value="'+ item.relationValue.split(',')[1] +'">'
                        } else {
                            valDOM = '<input type="text" class="s-rule-value s-input-def" value="'+ item.relationValue +'">'
                        }
                        tr += '<tr class="s-rule-row s-rule-'+ index +'">' +
                            '<td class="s-add-row">'+ selectDOM +'</td>' +
                            '<td class="s-rule-val">'+ valDOM +'</td>' +
                            '<td><a class="s-delBtn-rule" data-num="'+ index +'">-</a></td>' +
                            '</tr>';
                        obj['rule'+index] = item.relationCode
                    } else {
                        form.val("rule-content",{
                            "isEmpty":"21"
                        });
                    }
                });
                $(".s-add-rule").append(tr);
                // form.render();
                form.val("rule-content",obj);
                form.render();
                for(var i=0;i<res.data.list.length-1;i++) {
                    var k = i;
                    form.on('select(rule)', function(data){
                        var k = data.elem.getAttribute("data-num");
                        if(data.value === '14') {
                            $(".s-rule-" + k + " .s-rule-val").html('<input type="text" class="s-rule-value s-rule-value-2 s-input-def"> - <input type="text" class="s-rule-value s-rule-value-2 s-input-def">');
                        } else {
                            $(".s-rule-" + k + " .s-rule-val").html('<input type="text" class="s-rule-value s-input-def">');
                        }
                    });
                }
            }
        }
    });
    // 规则类型切换 清空参数 与 初始化视图
    form.on('radio(rule)',function (data) {
        $(".s-rule-item").removeClass("s-show");
        $(".s-rule-item").eq(data.value - 1).addClass("s-show");
        params.type = data.value;
        form.val("rule-content", {
            "rule-type-0": 1
        });
        form.render('select');
        $(".s-rule-addRow").remove();
        if(data.value === '1') {
            params.ltShmValidateRule = [{relationCode:1}];
        } else {
            params.ltShmValidateRule = [];
        }
    });
    form.on('select(rule-type-0)',function (data) {
        if(data.value === '') {
            params.ltShmValidateRule = [];
        } else {
            params.ltShmValidateRule = [{relationCode:data.value}];
        }
    });
    form.on('checkbox(isEmpty)',function (data) {
        if(data.elem.checked) {
            isEmpty = 21
        } else {
            isEmpty = null
        }
    });

    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    //add 自定义规则
    $(".s-addBtn-rule").on("click",function () {
        var selectDOM = '<select class="rule" data-num="'+ n +'" name="rule'+ n +'" lay-filter="rule">'+ optDOM +'</select>';
        $(".s-add-rule").append('<tr class="s-rule-row s-rule-addRow s-rule-'+ n +'">' +
            '<td class="s-add-row">'+ selectDOM +'</td>' +
            '<td class="s-rule-val"><input type="text" class="s-rule-value s-input-def"></td>' +
            '<td><a class="s-delBtn-rule" data-num="'+ n +'">-</a></td>' +
            '</tr>');
        form.render();
        n = n + 1;
        for(var i=0;i<n;i++) {
            var k = i;
            form.on('select(rule)', function(data){
                var k = data.elem.getAttribute("data-num");
                if(data.value == '14') {
                    $(".s-rule-" + k + " .s-rule-val").html('<input type="text" class="s-rule-value s-rule-value-2 s-input-def"> - <input type="text" class="s-rule-value s-rule-value-2 s-input-def">');
                } else {
                    $(".s-rule-" + k + " .s-rule-val").html('<input type="text" class="s-rule-value s-input-def">');
                }
            });
        }
    });

    //del规则
    $("body").on("click",'.s-delBtn-rule',function () {
        var i = $(this).data("num");
        $(".s-rule-" + i).remove();
    });

    //提交
    $(".s-alert-send").on('click',function () {
        if(params.type === 1 || params.type === '1') {

        } else {
            params.ltShmValidateRule = [];
            $(".s-rule-row").each(function () {
                var item = {},arr = [];
                item.relationCode = $(this).find(".rule").val();
                $(this).find(".s-rule-value").each(function () {
                    arr.push($(this).val());
                });
                if(arr.length !== 0) {
                    item.relationValue = arr.join();
                } else {
                    item.relationValue = ''
                }
                params.ltShmValidateRule.push(item);
            });

            if(isEmpty === 21) {
                params.ltShmValidateRule.push({relationCode:21})
            }
        }
        var ver = true;
        // if(params.ltShmValidateRule.length === 0) {
        //     ver = false
        //     layer.msg('请添加规则');
        //     return false
        // }
        params.ltShmValidateRule.forEach(function (item) {
            if(item.relationValue === '') {
                layer.msg('字段不能为空');
                ver = false
                return false
            }
        })
        if(ver) {
            $.ajax({
                type:'POST',
                url:'/shmTemplatebaseinfo/checkShmDataitem',
                headers:{
                    'Content-Type':'application/json;charset=utf8'
                },
                data:JSON.stringify(params),
                success:function (res) {
                    if(res.code === 10001) {
                        parent.layer.msg(res.msg);
                        parent.window.reloadTable();
                        parent.layer.close(index);
                    } else {
                        parent.layer.msg(res.msg);
                    }
                }
            });
        }
    });
    //关闭弹出层
    $(".s-alert-close").on('click',function () {
        parent.layer.close(index);
    });
});