<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches  :titles="switches" @onChangeIndex="changeIndex" :currentIndex="currentIndex"></switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
          <scroll class="list-scroll" v-if="currentIndex==0" ref="favoriteScroll">
                <div  class="list-inner">
                    <songList :songs="favoriteSong" @select="selectItem"></songList>
                </div>
          </scroll>
          <scroll class="list-scroll" v-if="currentIndex==1" ref="playScroll">
                <div  class="list-inner">
                    <songList :songs="playHistory" @select="selectItem"></songList>
                </div>
          </scroll>
          <noResult class="no-result-wrapper" v-show="showFlag" :title="titleDesc"></noResult>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Switches from 'base/switches/switches'
  import scroll from "base/scroll/scroll"
  import songList from "base/songList/songList"
  import noResult from "base/no-result/no-result"
  import {mapGetters,mapActions} from "vuex"
  import {playmixins} from "common/js/mixins"
  export default {
    data() {
      return {
        currentIndex: 0,
        switches: [
          {
            name: '我喜欢的'
          },
          {
            name: '最近听的'
          }
        ]
      }
    },
    mixins:[playmixins],
    computed:{
      ...mapGetters(["favoriteSong","playHistory"]),
      showFlag(){
          if(this.currentIndex===0){
            return !this.favoriteSong.length;
          }else{
            return !this.playHistory.length;
          }
        },
      titleDesc(){
        if(this.currentIndex===0){
            return "暂无收藏歌曲";
          }else{
            return "您还没有听过歌曲";
          }
      }
    },
    methods: {
        handlePlaylist(playList){
            let bottom = playList.length>0? "60px" :0;
            this.$refs.listWrapper.style.bottom=bottom;
            this.currentIndex==0?this.$refs.favoriteScroll.refresh() : 
            this.$refs.playScroll.refresh();
        },
        random(){
          
          if(this.currentIndex==0){
            if(!this.favoriteSong.length){
                return 
            }
            this.randomPlay({list:this.favoriteSong})
          }else{
            if(!this.playHistory.length){
                return 
            }
            this.randomPlay({list:this.playHistory})
          }
        },
        selectItem(song){
           this.insertSuggestSong(song)
        },
        ...mapActions(["insertSuggestSong","randomPlay"]),
        back(){
            this.$router.back();
        },
        changeIndex(index){
            this.currentIndex=index
        }
    },
    components: {
      Switches,
      scroll,
      songList,
      noResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>