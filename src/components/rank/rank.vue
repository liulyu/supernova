<template>
    <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li  class="item" v-for="item in topList" @click="select(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <load></load>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import scroll from "base/scroll/scroll"
import {getRank} from "api/rank"
import load from 'base/load/loading'
import {ERR_OK} from 'api/config'
import {mapMutations} from "vuex"
export default {
    data(){
        return{
            topList:[
                
            ]
        }
    },
    components:{
        scroll,
        load
    },
    created(){
        this._getRankData()
    },
    
    methods:{
        ...mapMutations([
            "SET_RANK_DESC"
        ]),
        select(item){
            this.$router.push({path:`/Rank/${item.id}`});
            this.SET_RANK_DESC(item)
        },
        _getRankData(){
            getRank().then((res)=>{
                if(res.code===ERR_OK){
                    this.topList=res.data.topList;
                    console.log(this.topList);
                }
            }).catch((err)=>{
                console.log(err);
            })
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>