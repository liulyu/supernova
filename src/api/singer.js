import jsonp from "common/js/jsonp.js"
import {commonParams,options} from "./config.js"

export  function getSingerList(){
    //加上jsonpCallback:"callback"报错 ----callback__jp5 is not defined
    const jsonpData=Object.assign({},commonParams,{channel:"singer",page:"list",
    key:"all_all_all",pagesize:30,pagenum:1,loginUin:0,
    hostUin:0,platform:'ydd',needNewCode:0});

    const url="https://c.y.qq.com/v8/fcg-bin/v8.fcg";
    return jsonp(url,jsonpData,options);
};

export function getSingerDetal(id){
    const data=Object.assign({},commonParams,{
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        order: 'listen',
        begin: 0,
        num: 100,
        songstatus: 1,
        singermid: id
    });
    const url="https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg";
    return jsonp(url,data,options)
}