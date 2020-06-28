layui.use(['layer'],function () {
    var layer = layui.layer,
        index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引;
    //上传文件
    var uploader = WebUploader.create({
        // swf文件路径
        swf: '/js/webuploader/Uploader.swf',
        // 文件接收服务端。
        server:'/shmTask/fileUpload',
        pick: '#picker',
        accept:{
            extensions: 'xls,xlsx', // 允许的文件后缀，不带点，多个用逗号分割，这里支持老版的Excel和新版的
            mimeTypes: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });
    uploader.on( 'beforeFileQueued', function( file ) {
        if(file.ext.toLowerCase() === 'xls' || file.ext.toLowerCase() === 'xlsx') {
            var l = uploader.getFiles().length;
            if(l === 6) {
                layer.alert('最多同时上传6个文件', {
                    icon :2,
                    shift : 6
                });
                return false
            }
        } else {
            layer.alert('请选择正确格式的文件', {
                icon :2,
                shift : 6
            });
            return false
        }
    });
    uploader.on( 'fileQueued', function( file ) {
        var li = '<li>' +
            '<img src="../../images/icon-xls.png">' +
            '<p>'+ file.name +'</p>' +
            '<a id="'+ file.id +'"><img src="../../images/icon-del.png"></a>' +
            '</li>';
        $(".s-file-list").append(li)
    });
//设置请求头 兼容ie8
    var setHeader = function(object, data, headers) {
        headers['Access-Control-Allow-Origin'] = '*';
        headers['Access-Control-Request-Headers'] = 'content-type';
        headers['Access-Control-Request-Method'] = 'POST';
    };
    uploader.on('uploadBeforeSend ', setHeader);

    uploader.on( 'uploadSuccess', function( file ) {
        layer.closeAll('loading');
        parent.layer.msg('上传成功');
        setTimeout(function () {
            parent.location.reload();
            parent.layer.close(index);
        },1000)
    });

    uploader.on( 'uploadError', function(obj,code) {
        layer.closeAll('loading');
        parent.layer.msg('上传失败')
    });
    $("body").on('click','.s-file-list a',function () {
        var id = $(this).attr("id");
        uploader.removeFile(uploader.getFile(id),true);
        $(this).parent().remove();
    });
    //关闭当前
    $(".s-alert-close").on('click',function () {
        parent.layer.close(index);
    });
    //提交上传
    $("#updateBtn").on('click',function () {
        var l = uploader.getFiles().length;
        if(l === 0) {
            layer.alert('请选择上传的文件', {
                icon :2,
                shift : 6
            });
        } else {
            layer.load(2);
            if($.browser.version === '8.0' || $.browser.version === '9.0') {
                uploader.upload();
            } else {
                var formData = new FormData();
                uploader.getFiles().forEach(function (item) {
                    formData.append('file', item.source.source);
                });
                $.ajax({
                    url : "/shmTask/fileUpload",
                    type : "POST",
                    data :formData,
                    contentType : false,
                    processData : false,
                    success : function(res) {
                        layer.closeAll('loading');
                        parent.layer.msg(res.msg);
                        if(res.code === 10001) {
                            setTimeout(function () {
                                parent.location.reload();
                                parent.layer.close(index);
                            },1000)
                        }
                    }
                });
            }

        }

    });
});
