export default function addClass(iment,className){
    if(hasClass(iment,className)){
        return ;
    }
    
    iment.className += " " + className;
}

function hasClass( iments,cName ){
    return !!iments.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") ); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
};


export function getData(target,name,val){
    var prefix="-data";
    if(val){
        target.setAttribute(name+prefix,val)
    }else{
        return target.getAttribute(name+prefix,val)
    }
}

let vendor = (()=>{
        var ele= document.createElement("div").style;
        var type={
            webkit:"webkitTransform",
            Moz:"MozTransform",
            O:"OTransform",
            ms:"msTransform",
            standard:"transform"
        }

        for (const i in type) {
            if (type.hasOwnProperty(i)) {
                const element = type[i];
                if(ele[element]!==undefined){
                    return i;
                }
                return false
            }
        }
})()

export function prefixStyle(name){
    if(vendor===false){
        return false;
    }

    if(vendor==="standard"){
        return name
    }

    return vendor+name.charAt(0).toUpperCase()+name.substr(1)
}