<template>
    <div class="music-list">
        <div class="back">
        <i class="icon-back" @click="back"></i>
        </div>
        <h1 class="title" >{{name}}</h1>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
        <div class="play-wrapper">
            <div class="play" v-show="songs.length > 0" ref="playBtn" @click="randomPlayAll" >
                <i class="icon-play"></i>
                <span class="text">随机播放全部</span>
            </div>
        </div>
        <div class="filter" ref="filter"></div>
     </div>
     <div class="layer" ref="layer"></div>
     <scroll class="list" :probeType="probeType" :listen-scroll="listenScroll" @scroll="scroll" ref="list">
         <div>
             <songList :songs="songs" class="songListWrap" @select="select"></songList>
         </div>
     </scroll>
    <div class="loadContainer" v-show="!songs.length">
             <loading></loading>
    </div>
    </div> 
</template>

<script>
import scroll from "base/scroll/scroll"
import songList from "base/songList/songList"
import {prefixStyle} from "common/js/dom"
import {mapActions} from 'vuex'
import {playmixins} from 'common/js/mixins';
const LAST_HEIGHT=35
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
import loading from "base/load/loading" 
export default {
    data(){
        return{
            scrollY:-1
        }
    },
    mixins:[playmixins],
    props:{
        songs:{
            type:Array,
            default:[]
        },
        bg_image:{
            type:String,
            default:""
        },
        name:{
            type:String,
            default:""
        },
        
    },
    created(){
        this.probeType=3;
        this.listenScroll=true
    },
    mounted(){
        this.imgHeight = this.$refs.bgImage.clientHeight;
        this.minTranslateY=-this.imgHeight+LAST_HEIGHT;
        this.$refs.list.$el.style.top= `${this.imgHeight}px `
    },
    computed:{
        bgStyle(){
            return `background-image:url(${this.bg_image})`;
        }
    },
    methods:{
        handlePlaylist(playlist){
            let b =playlist.length>0 ? 60 :0;
            this.$refs.list.$el.style.bottom=b+"px";
            this.$refs.list.refresh();
        },
        select(song,index){
            this.selectPlay({
                list:this.songs,
                index
            })
        },
        randomPlayAll(){
            this.randomPlay({
                list:this.songs
            })
        },
        scroll(pos){
            this.scrollY=pos.y
        },
        back(){
            this.$router.back();
        },
        ...mapActions([
            "selectPlay",
            "randomPlay"
        ])
    },
    watch:{
        scrollY(newY){
            let height=Math.max(this.minTranslateY,newY)
            this.$refs.layer.style[transform]=`translate3d(0,${height}px,0)`;
            let zIndex=10,percent=Math.abs(newY/this.imgHeight),blur=0,scale=1;
            if(newY>0){
                scale=1+percent;
                this.$refs.bgImage.style[transform]=`scale(${scale})` //因为最后定义了bgImage的层级 所以图片会盖住layer
            }else{
                blur = Math.min(20, percent * 20)
            }
            this.$refs.filter.style[backdrop] = `blur(${blur}px)`
            if(this.minTranslateY>newY){
                this.$refs.bgImage.style.paddingTop=0;
                this.$refs.bgImage.style.height=`${LAST_HEIGHT}px`;
                this.$refs.playBtn.style.display="none"
            }else{
                this.$refs.bgImage.style.paddingTop="70%";
                this.$refs.bgImage.style.height=0;
                this.$refs.playBtn.style.display=""
                zIndex=0
            }
            this.$refs.bgImage.style.zIndex=zIndex
        }
    },
    components:{
        scroll,
        songList,
        loading
    }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
     @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
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
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70% //padding-top和包含块的宽度有关 不是高度
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
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
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .list
        position:fixed
        bottom 0
        width 100%
        .songListWrap
            padding 20px 30px
        
    .loadContainer
            width 100%
            position absolute
            top 50%
            text-align center
            transform translate(0,-50%)        
    .layer
      position: relative
      height: 100%
      background: $color-background   
</style>
