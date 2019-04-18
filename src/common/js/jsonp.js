import jsonp1 from "jsonp"

export default function jsonp(url,data,option){
    url+=(url.indexOf("?")<0 ? "?" : "&") + param(data);
    return new Promise((resolve,reject)=>{
        jsonp1(url,option,(err,data)=>{
            if(!err){
                return resolve(data);
            }else{
                return reject(err);
            }
        })
    })
}

function param(data){
    var url="";
    for (const i in data) {
        if (data.hasOwnProperty(i)) {
            const element = data[i] !==undefined ? data[i] : "";
            url+= "&" +i +"="+encodeURIComponent(element)
        }
    }
    return url
}