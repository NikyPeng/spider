/**
 * Created by glzc on 2018/1/17.
 */

function $(select){
    return document.querySelector(select)
}
function createXMLHTTPRequest(){
    var xmlHttp;
    if(window.XMLHttpRequest){
        //针对FireFox，Mozillar，Opera，Safari，IE7，IE8
        xmlHttp = new XMLHttpRequest();
        //针对某些特定版本的mozillar浏览器的BUG进行修正
        if(xmlHttp.overrideMimeType){
            xmlHttp.overrideMimeType("text/xml")
        }
    }else if(window.ActiveXObject){
        //针对IE6，IE5.5，IE5
        //两个可以用于创建XMLHTTPRequest对象的控件名称，保存在一个js的数组中
        //排在前面的版本较新
        var activeName = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
        for(var i = 0; i < activeName.length; i++){
            try{
                xmlHttp = new ActiveXObject(activeName[i]);
                if(xmlHttp){
                    break;
                }
            }catch(e){

            }
        }
    }
    return xmlHttp;
}
function ajax(url, data, method, successCallBack, failCallBack){
    var req = createXMLHTTPRequest();
    if(req){
        req.open(method, url, true);
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.send(data);
        req.onreadystatechange = function(){
            if(req.readyState == 4){
                if(req.status == 200){
                    successCallBack(req.responseText)
                }else{
                    failCallBack(req.responseText)
                }
            }
        }
        /*switch (method){
            case "POST":
                req.open()
                break;
            case "GET":
                break;
            default :
                break;
        }*/
    }
}