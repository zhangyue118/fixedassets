$(function () {

    (function(targetWidth = 1920) {
        var isFox =
            navigator.userAgent.indexOf('Firefox') > -1 ? true : false;
        var style = document.createElement('style');
        style.innerHTML = `
        html {
          width:${targetWidth + 'px'};
          overflow: hidden;
          ${isFox ? `transform-origin: top left;` : ''}
        }
        body {
          width: 100%;
          height: 100%;
          margin: 0;
        }
        `;
        document.head.appendChild(style);

        let adjustWindow = () => {
            var ratio = window.innerWidth / targetWidth;
            var htmlHeight =
                (window.innerHeight * targetWidth) / window.innerWidth + 'px';

            document.documentElement.style.height = htmlHeight;
            if (isFox) {
                document.documentElement.style.transform = `scale(${ratio})`;
            } else {
                document.documentElement.style.zoom = ratio;
            }
            document.documentElement.setAttribute('data-ratio', ratio);
        };
        adjustWindow();
        window.addEventListener('resize', adjustWindow);
        // 使鼠标坐标一致
        var x_get = Object.getOwnPropertyDescriptor(MouseEvent.prototype, 'x')
            .get;
        var y_get = Object.getOwnPropertyDescriptor(MouseEvent.prototype, 'y')
            .get;
        Object.defineProperties(MouseEvent.prototype, {
            R: {
                get: function() {
                    return parseFloat(
                        document.documentElement.getAttribute('data-ratio')
                    );
                }
            },
            x: {
                get: function() {
                    return x_get.call(this) / this.R;
                }
            },
            y: {
                get: function() {
                    return y_get.call(this) / this.R;
                }
            }
        });
        if (isFox) {
            let getBoundingClientRect = Element.prototype.getBoundingClientRect;
            Element.prototype.getBoundingClientRect = function() {
                let value = getBoundingClientRect.call(this);
                let ratio = parseFloat(
                    document.documentElement.getAttribute('data-ratio')
                );
                value = new Proxy(value, {
                    get: function(target, proper) {
                        return Reflect.get(target, proper) / ratio;
                    }
                });
                return value;
            };
        }
    })();

});
var methods = {
    liquidFill:function (params) {
        var chart = echarts.init(document.getElementById(params.el));
        var option = {
            series: [{
                type: 'liquidFill',
                radius: '80%',
                outline: {
                    show: false , //是否显示轮廓 布尔值
                },
                backgroundStyle: {
                    color:'rgba(0,0,0,0)',//图表的背景颜色
                },
                data: [{
                    value: params.val,
                    direction: 'left',
                    itemStyle: {
                        normal: {
                            color: params.color.left
                        }
                    }
                },{
                    value: params.val,
                    direction: 'right',
                    itemStyle: {
                        normal: {
                            color: params.color.right
                        }
                    }
                }],
                label: {
                    normal: {
                        formatter: params.amount,
                        textStyle: {
                            color: '#ffffff',
                            fontSize:18
                        }
                    }
                }
            }]
        };
        chart.setOption(option);
    },
};
$(document).ready(function () {

    //外部数据量
    $.get('/shmData/getGovData', function (res) {
        if (res.code === 10001) {
            var datas = new Array();
            res.data.forEach(function (item, index) {
                var data = {value: (Number(item.qty) / 10000).toFixed(2), name: item.name};
                if(datas.length<=4){
                    datas.push(data);
                }

            })
        }
    //环形图
    var chart = echarts.init(document.getElementById('otherData'));
    var option = {
        color: ['#8798fe', '#58caff', '#fc7a7a', '#7df8df', '#58caff'],
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: true,
                label: {
                    normal: {
                        formatter: "{c|{c}}\n{b|{b}}",
                        fontSize: 16,
                        rich: {
                            c: {
                                color: '#9eff02',
                                fontSize: 15,
                                lineHeight: 22,
                                align: 'center'
                            },
                            b: {
                                color: '#21e8ff',
                                fontSize: 13,
                                lineHeight: 16,
                                align: 'center'
                            }
                        }
                    }
                },

                labelLine: {
                    normal: {
                        length:20,
                        lineStyle: {
                            type: "dotted"  // 改变标示线的颜色
                        }
                    }
                },
                data: datas
            }
        ]
    };
    chart.setOption(option);
    });
});
//折线图
function resultCharts(params) {
    var resultCharts = echarts.init(document.getElementById('nearData'));
    var dataAxis =params.dataAxis,
        data = params.data;
    var option2 = {
        grid: {
            top: 15,
            bottom: 30,
            left: 50,
            right: 30
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{c}',
            backgroundColor: 'rgba(0,228,255,0.1)',
            borderColor: '#00e4ff',
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
            borderWidth: 1,
            axisPointer: {
                lineStyle: {
                    color: '#ed136b'
                }
            },
            textStyle: {
                color: '#fff'
            }
        },

        xAxis: {
            type: 'category',
            boundaryGap: false,
            triggerEvent: true,
            splitLine: {//网格线
                show: true,
                lineStyle: {
                    color: '#11518d',
                    type: 'dashed'
                }
            },
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#0d91c1',//左边线的颜色
                    width: '1'//坐标线的宽度
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#21e8ff',//坐标值得具体的颜色

                }
            },
            data: dataAxis
        },
        yAxis: {
            type: 'value',
            boundaryGap: false,
            splitLine: {//网格线
                show: true,
                lineStyle: {
                    color: '#11518d',
                    type: 'dashed'
                }
            },
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#0d91c1',//左边线的颜色
                    width: '1'//坐标线的宽度
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#21e8ff',//坐标值得具体的颜色

                }
            },
        },
        series: [{
            data: data,
            type: 'line',
            symbol: 'circle',
            hoverAnimation: false,
            symbolSize: 8,
            markLine: {
                lineStyle:{
                    color: 'white',
                    type: 'solid',
                    shadowColor: 'rgba(237,19,107,0.3)',
                    shadowBlur: 10
                },
                data: [
                    {type: 'average', name: '平均值'}
                ]
            },
            itemStyle: {
                normal: {
                    color: "#ed136b",
                    borderColor: 'rgba(237,19,107,0.3)',
                    borderWidth: 6,
                    lineStyle: {
                        width: 1,//折线宽度
                        color: "#ed136b"//折线颜色
                    }
                },
                emphasis: {
                    borderColor: 'rgba(237,19,107,0.5)',
                    borderWidth: 12,
                }
            },
        }]
    };
    resultCharts.setOption(option2);
}