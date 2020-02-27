
/**
 * 入口代码
 */
let model = [];



/**
 * 导入
 */
get("json/index.json").then(data => {

    data.map(dataItem => {
        modelItem = AddMark(dataItem.x, dataItem.y, dataItem.text);
        modelItem.position = { x: dataItem.x, y: dataItem.y };
        model.push(modelItem);
    })

})



var shezhididian = function () {

    var lng = document.getElementById("longitude").value;
    var lat = document.getElementById("latitude").value;

    if (lng == 0 && lat == 0) {
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (event) {
            var earthPosition = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
            var cartographic = Cesium.Cartographic.fromCartesian(earthPosition, viewer.scene.globe.ellipsoid, new Cesium.Cartographic());
            var lat = Cesium.Math.toDegrees(cartographic.latitude);
            var lng = Cesium.Math.toDegrees(cartographic.longitude);
            shigudidian(lng, lat)
            start(lng, lat)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    } else {
        shigudidian(lng, lat)
        start(lng, lat)
    }

}



var shigudidian = function (m, n) {

    /**
     * 绘制圆点
     */
    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(m, n, 0),
        point: {
            color: Cesium.Color.GREEN,
            pixelSize: 12
        }
    });

    /**
     * 飞行到指定视角
     */
    viewer.scene.camera.flyTo({

        destination: new Cesium.Cartesian3.fromDegrees(m, n, 3000), // 视角位置高度
        orientation: {
            heading: Cesium.Math.toRadians(0), // 方向
            pitch: Cesium.Math.toRadians(-90.0), // 倾斜角度
            roll: 0
        },
        duration: 1 // 视角加载时间

    })

}



var start = function (m, n) {
    var windSpeed = document.getElementById("windSpeed").value;
    var windDirection = document.getElementById("windDirection").value;
    // var simulationSpeed = document.getElementById("simulationSpeed").value;

    function count(num, time) {

        var i = 1;
        var fn = setInterval(function () {
            j = i++;

            that=this;
            /**
             * 添加椭圆
             */
            that.f = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(m, n, 0),
                name: 'Red ellipse on surface with outline',
                ellipse: {
                    semiMinorAxis: 400 + windSpeed * j,
                    semiMajorAxis: 1000 + windSpeed * j,
                    material: Cesium.Color.RED.withAlpha(0.5),
                    rotation: Cesium.Math.toRadians(windDirection)
                }
            });

            /**
             * 飞行到指定视角
             */
            viewer.scene.camera.flyTo({

                destination: new Cesium.Cartesian3.fromDegrees(m, n, windSpeed * j * 10), // 视角位置高度
                orientation: {
                    heading: Cesium.Math.toRadians(0), // 方向
                    pitch: Cesium.Math.toRadians(-90.0), // 倾斜角度
                    roll: 0
                },
                duration: 1 // 视角加载时间

            })

            let x1 = parseInt(m);
            let y1 = parseInt(n);
            model.map(e => {
                let x = e.position.x;
                let y = e.position.y;
                let l = (1 * Math.PI) / 180;
                let cons = Math.cos(l);
                let sinv = Math.sin(l);
                let xr1 = (x - x1) * cons - (y - y1) * (sinv) + x1;
                let xr2 = (x - x1) * sinv + (y - y1) * (cons) + y1;
                let result1 = ((xr1 - x1) * (xr1 - x1)) / (((1000 + windSpeed * j) / 111000) * ((1000 + windSpeed * j) / 111000));
                let result2 = ((xr2 - y1) * (xr2 - y1)) / (((400 + windSpeed * j) / 111000) * ((400 + windSpeed * j) / 111000));
                if ((result1 + result2) <= 1) {
                    e.label.show = true;
                    e.label1.show = true;
                } else {
                    e.label.show = false;
                    e.label1.show = false;
                }
            });

            if (i > num) {
                clearInterval(fn);
            }

        }, time * 2000);

    }

    count(5, 1);

}



var select = function (j) {

    viewer.entities.removeAll();

    var windSpeed = document.getElementById("windSpeed").value;
    var windDirection = document.getElementById("windDirection").value;

    var lng = document.getElementById("longitude").value;
    var lat = document.getElementById("latitude").value;
    if (lng == 0 && lat == 0) {
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (event) {
            var earthPosition = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
            var cartographic = Cesium.Cartographic.fromCartesian(earthPosition, viewer.scene.globe.ellipsoid, new Cesium.Cartographic());
            var lat = Cesium.Math.toDegrees(cartographic.latitude);
            var lng = Cesium.Math.toDegrees(cartographic.longitude);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    /**
     * 添加椭圆
     */
    fw = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 0),
        name: 'Red ellipse on surface with outline',
        ellipse: {
            semiMinorAxis: 400 + windSpeed * j,
            semiMajorAxis: 1000 + windSpeed * j,
            material: Cesium.Color.RED.withAlpha(0.5),
            rotation: Cesium.Math.toRadians(windDirection)
        }
    });

    /**
     * 飞行到指定视角
     */
    viewer.scene.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(lng,lat, windSpeed * j * 10), // 视角位置高度
        orientation: {
            heading: Cesium.Math.toRadians(0), // 方向
            pitch: Cesium.Math.toRadians(-90.0), // 倾斜角度
            roll: 0
        },
        duration: 1 // 视角加载时间
    })

    let x1 = parseInt(lng);
    let y1 = parseInt(lat);
    model.map(e => {
        let x = e.position.x;
        let y = e.position.y;
        let l = (1 * Math.PI) / 180;
        let cons = Math.cos(l); 
        let sinv = Math.sin(l);
        let xr1 = (x - x1) * cons - (y - y1) * (sinv) + x1;
        let xr2 = (x - x1) * sinv + (y - y1) * (cons) + y1;
        let result1 = ((xr1 - x1) * (xr1 - x1)) / (((1000 + windSpeed * j) / 111000) * ((1000 + windSpeed * j) / 111000));
        let result2 = ((xr2 - y1) * (xr2 - y1)) / (((400 + windSpeed * j) / 111000) * ((400 + windSpeed * j) / 111000));
        console.log(result1 + result2)
        if ((result1 + result2) <= 1) {
            e.label.show = true;
            e.label1.show = true;
        } else {
            e.label.show = false;
            e.label1.show = false;
        }
    });

}



/**
 * 点击添加文字
 * @param {} x 
 * @param {*} y 
 * @param {*} text 
 */

// var json=[];
// window.addEventListener("dblclick",function(){
//     AddMark(position.x,position.y,"标题");
//     json.push({x:position.x,y:position.y,text:"positi"});
// })

function AddMark(x, y, text) {
    var label1 = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(x, y, 100),
        name: 'point',
        point: {
            color: Cesium.Color.BLUE,
            outlineColor: Cesium.Color.WHITE,
            pixelSize: 8
        }
    });
    viewer.entities.add(label1);
    var label = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(x, y, 100),
        name: "label",
        label: {
            text: text,
            font: "29px Helvetica",
            fillColor: Cesium.Color.SKYBLUE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200, 0.4)
        }
    });
    label.show = false;
    label1.show = false;
    viewer.entities.add(label);
    return { label1, label }
}