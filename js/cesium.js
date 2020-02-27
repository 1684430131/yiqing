/**
 * 地图初始划
 */
var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    }), 
    geocoder: false,               
    sceneModePicker: false,         
    navigationHelpButton: false, 
    baseLayerPicker: false,         
    homeButton: false,              
    fullscreenButton: false,        
    timeline: false,          
    animation: false,            
});
viewer.cesiumWidget.creditContainer.style.display = "none";


/**
 * 
 * @param {点击} id 
 * @param {回调} call 
 */
function $(id,call){
    document.getElementById(id).addEventListener("click",call);
}



/**
 * 获取定位信息
 */
var position={x:"",y:""}
function getPosition() {
    let scene = viewer.scene;
    let ellipsoid = scene.globe.ellipsoid;
    let longitudeString = null;
    let latitudeString = null;
    let height = null;
    let cartesian = null;
    let handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function (movement) {
        cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
        if (cartesian) {
            var cartographic = ellipsoid.cartesianToCartographic(cartesian);
            longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            height = Math.ceil(viewer.camera.positionCartographic.height);
            position.x = longitudeString
            position.y = latitudeString
        } else {
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}
getPosition();


/**
 * ajax get
 */
function get(SRC){
    return new Promise(r=>{
        let xml=new XMLHttpRequest();
        xml.open('get',SRC);
        xml.send();
        xml.addEventListener("readystatechange",function(){
            if(xml.readyState==4){
                r(JSON.parse(xml.response))
            }
        })
    })
   
}