import jsonp from "common/js/jsonp.js"
import {commonParams,options} from "./config.js"
import axios from "axios"

export  function getRecommend(){
    const jsonpData=Object.assign({},commonParams,{options:"h5",options:"1",});
    const url="https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";
    return jsonp(url,jsonpData,options);
};

export function getDiscList() { // 歌单列表数据获取
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });
  return axios.get('/api/getDiscList', {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
}


