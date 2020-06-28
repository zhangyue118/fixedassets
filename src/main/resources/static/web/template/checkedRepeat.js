layui.use(['form','table','layer'],function () {
    var form = layui.form,
        layer = layui.layer,
        id = $("body").data("id"),
        li = '',checkedLi = '';

    $.post('/shmTemplatebaseinfo/getDuplicateFactor',{id:id},function (res) {
        if(res.code === 10001) {
            var l = res.data.ltShmTemplatedataitemDto.length;
            res.data.ltShmTemplatedataitemDto.forEach(function (item) {
                var checked = '';
                if(item.checked) {
                    checked = 'checked="'+ item.checked +'"';
                }
                li += '<li>' +
                    '<input type="checkbox" lay-filter="rule-'+ item.id +'"' +
                    ' class="rule-'+ item.id +'" name="rule-'+ item.id +'" ' +
                    'title="'+ item.name +'" value="'+ item.id +'" lay-skin="primary"' + checked +'>' +
                    '</li>'
            });
            $(".s-repeat-data ul").append(li);
            form.render();
            res.data.ltShmTemplatedataitemDto.forEach(function (item) {
                form.on('checkbox(rule-'+ item.id +')', function(data){
                    if(data.elem.checked) {
                        $(".s-repeat-choose ul").prepend('<li class="s-checkedLi-'+ item.id +'">' +
                            '<a id="'+ item.id +'"><img src="../../images/icon-del.png"></a>' +
                            '<span>'+ item.name +'</span></li>');
                    } else {
                        $(".s-checkedLi-"+data.value).remove();
                    }
                });
            });
            res.data.templatedataitemCheckeds.forEach(function (item) {
                checkedLi += '<li class="s-checkedLi-'+ item.id +'"><a id="'+ item.id +'"><img src="../../images/icon-del.png"></a><span>'+ item.name +'</span></li>'
            });
            $(".s-repeat-choose ul").append(checkedLi);
            $("body").on("click",".s-repeat-choose ul li a",function () {
                var id = $(this).attr("id");
                $(".s-checkedLi-"+id).remove();
                $(".rule-"+id).removeAttr("checked");
                form.render();
            })
        }
    });
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引

    //提交
    $(".s-alert-send").on('click',function () {
        var arr = [];
        $(".s-repeat-choose li a").each(function () {
            arr.push($(this).attr("id"))
        });
        $.ajax({
            type:'POST',
            url:'/shmTemplatebaseinfo/saveDuplicateFactors',
            data:{
                templateId:id,
                ids:arr.join()
            },
            success:function (res) {
                if(res.code === 10001) {
                    parent.layer.msg(res.msg);
                    parent.layer.close(index);
                } else {
                    parent.layer.msg(res.msg);
                }
            }
        });
    });
    //关闭弹出层
    $(".s-alert-close").on('click',function () {
        parent.layer.close(index);
    });
});