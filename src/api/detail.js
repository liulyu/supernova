import jsonp from "common/js/jsonp.js"
import {commonParams,options} from "./config.js"
import axios from "axios"
export function getSonglistDetail(disstid){
    const data=Object.assign({},commonParams,{
         disstid,
         type: 1,
         json: 1,
         utf8: 1,
         onlysong: 0,
         platform: 'yqq',
         hostUin: 0,
         needNewCode: 0
    });
    const url="/api/getCdInfo";
    return axios.get(url,{
        params: data
      }).then((response)=>{
        let ret = response.data
        if (typeof ret === 'string') {
            const reg = /^\w+\(({.+})\)$/
            const matches = ret.match(reg)
            if (matches) {
                ret = JSON.parse(matches[1])
            }
        }
        return Promise.resolve(ret)
    })
}