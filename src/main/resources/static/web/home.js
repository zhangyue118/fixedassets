function resultChart(params) {
    var myChart = echarts.init(document.getElementById(params.el));
    // 指定图表的配置项和数据
    var dataAxis = params.dataAxis,
        data = params.data;

    var zr = myChart.getZrender()
    var option = {
        // backgroundColor:"red",
        grid:{
            x:"10%",
            x2:"7%",
            y:"10%",
            y2:"15%",
            borderColor:"#ededed",
        },
        tooltip : {
            trigger: 'axis',
            formatter:function (params,ticket,callback) {
                var res = params[0].name;
                for (var i = 0, l = params.length; i < l; i++) {
                    res += params[i].seriesName + "</br>" + params[i].value;
                }
                setTimeout(function (){
                    // 仅为了模拟异步回调
                    callback(ticket, res);
                }, 100)

                // callback(ticket, res);
                return 'loading...';
            }
        },
        legend: {
            // data:['最高气温','最低气温']
            data:["最低气温"],
            show:false
        },
        toolbox: {
            // show : false,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            },
            backgroundColor:"rbga(255,255,255,.8)"
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                // boundaryGap : false,
                data :dataAxis,
                color:"#ededed",
                axisLabel:{
                    color:"#d8dbe7",
                    normal:{
                        color:"#ededed"
                    }
                },
                textStyle:{
                    normal:{
                        color:"red"
                    }
                },
                borderColor:"#ededed",
                splitLine:{
                    lineStyle:{
                        color:"#ededed",
                        width:1,
                        type:"dashed"
                    }
                },
                axisLine:{
                    lineStyle:{
                        color:"#d8dbe7",
                    }
                },
                axisTick:{
                    show:false
                }

            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    color:"#d8dbe7",
                    formatter: '{value}'
                },
                borderColor:"#ededed",
                splitLine:{
                    lineStyle:{
                        color:"#ededed",
                        width:1,
                        type:"dashed"

                    }
                },
                axisLine:{
                    lineStyle:{
                        color:"#d8dbe7"
                    }
                }
            }
        ],
        series : [
            {
                name:'',
                type:'line',
                data:data,
                itemStyle:{
                    normal:{
                        color:"#00bbee",//改变线上小球颜色
                        lineStyle:{
                            color:"#f687b4", // 修改图上线条颜色
                            width:4,
                            shadowColor : 'rgba(246,135,180,0.6)',
                            shadowBlur: 10,
                            shadowOffsetX: 8,
                            shadowOffsetY: 4
                        },
                    }
                },
                smooth:20
            }
        ]
    };

    myChart.setOption(option);
}
//数据总量
$.get('/shmData/getTotalDataTime',function (res) {
    if(res.code === 10001) {
        $(".data-all ul li p").eq(0).html(Number(res.data[0].currentYear)/10000);
        $(".data-all ul li p").eq(1).html(Number(res.data[0].currentQuarter)/10000);
        $(".data-all ul li p").eq(2).html(Number(res.data[0].currentMonth)/10000);
    }
});
//数据分类
$.get('/shmData/getDataClassificationTemplateCategory',function (res) {
    if(res.code === 10001) {
        res.data.forEach(function (item,index) {
            if(item.type_name === '人员类') {
                $(".data-gate ul li p").eq(0).html(Number(item.sum)/10000)
            } else if(item.type_name === '物品类') {
                $(".data-gate ul li p").eq(1).html(Number(item.sum)/10000)
            } else if(item.type_name === '轨迹类') {
                $(".data-gate ul li p").eq(2).html(Number(item.sum)/10000)
            }
        })
    }
});
//数据量排名
$.get('/shmData/getDataVolumeRankingTemplate',function (res) {
    if(res.code === 10001) {
        res.data.forEach(function (item,index) {
            $(".data-sort li span").eq(index).html(item.name);
            $(".data-sort li b").eq(index).html(Number(item.sum)/10000)
        })
    }
});
//外部数据量
$.get('/shmData/getGovData',function (res) {
    if(res.code === 10001) {
        res.data.forEach(function (item,index) {
            $(".chart-item ul li p").eq(index).html(item.name);
            $(".chart-item ul li span").eq(index).html(Number(item.qty)/10000)
        })
    }
});
//认证合一
$.get('/shmData/getRzhy',function (res) {
    if(res.code === 10001) {
        $(".rz-item .time-item label p").eq(0).html(Number(res.data.currentYear)/10000);
        $(".rz-item .time-item label p").eq(1).html(Number(res.data.currentQuarter)/10000);
        $(".rz-item .time-item label p").eq(2).html(Number(res.data.currentMonth)/10000);
        res.data.ltDept.forEach(function (item,index) {
            $(".td-name").eq(index).html(item.deptname)
            $(".td-amount").eq(index).html(Number(item.qty)/10000)
        })
    }
});
//单位排名
$.get('/shmData/getUnitRankingCategory',function (res) {
    if(res.code === 10001) {
        var li_A = '',li_B = '',li_C = '',li_D='';
        var numA=0,numB=0,numC=0,numD=0;
        res.data.forEach(function (item) {
            if(item.category === 'A类'&&numA<5) {
                li_A += '<p>'+ item.name +'<span>'+ Number(item.sum/10000) +'</span></p>';
                numA++;
            } else if(item.category === 'B类'&&numB<5) {
                li_B += '<p>'+ item.name +'<span>'+ Number(item.sum/10000) +'</span></p>';
                numB++;
            } else if(item.category === 'C类'&&numC<5) {
                li_C += '<p>'+ item.name +'<span>'+ Number(item.sum/10000) +'</span></p>';
                numC++;
            } else if(item.category === '未分类'&&numD<5) {
                li_D += '<p>'+ item.name +'<span>'+ Number(item.sum/10000) +'</span></p>';
                numD++;
            }
        });
        $(".dept-item ul li div").eq(0).html(li_A);
        $(".dept-item ul li div").eq(1).html(li_B);
        $(".dept-item ul li div").eq(2).html(li_C);
        $(".dept-item ul li div").eq(3).html(li_D);
    }
});
