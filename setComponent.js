//在三个div元素中使用echarts初始化内容
//为ECharts准备一个具备大小（宽高）的Dom
var chartDom = [document.getElementById('rightTop'), document.getElementById('leftBot'),
document.getElementById('rightBot')];
var myChart = [echarts.init(chartDom[0]), echarts.init(chartDom[1]), echarts.init(chartDom[2])];
var option = [{}, {}, {}];

let zoneData = [
    ['A', 0],
    ['B', 0],
    ['C', 0],
    ['D', 0]
];
let zoneID = 'A',
    staticDataObj = null,
    dDataObj = null;

let appCount = 11;

option[0] = {
    title: {
        text: 'A',
        subtext: '区域人数'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#283b56'
            }
        }
    },
    grid: {
        top: '25%',
        bottom: '15%',
        left: '10%',
        right: '40%'
    },
    legend: {
        selected: {
            '合计': true

        },
        data: ['合计', '男生', '女生']
    },
    toolbox: {
        show: true,
        feature: {
            dataView: { readOnly: true },
            saveAsImage: {}
        }
    },
    dataZoom: {
        show: false,
        start: 0,
        end: 100
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: true,
            data: (function () {
                var now = new Date();
                var res = [];
                var len = 10;
                while (len--) {
                    res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                    now = new Date(now - 2000);
                }
                return res;
            })()
        },
        {
            type: 'category',
            boundaryGap: true,
            data: (function () {
                var res = [];
                var len = 10;
                while (len--) {
                    res.push(10 - len - 1);
                }
                return res;
            })()
        }
    ],
    yAxis: [
        {
            type: 'value',
            scale: true,
            name: '承载量%',
            max: 100,
            min: 0,
            boundaryGap: [0.2, 0.2]
        },
        {
            type: 'value',
            scale: true,
            name: '人数',
            max: 0, //根据区域变化
            min: 0,
            boundaryGap: [0.2, 0.2]
        }
    ],
    series: [

        {
            name: '合计',
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: clearQueue()
        },
        {
            name: '男生',
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: clearQueue()
        },
        {
            name: '女生',
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: clearQueue()
        },
        {
            type: 'pie',

            radius: '30%',
            center: ['85%', '25%'],
            //  emphasis: { focus: 'data' },
            label: {
                formatter: '{b}: {@[0]} ({d}%)'
            },
            itemStyle: {
                normal: {
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            data: [
                {
                    value: 0,
                    name: '男',
                    itemStyle: {
                        color: 'rgba(120, 244, 155, 1)'
                    }
                },
                {
                    value: 0,
                    name: '女',
                    itemStyle: {
                        color: 'rgba(252, 255, 95, 1)'
                    }
                }
            ]
        },
        {

            type: 'gauge',
            radius: '60%',
            center: ['85%', '80%'],
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 1,
            splitNumber: 8,
            itemStyle: {
                normal: {
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            axisLine: {
                lineStyle: {
                    width: 6,
                    color: [
                        [0.25, '#7CFFB2'],
                        [0.5, '#58D9F9'],
                        [0.75, '#FDDD60'],
                        [1, '#FF6E76']
                    ]
                }
            },
            pointer: {
                icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                length: '12%',
                width: 20,
                offsetCenter: [0, '-60%'],
                itemStyle: {
                    color: 'auto'
                }
            },
            axisTick: {
                length: 12,
                lineStyle: {
                    color: 'auto',
                    width: 2
                }
            },
            splitLine: {
                length: 20,
                lineStyle: {
                    color: 'auto',
                    width: 5
                }
            },
            axisLabel: {
                color: '#464646',
                fontSize: 20,
                distance: -90,
                formatter: function (value) {

                }
            },
            title: {
                offsetCenter: [0, '-20%'],
                fontSize: 30
            },
            detail: {
                fontSize: 40,
                offsetCenter: [0, '0%'],
                valueAnimation: true,
                formatter: function (value) {
                    return Math.round(value * 100) + '%';
                },
                color: 'auto'
            },
            data: [{
                value: 0.000,

            }
            ]
        }
    ]
};



if (option[0] && typeof option[0] === 'object') {
    myChart[0].setOption(option[0]);
}
//折线图

option[1] = {

    title: {
        text: '逐小时人数变化',
        subtext: 'localDate',
    },
    xAxis: {
        type: 'category',
        axisTick: {
            alignWithLabel: true,
            show: true
        },
        axisLabel: {
            formatter: '{value}时'
        },
        data: []
    },
    yAxis: {
        type: 'value'
    },
    legend: {
        data: ['总人数']
    },
    toolbox: {
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            dataView: { readOnly: true },
            magicType: { type: ['line', 'bar'] },
            saveAsImage: {}
        }
    },
    dataZoom: [
        {
            type: 'slider',
            xAxisIndex: 0,
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            xAxisIndex: 0,
            start: 0,
            end: 100
        },
        {
            type: 'slider',
            yAxisIndex: 0,
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            yAxisIndex: 0,
            start: 0,
            end: 100
        }
    ],
    series: [{
        name: '总人数',
        data: [],
        type: 'line',
       
      /*  markLine: {
            data: [
                { type: 'average', name: '平均值' }
            ]
        }
    */  
    }],
    tooltip: {
        trigger: 'axis'
    }
};
if (option[1] && typeof option[1] === 'object') {
    myChart[1].setOption(option[1]);
}
option[2] = {
    title: {
        text: '总人数分布'
    },

    legend: {},
    tooltip: {},
    dataset: {

        dimensions: ['zone', 'total'],
        source: zoneData
    },
    grid: {
        right: '55%'
    },
    xAxis: { type: 'category' },
    yAxis: {},
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
        {
            type: 'bar',
            name: 'total',
            itemStyle: {
                color: "rgba(145, 136, 136, 1)",
                borderColor: "rgba(7, 7, 7, 1)",
                borderType: "solid"
            }

        },


        {
            name: '人数分布',
            type: 'pie',
            radius: '55%',
            center: ['75%', '50%'],
            emphasis: { focus: 'data' },
            label: {
                formatter: '{b}: {@total} ({d}%)'
            },
            roseType: 'angle',

            itemStyle: {
                normal: {
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

if (option[2] && typeof option[2] === 'object') {
    myChart[2].setOption(option[2]);
}



function clearQueue() {
    const res = [];
    let len = 10;
    while (len--) {
        res.push(0);
    }
    return res;
}
const rz = document.forms['myForm']['radioZone'];
//jQuery选取事件
$(document).ready(function () {
    $("input[type='radio'][name='radioZone']").change(function () {
        zoneID = rz.value;
          
        option[0].series[0].data=clearQueue();
        option[0].series[1].data=clearQueue();
        option[0].series[2].data=clearQueue();
    });
});


function setDData(zoneID, axisData, nan, nv, ceiling) {
    
    option[0].title.text = zoneID;

    var data0 = option[0].series[0].data;
    var data1 = option[0].series[1].data;
    var data2 = option[0].series[2].data;
    var data3 = option[0].series[3].data;

    var heji = nan + nv;

    data0.shift();
    data0.push(heji);
    data1.shift();
    data1.push(nan);
    data2.shift();
    data2.push(nv);
    data3[0].value = nan;
    data3[1].value = nv;

    option[0].yAxis[1].max = ceiling;
    option[0].series[4].data[0].value = (heji / parseFloat(ceiling)).toFixed(3);

    option[0].xAxis[0].data.shift();
    option[0].xAxis[0].data.push(axisData);
    option[0].xAxis[1].data.shift();
    option[0].xAxis[1].data.push(appCount++);

    myChart[0].setOption(option[0]);
}
function getStaticData() {
    fetch('getStaticData.php')
        .then((response) => {
            if (response.status === 200) {
                //console.log(response);
                response.text().then((data) => {
                    //将静态数据写入相应的ECharts元素
                    console.log(data);
                    staticDataObj = JSON.parse(data);
                    // 异步加载数据,填入数据
                    let xData=staticDataObj.record.time;
                    let yData=staticDataObj.record.number; 
                    console.log('OK');
                    if(staticDataObj.predictTime!=-1){
                        xData=xData.concat([staticDataObj.predictTime.toString()]);
                        console.log('OK');
                        yData=staticDataObj.record.number.concat([{
                            value:  staticDataObj.predictData,
                            itemStyle: {
                                color: '#a90000'
                            }
                        }]);
                        myChart[1].setOption({
                            series:[
                                {
                                    markPoint: {
                                        data: [
                                            {name:'预测值',value:'预测值',symbol:'pin',symbolSize:70,
                                                coord: [staticDataObj.predictTime.toString(), staticDataObj.predictData.toString()]},
                                            { type: 'max', name: '最大值' },
                                            { type: 'min', name: '最小值' }
                                        ]
                                    }
                                }
                            ]

                        });
                    }

            
                    myChart[1].setOption({
                        title: {
                            subtext:staticDataObj.today
                        },
                        xAxis: {
                            data: xData
                        },
                        series: [{
                            // 根据名字对应到相应的系列
                            data:yData
                        }]
                    });

                });
            }
        });

}

//初始化加载和每隔1小时获取一次静态数据
window.onload = getStaticData();
window.setInterval(getStaticData, 3600000);



//设置server-sent event

if (typeof (EventSource) !== "undefined") {
    var source = new EventSource("getDynamicData.php");
    source.onerror = function () {
        if (source.readyState === EventSource.CLOSED) {
            document.getElementById("header").innerHTML = '<h1>Connection close ...</h1>';
        }
    };
    source.onmessage = function (event) {
        //source.readyState===EventSource.OPEN
        if (!event.data) {
            console.log('no massage!!!');
        }
        console.log(event.data);
        dDataObj = JSON.parse(event.data);
        setDData(zoneID, dDataObj.time,
            parseInt(dDataObj.zone[zoneID].m), parseInt(dDataObj.zone[zoneID].w),
            parseInt(staticDataObj.zone[zoneID]));
        for (let i = 0; i < zoneData.length; i++) {
            const index = zoneData[i][0];
            zoneData[i][1] = parseInt(dDataObj.zone[index].m) + parseInt(dDataObj.zone[index].w);
        }
        myChart[2].setOption({
            dataset: {
                source: zoneData
            },
        });
    };
}
else {
    document.getElementById("result").innerHTML = "抱歉，您的浏览器不支持 server-sent 事件 ...";
}

//使用canvas元素 
let drawing = document.getElementById("drawing");

let context = drawing.getContext("2d");
context.strokeStyle = "rgba(0,0,255,0.5)";
context.beginPath();
//绘制简单几何示意图
context.arc(100, 80, 20, -Math.PI / 2, Math.PI, true);
context.lineTo(80, 170);
context.arc(100, 170, 20, Math.PI, Math.PI / 2, true);
context.lineTo(430, 190);
context.arc(430, 170, 20, Math.PI / 2, 0, true);
context.lineTo(450, 80);
context.arc(430, 80, 20, 0, -Math.PI / 2, true);
context.lineTo(100, 60);

context.translate(265, 125);
context.moveTo(0, 0);
context.lineTo(-185, 0);
context.moveTo(0, 0);
context.lineTo(0, 65);
context.moveTo(0, 0);
context.lineTo(0, -65);
context.moveTo(-135, 0);
context.lineTo(-135, -65);

context.font = '14px Arial';
context.fillText('A', -175, -37);
context.fillText('B', 90, 0);
context.fillText('C', -60, -40);
context.fillText('D', -90, 40);
context.font = '20px Lucida Console'
context.fillText('示意图', 0, -105);

context.stroke();
