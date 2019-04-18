import {commonParams,options} from "./config.js"
import axios from "axios"

export  function getLyric(mid){
    const data=Object.assign({},commonParams,{
        songmid: mid,
        pcachetime: +new Date(),
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        g_tk: 67232076,
        format: 'json'
    })
    const url="/api/getLyric"

    return axios.get(url, {
        params: data
      }).then((response) => {
        let ret = response.data
        if (typeof ret === 'string') {
          let reg = /^\w+\(({[^()]+})\)$/
          let matches = ret.match(reg)
          if (matches) {
            ret = JSON.parse(matches[1])
          }
        }
        return new Promise(resolve => resolve(ret))
      })
}