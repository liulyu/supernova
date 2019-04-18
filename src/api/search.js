import jsonp from "common/js/jsonp.js"
import {commonParams,options} from "./config.js"
import axios from "axios"
export function getHotKey(){
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
    const data = Object.assign("",commonParams,{
        uin: 0,
        needNewCode: 1,
        platform: 'h5'
    })
    return jsonp(url,data,options)
}

export function getSuggest(searchWord,page,zhida,perpage){
    const data = Object.assign({}, commonParams, {
        g_tk:5381,
        uin:0,
        format:'json',
        inCharset:'utf-8',
        outCharset:'utf-8',
        notice:0,
        platform:'h5',
        needNewCode:1,
        w:searchWord,
        zhidaqu:1,
        catZhida: zhida ? 1 : 0,
        t:0,
        flag:1,
        ie:'utf-8',
        sem:1,
        aggr:0,
        perpage:perpage,
        n:perpage,
        p:page,
        remoteplace:'txt.mqq.all',
        _:1537612841753,
      })
     

    const url="/api/getSuggest"

    return axios.get(url, {
        params: data
      }).then((response) => {
        var ret = response.data
          if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/
            var matches = ret.match(reg)
            if (matches) {
              ret = JSON.parse(matches[1])
            }
          }
        return new Promise(resolve => resolve(ret))
      })
}