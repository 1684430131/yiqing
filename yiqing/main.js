
let allData = {};
let allCount = 0;
let cc2 = 0;
let cc3 = 0;
getEpidemicSituationJson().then(data => {
    let { newslist } = data;
    /**
     * 渲染到右侧列表
     */
    document.getElementById('selectMain').innerHTML = ``;
    newslist.map(list => {
        allCount += list.confirmedCount
        cc2 += list.curedCount;
        cc3 += list.deadCount
        allData[list.provinceShortName] = {
            list
        }
        let isNone = ``;
        if (list.cities.length == 0) {
            isNone = "style='display:none'"
        }
        let html = ` 
        <div class="selectProvinceItem">
        <div class="selectHeader2">
        <div class="sence1 " value=${list.provinceShortName} >${list.provinceShortName}
            <div class="jiantou" ${isNone}></div>
        </div>
        <div class="leijiquezheng background1">${list.confirmedCount}</div>
        <div class="leijiquezhengzhiyu background1">${list.curedCount}</div>
        <div class="leijisiwang background1">${list.deadCount}</div>
        </div>
        <div class="city" style="display:none">`


        list.cities.map(cities => {

            cities.allCount = list.confirmedCount
            allData[cities.cityName] = {
                cities
            }
            html += `
           <div class="selectHeader3">
           <div class="sence2" value2="${list.provinceShortName}" value=${cities.cityName}>${cities.cityName}</div>
           <div class="leijiquezheng background1">${cities.confirmedCount}</div>
           <div class="leijiquezhengzhiyu background1">${cities.curedCount}</div>
           <div class="leijisiwang background1">${cities.deadCount}</div>
           </div>
           `
        })
        html += `</div>
        </div>`;
        document.getElementById('selectMain').innerHTML += html;
        document.getElementById("cc1").innerHTML = allCount;
        document.getElementById("cc2").innerHTML = cc2;
        document.getElementById("cc3").innerHTML = cc3;

    })

    /**
     * 省点击
     */
    for (let i = 0; i < document.getElementsByClassName("sence1").length; i++) {
        document.getElementsByClassName("sence1")[i].addEventListener("click", function () {
            setData(this.getAttribute("value"))
           

            /**
             * 隐藏字体
             */
            if(selectTextProvince){
                selectTextProvince.show=false;
            }
            provinceText[this.getAttribute("value")].show=false;
            selectTextProvince= provinceText[this.getAttribute("value")];


            /**
             * 城市字体
             */

            if(selectTextCities){
                for(let i=0;i<selectTextCities.length;i++){
                    selectTextCities[i].show=false;
                }
            }
            selectTextCities=citiesText[this.getAttribute("value")];
            for(let i=0;i<selectTextCities.length;i++){
                selectTextCities[i].show=true;
            }


            if (document.getElementsByClassName("city")[i].style.display == "block") {
                document.getElementsByClassName("city")[i].style.display = "none";
                this.parentNode.getElementsByClassName('jiantou1')[0].className = "jiantou"

            } else {
                document.getElementsByClassName("city")[i].style.display = "block";
                this.parentNode.getElementsByClassName('jiantou')[0].className = "jiantou1"
                let value = this.getAttribute("value");
                /** 
                 * changeView
                */
                if (name == "西藏") {
                    let gotoCenterData = centerData["西藏自治区"];
                    setfly(gotoCenterData[0], gotoCenterData[1], 1000, value);
                    return;
                }
                if (name == "新疆") {
                    let gotoCenterData = centerData["新疆维吾尔自治区"];
                    setfly(gotoCenterData[0], gotoCenterData[1], 1000, value);
                    return;
                }
                if (name == "北京") {
                    let gotoCenterData = centerData["北京市"];
                    setfly(gotoCenterData[0], gotoCenterData[1], 1000, value);
                    return;
                }
                if (name == "内蒙古") {
                    let gotoCenterData = centerData["内蒙古自治区"];
                    setfly(gotoCenterData[0], gotoCenterData[1], 1000, value);
                    return;
                }
                if (centerData[value]) {
                    let gotoCenterData = centerData[this.getAttribute("value")];
                    setfly(gotoCenterData[0], gotoCenterData[1], 1000, value);
                } else if (centerData[value + "省"]) {
                    let gotoCenterData = centerData[value + "省"];
                    setfly(gotoCenterData[0], gotoCenterData[1], 1000, value);;
                } else {
                }
            }
        })
    }



    /**
     * 市区点击
     */
    for (let i = 0; i < document.getElementsByClassName("sence2").length; i++) {
        document.getElementsByClassName("sence2")[i].addEventListener("click", function () {
            setData(this.getAttribute("value"))

            /** 
             * changeView
            */
            if (centerData[this.getAttribute("value")]) {
                let gotoCenterData = centerData[this.getAttribute("value")];
                setfly(gotoCenterData[0], gotoCenterData[1], 1000, this.getAttribute("value2"));
            } else if (centerData[this.getAttribute("value")] + "市") {
                let gotoCenterData = centerData[this.getAttribute("value") + "市"];
                setfly(gotoCenterData[0], gotoCenterData[1], 1000, this.getAttribute("value2"));;
            } else {
                console.log("未发现")
            }
        })
    }

})



document.getElementById('showSlectCont').addEventListener("click", function () {
    document.getElementById("yiqingxinwen").style.display = "none";
    if (document.getElementById("selectCounts").style.display == "none") {
        document.getElementById("selectCounts").style.display = "block";
        document.getElementById("showJiantou").className = "SHOWjIANTOU1"

    } else {
        document.getElementById("selectCounts").style.display = "none";
        document.getElementById("showJiantou").className = "SHOWjIANTOU"
    }
})

function createCanvas() {
    document.getElementById("c1").parentNode.removeChild(document.getElementById("c1"))
    document.getElementById("c2").parentNode.removeChild(document.getElementById("c2"))
    let canvas1 = document.createElement("canvas");
    canvas1.width = 350;
    canvas1.height = 300;
    canvas1.setAttribute("id", "c1")
    let canvas2 = document.createElement("canvas");
    canvas2.width = 350;
    canvas2.height = 300;
    canvas2.setAttribute("id", "c2")
    document.getElementById("canvas1").appendChild(canvas1);
    document.getElementById("canvas2").appendChild(canvas2);
}

function setCanvasByProvince(province) {
    /**
     * 设置疫情和全国占比
     */
    var myChart = echarts.init(document.getElementById('c1'));
    // 指定图表的配置项和数据
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#CD5C5C', '#00CED1', '#9ACD32', '#FFC0CB'],
        stillShowZeroSum: false,
        series: [
            {
                type: 'pie',
                radius: '80%',
                data: [
                    { value: allCount - province.confirmedCount, name: '其他省份' },
                    { value: province.confirmedCount, name: province.provinceShortName + "确诊数据" },

                ],
                itemStyle: {
                    normal: {
                        position: 'inner',
                        label: {
                            position: 'inner',
                            show: true,
                            formatter: '{b} : {c} ({d}%)'
                        },
                        labelLine: { show: true }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);


    let data = [];
    var xData = []
    var yData = [];
    province.cities.map(e => {
        xData.push(e.cityName)
        yData.push(e.confirmedCount)
    })

    var xzbjl = echarts.init(document.getElementById("c2"));
    option = {

        dataZoom: [
            {
                type: 'slider',
                show: true,
                start: 0,
                end: 30,
                xAxisIndex: [0],
            },
        ],
        toolbox: {
            show: true
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                //设置轴线的属性
                axisLine: {
                    lineStyle: {
                        color: '#6ab2ec',
                    }
                },
                //调整x轴的lable
                //                axisLabel:{   
                //                    textStyle:{
                //                        fontSize:10 // 让字体变小
                //                    },
                //                    rotate: 30,    // 字体倾斜30度
                //                },
                data: xData,
            }
        ],

        yAxis: [
            {
                type: 'value',
                // 控制网格线是否显示
                splitLine: {
                    show: true,
                    //  改变轴线颜色
                    lineStyle: {
                        // 使用深浅的间隔色
                        color: ['#132a6e']
                    }
                },
                //设置轴线的属性
                axisLine: {
                    lineStyle: {
                        color: '#6ab2ec',
                    }
                }
            }
        ],
        series: [
            {
                name: '数据一',
                type: 'bar',
                /* 柱子的显示宽度 */
                barWidth: '20%',
                data: yData,
                /* 显示柱子数据 */
                label: {
                    normal: {
                        show: true,
                        // 数据在柱子头部显示
                        position: 'top',
                        textStyle: {
                            color: '#5475c7',
                            fontSize: 16,
                        }
                    }
                },
            }

        ]
    };

    xzbjl.setOption(option);
}

function setCanvasByCity(city) {
    /**
       * 设置疫情和全省占比
       */
    var myChart = echarts.init(document.getElementById('c1'));
    // 指定图表的配置项和数据
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#CD5C5C', '#00CED1', '#9ACD32', '#FFC0CB'],
        stillShowZeroSum: false,
        series: [
            {
                type: 'pie',
                radius: '80%',
                data: [
                    { value: city.allCount - city.confirmedCount, name: '其他城市' },
                    { value: city.confirmedCount, name: city.cityName + "确诊数据" },

                ],
                itemStyle: {
                    normal: {
                        position: 'inner',
                        label: {
                            position: 'inner',
                            show: true,
                            formatter: '{b} : {c} ({d}%)'
                        },
                        labelLine: { show: true }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    var myChart = echarts.init(document.getElementById('c2'));
    // 指定图表的配置项和数据
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#CD5C5C', '#00CED1', '#9ACD32', '#FFC0CB'],
        stillShowZeroSum: false,
        series: [
            {
                type: 'pie',
                radius: '80%',
                data: [
                    { value: allCount, name: '全国疫情数据' },
                    { value: city.confirmedCount, name: city.cityName + "确诊数据" },

                ],
                itemStyle: {
                    normal: {
                        position: 'inner',
                        label: {
                            position: 'inner',
                            show: true,
                            formatter: '{b} : {c} ({d}%)'
                        },
                        labelLine: { show: true }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}


function setData(name) {
    document.getElementById('canvas1').style.display = "block";
    document.getElementById('canvas2').style.display = "block";
    let data = allData[name];
    /**
     * 判断是城市还是省份
     */
    createCanvas();
    if (data.list) {
        setCanvasByProvince(data.list);
        document.getElementById('t1').innerHTML = '全国疫情占比';
        document.getElementById("t2").innerHTML = `省内疫情详情`;
    } else {
        setCanvasByCity(data.cities);
        document.getElementById('t1').innerHTML = '全市疫情占比';
        document.getElementById("t2").innerHTML = `全球疫情占比`;
    }
}


document.getElementById("close2").addEventListener("click", function () {
    document.getElementById('canvas1').style.display = "none";
})

document.getElementById("close1").addEventListener("click", function () {
    document.getElementById('canvas2').style.display = "none";
})


let date = new Date();

var a = ["日", "一", "二", "三", "四", "五", "六"];
document.getElementById("date").innerHTML = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + "   星期" + a[date.getDay()]
setInterval(function () {
    let str = ``;
    let hour = new Date().getHours();
    if (hour < 10) {
        hour = "0" + hour;
    }
    let senconds = new Date().getSeconds();
    if (senconds < 10) {
        senconds = "0" + senconds;
    }
    let minues = new Date().getMinutes();
    if (minues < 10) {
        minues = "0" + minues;
    }
    document.getElementById("time").innerHTML = hour + ":" + minues + ":" + senconds
}, 1000)



/**
 * 获取新闻
 */
getMsg().then(data => {
    let { newslist } = data;
    let html = ``;
    newslist.map(e => {
        e.news.map(newsItem => {
            let timeStr = ``;
            createTime = newsItem.createTime
            timestr = (new Date(createTime).getMonth()) + "/" + new Date(createTime).getDate() + "   " + new Date(createTime).getHours() + ":" + new Date(createTime).getMinutes();;
            html += ` <div class="contentItem">
            
            <div class="timeLeft">
                <div class="circle"></div>
                <div class="time1">${newsItem.pubDateStr}</div>
                <div class="time2">${timestr}</div>
            </div>
            <div class="contentMain">
                <div class="CONTENTTITLE">${newsItem.title}</div>
                <div class="contentStr" onclick="window.open('${newsItem.sourceUrl}')">
                ${newsItem.summary}
                    </div>
            </div>
        </div>`;

        })
    })
    document.getElementById("contentStr").innerHTML = html;
})


document.getElementById('showMsg').addEventListener("click", function () {
    document.getElementById("selectCounts").style.display = "none";
    document.getElementById("yiqingxinwen").style.display = "block";
    document.getElementById("showJiantou").className = "SHOWjIANTOU"
})