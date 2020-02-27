var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    }), //加载地图资源
    geocoder: false,                //是否显示地名查找控件
    sceneModePicker: false,         //是否显示投影方式控件
    navigationHelpButton: false,    //是否显示帮助信息控件
    baseLayerPicker: false,         //是否显示图层选择控件
    homeButton: false,              //是否显示Home按钮
    fullscreenButton: false,        //是否显示全屏按钮
    timeline: false,                 //时间轴控件
    animation: false,                //动画控件
});
viewer.cesiumWidget.creditContainer.style.display = "none";


/**
 * 记录加载的数据，一共多少个
 */
var allReadyNumber = 0;

/**
 * 存储数据,方便读取
 */
var allYqdata = {};


/**
 * 存模模型
 */
var provinceModel = {};


/**
 * 存储市区模型
 */
var citiesModel = {};

/**
 * 所有数据
 */
var allCount1 = 0;
/**
 * 跳转至中国
 */

 /**
  * 存放字体的容器省
  */
var provinceText={};


/**
 * 存放市区的容器
 */
var citiesText={};

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(112.89962404922358, 29.625361661644103, 3000000.0)
});



/**
 * 记录一共多少模型
 */
var allLen = 0;
/**
 * 获取疫情监测实时数据
 */
getEpidemicSituationJson().then(chineseData => {
    chineseData = chineseData.newslist;
    allLen += chineseData.length;

    /**
     * 遍历疫情省数据
     */
    chineseData.map(provinceData => {
        provinceData.cities.map(() => {
            allLen += 1
        })
    })

    /**
     * 定义计时器,判断是否加载完,加载完了,隐藏ui模块
     */

    chineseData.map(provinceData => {
        allCount1 += provinceData.confirmedCount
        allYqdata[provinceData.provinceShortName] = provinceData
        renderMapByProvinceData(provinceData);

        /**
         * 渲染市区模型,加载内存
         */
        let citiesModels = [];
        citiesModel[provinceData.provinceShortName] = []
        citiesText[provinceData.provinceShortName]=[]
        provinceData.cities.map(cities => {
            addNameAndNumberCity(cities.cityName,cities.confirmedCount,provinceData.provinceShortName)
            cities.allCount = provinceData.confirmedCount
            getBoundLineByProvinceName(cities.cityName).then(data => {
                allYqdata[cities.cityName] = cities;
                drawByArr1(data, cities.cityName, cities.confirmedCount, provinceData.provinceShortName);

            })

        })


    })

})




/**
 * 操作省的数据
 * @param {省疫情监测数据} provinceData 
 */
function renderMapByProvinceData(provinceData) {
    /**
     * 获省的名称
     */
    let { provinceName } = provinceData;
    let { provinceShortName } = provinceData




    /**
     * 获取省的确认疫情数据
     */
    let { confirmedCount } = provinceData;
    /**
    * 在地图上绘制文字和数量省份
    * 
    */
    addNameAndNumberProvince(provinceShortName, confirmedCount);
    /**
     * 获取省的疑似疫情数量
     */
    let { suspectedCount } = provinceData;
    /**
     * 获取省的治疗疫情数量
     */
    let { curedCount } = provinceData;
    /**
     * 获取省的死亡数量
     */
    let { deadCount } = provinceData;
    /**
     * 获取分界线绘制省的不规则图像
     */
    getBoundLineByProvinceName(provinceShortName).then(boundLines => {
        if (boundLines) {
            drawByArr(boundLines, provinceShortName, confirmedCount);
        }
    });
}


/**
 * 传入坐标,绘制边线
 */
/**
 * 
 *各种颜色
 */
//大于10000DARKRED
let Color1 = Cesium.Color.BLACK;
//100-9999
let Color2 = Cesium.Color.MAROON
//10-99
let Color3 = Cesium.Color.RED;
//1-9
let Color4 = Cesium.Color.WHEAT;
//0
let Color5 = Cesium.Color.WHITE;


/**
 * 导入标题和数字市
 */
function addNameAndNumberCity(name, z,pname) {
    let number=z
    let position = centerData[name]
    if (!position) {
        position = centerData[name + "市"];
        if (!position) {
            return;
        }
    }

    if (pname == "湖北") {
        z *= 20;
    } else if (pname == "浙江") {
        z *= 50;
    } else {
        z *= 3000;
    }
   
    var entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(position[0], position[1], z + 50100),
        label: { //文字标签
            text: name+" "+number,
            font: "500 5px Helvetica",
            fillColor: Cesium.Color.RED,
            showBackground : true,
        },

    });
    entity.show=false;
    citiesText[pname].push(entity)
}

/**
 * 导入标题和数字省
 */
function addNameAndNumberProvince(name, z) {
    let number=z
    let thisName=name;
    if(name=="西藏"){
        name="西藏自治区"
    }
    if(name=="新疆"){
        name="新疆维吾尔自治区"
    }
    if(name=="北京"){
        name="北京市";
    }
    if(name=="内蒙古"){
        name="内蒙古自治区"
    }
    let position = centerData[name]
    if (!position) {
        position = centerData[name + "省"];
        if (!position) {
            return;
        }
    }

    if (name == "湖北" || name == "湖北") {
        z *= 10
    } else {
        z *= 300
    }
    var entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(position[0], position[1], z + 50100),
        label: { //文字标签
            text: name+" "+number,
            font: "500 10px Helvetica",
            fillColor: Cesium.Color.RED,
            showBackground : true,
        },

    });
    provinceText[thisName]=entity;
    
}



/**
 * 
 *  {ceisum点击事件}  
 */



var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (click) {
   
    /**
     * 判断是否点击到模型
     */
    let model = viewer.scene.pick(click.position);
    if (model) {
        /**
         * 是否点击了模型
         */
        if (model.id) {
            if (model.id._name) {
                setDataByNmae1(allYqdata[model.id._name])
                

            }
        }
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);


function drawByArr1(boundLine, a, b, pname) {
    if (!boundLine) {
        return
    }
    boundLine.map(boundLine => {
        /**
         * 存储该省的子模型
         */
        let result = [];
        let result1 = boundLine.split(";")
        result1.map(result2 => {
            result.push(result2.split(",")[0] * 1)
            result.push(result2.split(",")[1] * 1)
            if (pname == "湖北") {
                result.push(b * 20);
            } else if (pname == "浙江") {
                result.push(b * 50);
            } else {
                result.push(b * 3000);
            }

        })
        /**
         * 导入模型
         * 判断数值选择颜色
         */
        let color;
        if (b >= 10000) {
            color = Color1;
        }
        if (b >= 100 && b < 10000) {
            color = Color2
        }

        if (b >= 10 && b < 100) {
            color = Color3
        }
        if (b <= 9 && b > 0) {
            color = Color4
        }
        if (b == 0) {
            color = Color5
        }

        /**
         * 读取点,创建模型
         */

        var greenPolygon = viewer.entities.add({
            name: a,
            _id: a,
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(result),
                extrudedHeight: 0,
                perPositionHeight: true,
                material: color,
                outline: false,
            }
        })
        greenPolygon.show = false;
        citiesModel[pname].push(greenPolygon)

    })
}


function drawByArr(boundLine, a, b) {

    let procinceMdeols = []

    boundLine.map(boundLine => {

        /**
         * 存储该省的子模型
         */
        let result = [];
        let result1 = boundLine.split(";")
        result1.map(result2 => {
            result.push(result2.split(",")[0] * 1)
            result.push(result2.split(",")[1] * 1)
            if (a == "湖北") {
                result.push(b * 10);
            } else {
                result.push(b * 300);
            }
        })

        /**
         * 导入模型
         * 判断数值选择颜色
         */
        let color;
        if (b >= 10000) {
            color = Color1;
        }
        if (b >= 100 && b < 10000) {
            color = Color2
        }

        if (b >= 10 && b < 100) {
            color = Color3
        }
        if (b <= 9 && b > 0) {
            color = Color4
        }
        if (b == 0) {
            color = Color5
        }

        /**
         * 读取点,创建模型
         */

        var greenPolygon = viewer.entities.add({
            name: a,
            _id: a,
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(result),
                extrudedHeight: 0,
                perPositionHeight: true,
                material: color,
                outline: false,
            }
        })


        procinceMdeols.push(greenPolygon)
    })
    provinceModel[a] = procinceMdeols;

}



/**
 * 取消默认事件
 */
viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);



/**
 * 传入数据,渲染图标
 */
var selectMesh;
var selectShortCity;
var selectTextProvince;
var selectTextCities;
function setDataByNmae1(src) {
    createCanvas1();
    document.getElementById('canvas1').style.display = "block";
    document.getElementById('canvas2').style.display = "block";
    if (src.provinceName) {
        /**
         * 隐藏这个模型组
         */
        if (selectMesh) {
            for (let i = 0; i < selectMesh.length; i++) {
                selectMesh[i].show = true;
            }
        }

        if (selectShortCity) {
            for (let i = 0; i < selectShortCity.length; i++) {
                selectShortCity[i].show = false;
            }
        }
        if(selectTextProvince){
            selectTextProvince.show=true;
        }
        if(selectTextCities){
            for(let i=0;i<selectTextCities.length;i++){
                selectTextCities[i].show=false;
            }
        }

        selectMesh = provinceModel[src.provinceShortName];
        /**
         * 隐藏省份模型
         */
        for (let i = 0; i < provinceModel[src.provinceShortName].length; i++) {
            provinceModel[src.provinceShortName][i].show = false;
        }

        /**
         * 显示市区的模型
         */
         cityIes = citiesModel[src.provinceShortName]
        selectShortCity = cityIes;
        
        for (let i = 0; i < cityIes.length; i++) {
            cityIes[i].show = true;
        }
        
        
        /**
         * 显示市区的标题
         */
          selectTextCities=citiesText[src.provinceShortName];
        for(let i=0;i<selectTextCities.length;i++){
            selectTextCities[i].show=true;
        }


        /**
         * 聚焦
         */
        if (src.provinceShortName == "西藏") {
            let gotoCenterData = centerData["西藏自治区"];
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(gotoCenterData[0], gotoCenterData[1], 2000000)
            });
        }else if (src.provinceShortName == "新疆") {
            let gotoCenterData = centerData["新疆维吾尔自治区"];
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(gotoCenterData[0], gotoCenterData[1], 2000000)
            });
        }else if (src.provinceShortName == "北京") {
            let gotoCenterData = centerData["北京市"];
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(gotoCenterData[0], gotoCenterData[1], 2000000)
            });
        }else if(src.provinceShortName == "内蒙古") {
            let gotoCenterData = centerData["内蒙古自治区"];
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(gotoCenterData[0], gotoCenterData[1], 2000000)
            });
        }else{
            let gotoCenterData = centerData[src.provinceShortName];
            if(gotoCenterData){
                viewer.camera.setView({
                    destination: Cesium.Cartesian3.fromDegrees(gotoCenterData[0], gotoCenterData[1], 2000000)
                });
            }else{
                let gotoCenterData = centerData[src.provinceShortName+"省"];
                if(gotoCenterData){
                    viewer.camera.setView({
                        destination: Cesium.Cartesian3.fromDegrees(gotoCenterData[0], gotoCenterData[1], 2000000)
                    });
                }
            }
        }




        /**
         * 隐藏字体省份
         */
        provinceText[src.provinceShortName].show=false;
        selectTextProvince= provinceText[src.provinceShortName]
        document.getElementById('t1').innerHTML = '全国疫情占比';
        document.getElementById("t2").innerHTML = `省内疫情详情`;
        setDataByProvinceName(src);
    } else {
        document.getElementById('t1').innerHTML = '全市疫情占比';
        document.getElementById("t2").innerHTML = `全球疫情占比`;
        setCanvasByCity(src)
    }
}


/**
 * 获取高度
 */
function getHeight() {
    if (viewer) {
        var scene = viewer.scene;
        var ellipsoid = scene.globe.ellipsoid;
        var height = ellipsoid.cartesianToCartographic(viewer.camera.position).height;
        return height;
    }
}
/**
 * 滚动事件取消小地图
 */
handler.setInputAction(function(click){
    if(getHeight()>=3473013.9708565823){
        /**
         * 显示该显示的隐藏该隐藏的
         */
        if(selectMesh){
            for(let i=0;i<selectMesh.length;i++){
                selectMesh[i].show=true;
            }
            selectMesh=null;
        }

        /**
         * 
         */
        if (selectShortCity) {
            for (let i = 0; i < selectShortCity.length; i++) {
                selectShortCity[i].show = false;
            }
            selectMesh=null;
        }
        if(selectTextProvince){
            selectTextProvince.show=true;
            selectMesh=null;
        }
        if(selectTextCities){
            for(let i=0;i<selectTextCities.length;i++){
                selectTextCities[i].show=false;
            }
            selectMesh=null;
        }




    }
},Cesium.ScreenSpaceEventType.WHEEL);

/**
 * 传入省名字,渲染数据
 */
function setDataByProvinceName(province) {

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
                    { value: allCount1 - province.confirmedCount, name: '其他省份' },
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




/**
 * 重新渲染图标
 */
function createCanvas1() {
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





/**
 * 
 * @param {设置飞行} x 
 * @param {*} y 
 * @param {*} z 
 * @param {*} procinceName 
 */
var setfly = function (x, y, z, procinceName) {
    console.log(procinceName)
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(x, y, 2000000)
    });



    /**
     * 单独显示浙江的城市
     */
    if (selectMesh) {
        for (let i = 0; i < selectMesh.length; i++) {
            selectMesh[i].show = true;
        }
    }

    if (selectShortCity) {
        for (let i = 0; i < selectShortCity.length; i++) {
            selectShortCity[i].show = false;
        }
    }
    selectMesh = provinceModel[procinceName];
    for (let i = 0; i < selectMesh.length; i++) {
        selectMesh[i].show = false;
    }
    selectShortCity = citiesModel[procinceName]
    for (let i = 0; i < selectShortCity.length; i++) {
        selectShortCity[i].show = true;
    }
}