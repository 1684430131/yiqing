/**
 * 获取疫情数据
 */
var getEpidemicSituationJson=function(){
    return new Promise(reject=>{
        let xml=new XMLHttpRequest();
        xml.open("GET","http://api.tianapi.com/txapi/ncovcity/index?key=39c122ac8c75404e194eb99a92c4b872");
        xml.send();
        xml.addEventListener("readystatechange",function(){
            if(xml.readyState==4){
                reject(JSON.parse(xml.response));
            }
        })
    })
}



/**
 * 传入省,获取边界线
 * @ProvinceName (省的名称);
 */
var allDingwei={};
var  getBoundLineByProvinceName=function(ProvinceName){
    
    return new Promise(reject=>{
        // new BMap.Boundary().get(ProvinceName, function(rs){
            // allDingwei[ProvinceName]=rs.boundaries
            
            reject(positionData[ProvinceName]);
        // });
    })
}





/**
 * 获取新闻
 */
var getMsg=function(){
    return new Promise(reject => {
        let xml = new XMLHttpRequest();
        xml.open("GET", "http://api.tianapi.com/txapi/ncov/index?key=39c122ac8c75404e194eb99a92c4b872");
        xml.send();
        xml.addEventListener("readystatechange", function () {
            if (xml.readyState == 4) {
                reject(JSON.parse(xml.response));
            }
        })
    })
}


