var main15 = {
    all:function(){
         if (!Array.prototype.forEach) {
               Array.prototype.forEach = function(callback/*, thisArg*/) {
                     var T, k;
                     if (this == null) {
                           throw new TypeError('this is null or not defined');
                         }
                     var O = Object(this);
                     var len = O.length >>> 0;
                     if (typeof callback !== 'function') {
                           throw new TypeError(callback + ' is not a function');
                         }
                     if (arguments.length > 1) {
                           T = arguments[1];
                         }
                     k = 0;
                     while (k < len) {
                           var kValue;
                           if (k in O) {
                                 kValue = O[k];
                                 callback.call(T, kValue, k, O);
                               }
                           k++;
                     }
               };
         }
         $.ajaxSetup({ cache: false });
    },
    allDom:function() {
        layui.use(['layer','laypage'],function () {
            var layer = layui.layer;
            var tips;
            $("body").on('mouseenter','.s-btn-table',function () {
                tips = layer.tips($(this).data('tips'), $(this), {
                    tips: [1,'#333333']
                });
            }).on('mouseleave','.s-btn-table',function () {
                layer.close(tips)
            });
        });
    },
    //外层主页
    index:function () {
        function setMainHeight(){
            if($(window).height() <= 700){
                $(".main").height(700)
                return false // 小于800就不改变高度了
            }
            var mainHeight = $(window).height() - $("#header").height() - 40
            $(".main").height(mainHeight)
        }
        setMainHeight();
        $(window).bind("resize", setMainHeight)
        var objtimer; // 一秒后切换向左向右图标
        var s = true;
        $(".s-slide-btn i").on("click",function(){
            $(".side-nav").toggleClass("side-nav-left");
            $(".s-content").toggleClass("s-content-auto");
            $(".s-slide-btn i").toggleClass("icondouble-arrow-left");
            $(".s-slide-btn i").toggleClass("icondouble-arrow-left1");
            if(s) {
                $(".side-nav").addClass("side-nav-hidden");
                s= false
            } else {
                s= true;
                objtimer = setTimeout(function(){
                    $(".side-nav").removeClass("side-nav-hidden");
                },600);
            }
        });
        //跳转我的通告
        $(".s-my-msg").on('click',function () {
            $("#indexContentIframe").attr('src','/shmMessage/getMyShmMessageList');
        });
        // 弹出修改密码的弹窗
        $(".s-update-pass").on('click',function () {
            layui.use('layer',function () {
                var layer = layui.layer;
                layerPass = layer.open({
                    type: 2,
                    title:'修改密码',
                    skin:'s-alert-data',
                    closeBtn:1, //不显示关闭按钮
                    area: ['480px','322px'],
                    content: ['/toPassword', 'no'], //iframe的url，no代表不显示滚动条
                });
            });
        });

        // 弹出部门变更的弹窗
        $(".s-update-dept").on('click',function () {
            layui.use('layer',function () {
                var layer = layui.layer;
                layerPass = layer.open({
                    type: 2,
                    title:'部门变更',
                    skin:'s-alert-data',
                    closeBtn:1, //不显示关闭按钮
                    area: ['480px','300px'],
                    content: ['/toUpdateDept', 'no'], //iframe的url，no代表不显示滚动条
                });
            });
        });

    },
    msgDet:function () {
        $(".msg-det-time span a").on('click',function () {
            $(".fontSize").removeClass("fontSize");
            $(this).addClass("fontSize");
            $("#msgDetails article").css("font-size",$(this).data("size")+"px")
        })
    },
    isStartLessThanEnd:function (start,end) {
        var v = new Date(start) - new Date(end);
        if(v > 0) {
            layer.alert('开始时间不能大于结束时间',{
                icon :2,
                shift : 6,
                skin:'s-del-title'
            });
            return false
        }
    },

    //常规多选树形结构
    moduleTree:function (treeDom,data,url,callBack) {
        //zTree 树形结构
        var zTreeObj;
        function showIconForTree(treeId, treeNode) {
            return treeNode.children === undefined || treeNode.children === null || treeNode.children.length === 0;
        };
        var setting = {
            async: {
                enable: true,
                type: "get",
                url: url,
                dataType:"json",
                autoParam:["id"]
            },
            view:{
                showIcon: showIconForTree
            },
            check: {
                enable: true,
                chkboxType: { "Y": "ps", "N": "ps" }
            },
            callback: callBack
        };
        var zNodes = data;
        zTreeObj = $.fn.zTree.init($("#"+treeDom), setting, zNodes);
        //----下拉树
        $("#deptId").on('click',function () {
            $(this).toggleClass("layui-form-selected")
        });
        $(".layui-anim").on('click',function () {
            return false
        });
    },

    //单选树形结构下拉 3 号
    selectTree3:function (treeDom,valDom,viewSelected,data,selectedId,ifAllCheck) {
        var checkboxType;
        if(ifAllCheck) {
            checkboxType = { "Y": "ps", "N": "ps" }
        } else {
            checkboxType = { "Y": "", "N": "" }
        }
        //zTree 树形结构
        var zTreeObj;
        function showIconForTree(treeId, treeNode) {
            return treeNode.children === undefined || treeNode.children === null || treeNode.children.length === 0;
        };
        var setting = {
            view:{
                showIcon: showIconForTree
            },
            check: {
                enable: true,
                chkboxType: checkboxType
            },
            callback: {
                beforeCheck : function(treeId, treeNode) {
                    var zTree = $.fn.zTree.getZTreeObj(treeDom);
                    if(!ifAllCheck) {
                        if(!treeNode.checked) {
                            zTree.checkAllNodes(false);
                        }
                        return true;
                    }
                },
                onCheck : function(e, treeId, treeNode) {
                    if(treeNode.checked) {
                        var node = zTree.getNodeByTId(treeNode.tId);
                        zTree.selectNode(node);
                        viewSelected(treeNode);
                    } else {
                        viewSelected({id:'',name:''});
                        zTree.cancelSelectedNode();
                    }
                },
                beforeClick : function(treeId, treeNode) {
                    if(treeNode.type !== '1') {
                        return false
                    }
                    if(!ifAllCheck) {
                        zTree.checkAllNodes(false);
                        return true;
                    }
                },
                onClick : function (e, treeId, treeNode) {
                    viewSelected(treeNode);
                    if(treeNode.type !== '1') {
                        return false
                    }
                    var nodes = zTree.getSelectedNodes();
                    zTree.checkNode(nodes[0], true, true);
                }
            }
        };
        var zNodes = data;
        zTreeObj = $.fn.zTree.init($("#"+treeDom), setting, zNodes);
        var zTree = $.fn.zTree.getZTreeObj(treeDom);
        if(selectedId !== undefined && selectedId !== '' &&  selectedId !== null) {
            var node = zTree.getNodeByParam("id", selectedId, null);
            zTree.checkNode( node, true );
        };
        //----下拉树
        $("#"+valDom).on('click',function () {
            $(".layui-form-select").not($(this)).removeClass("layui-form-selected");
            $(this).toggleClass("layui-form-selected")
        });
        $(".layui-anim").on('click',function () {
            return false
        });
    },

};
main15.all();
$(document).ready(function () {
    main15.all();
    main15.allDom();
});
