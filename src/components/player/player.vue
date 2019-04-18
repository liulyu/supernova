<template>
   <div class="player" v-show="playList.length>0">
     <transition 
        name="normal"
     >  
     <!-- @enter="enter"
        @after-enter="afterEnter"
        @leave="leave"
        @after-leave="afterLeave" -->
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
          
        </div>
        <div class="middle" 
        @touchstart="middletouchstart"
        @touchmove="middletouchmove"
        @touchend="middletouchend">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image" >
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                <div class="text" v-show="notLyric">纯音乐，请欣赏</div>
                <p>{{playingLyric}}</p>
              </div>
            </div>
          </div>
           <scroll class="middle-r" ref="lyricList" :data="currenlyricObj.lines" >
            <div class="lyric-wrapper">
              <div>
                <div class="text" v-show="notLyric">纯音乐，请欣赏</div>
                <p 
                  ref="lyricLine"
                  class="text"
                  v-for="(line, index) in currenlyricObj.lines"
                  :key="index"
                  :class="{'current': index === currentLineNum}"
                >
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">
                {{formatTime(currentTime)}}
            </span>
            <div class="progress-bar-wrapper">
              <progressBar :percent="percent" @percent="onClickProgressBar"></progressBar>
            </div>
            <span class="time time-r">
                {{formatTime(currentSong.during)}}
            </span>
          </div>
          <div class="operators">
            <div class="icon i-left" >
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i  class="icon-prev" @click="prev" ></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next" ></i>
            </div>
            <div class="icon i-right" >
              <i :class="getFavorite(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
     </transition>
     <transition name="mini">
      <div class="mini-player" v-show="!fullScreen"  @click="open">
        <div class="icon" >
          <img  width="40" height="40" :src="currentSong.image" :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
          
        </div>
        <div class="control" >
          <progressCircle :radius="radius" :percent="percent">
            <i class="icon-play-mini icon-mini" :class="miniIcon" @click.stop="togglePlaying" ></i>
          </progressCircle> 
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" @play="ready" @error="error" @timeupdate="timeupdate" @ended="songEnd"></audio>
    <playList ref="playList"></playList>
  </div>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from "vuex"
import animations  from "create-keyframe-animation"
import {prefixStyle} from "common/js/dom"
import playList from "base/playList/playList"
import progressBar from "base/progress-bar/progress-bar"
import progressCircle from "base/progress-circle/progress-circle"
import {player} from "common/js/mixins"

import axios from "axios"
import {playMode} from "api/config"
import {getLyric} from "api/song"
import {Base64} from "js-base64"
import Lyric from 'lyric-parser'
import scroll from "base/scroll/scroll"
const transform =prefixStyle("transform")
const transitionDuration =prefixStyle('transitionDuration')
const durationTime=300
export default {
    data(){
      return{
        songReady:false,
        currentTime:0,
        radius:32,
        notLyric:false,
        currenlyricObj:{},
        currentLineNum: 0,
        currentShow:"cd",
        playingLyric:""
      }
    },
    created(){
      this.touch={};
    },
    mixins:[player],
    computed:{
        ...mapGetters([
            'currentIndex',
            'fullScreen',
            'playing',
            "currentSong",
            "playList",
            "mode",
            "sequenceList"
        ]),
        cdCls() {
            return this.playing ? 'play' : 'play pause'
        },
        playIcon() {
            return this.playing ? 'icon-pause' : 'icon-play'
        },
        miniIcon() {
            return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
        },
        disableCls() {
            return this.songReady ? '' : 'disable'
        },
        percent(){
          return this.currentTime/this.currentSong.during
        },
        
    },
    methods:{
       saveFavorite(){
          this.saveOneFavoriteSong(this.currentSong);
       },
       ...mapActions([
         "savePlayHistort"
       ]),
       showPlaylist(){
         this.$refs.playList.show();
       },
        middletouchstart(e){
            this.touch.inital=true;
            this.touch.startX=e.touches[0].pageX;
            this.touch.startY=e.touches[0].pageY;
            this.touch.offsetX=this.currentShow=="cd" ? 0 : -window.innerWidth
        },
        middletouchmove(e){
            let disX=e.touches[0].pageX-this.touch.startX;
            let disY=e.touches[0].pageY-this.touch.startY;
            if(Math.abs(disY)>Math.abs(disX)){
              return;
            }

            let width = Math.min(Math.max(-window.innerWidth,this.touch.offsetX+disX),0);
            this.touch.percent=Math.abs(width/window.innerWidth);
            this.$refs.lyricList.$el.style[transform]=`translate3d(${width}px,0,0)`
            this.$refs.lyricList.$el.style[transitionDuration]=0;
            this.$refs.middleL.style[transitionDuration]= 0;
            this.$refs.middleL.style.opacity=1-this.touch.percent;
        },
        middletouchend(e){
          let offsetWidth,opacity;
          let width=window.innerWidth;
          if(this.currentShow==="cd"){
            if(this.touch.percent>0.1){
              offsetWidth=-width;
              this.currentShow="lyric";
              opacity=0
            }else{
              offsetWidth=0;
              opacity=1
            }
          }else{
            if(this.touch.percent<0.9){
              offsetWidth=0;
              this.currentShow="cd"
              opacity=1
            }else{
              offsetWidth=-width
              opacity=0
            }
          }
          this.$refs.lyricList.$el.style[transform]=`translate3d(${offsetWidth}px,0,0)`
          this.$refs.lyricList.$el.style[transitionDuration]=`${durationTime}ms`;
          this.$refs.middleL.style[transitionDuration]= `${durationTime}ms`;
          this.$refs.middleL.style.opacity=opacity;
        },
        loop(){
              this.currentTime=0;
              if(JSON.stringify(this.currenlyricObj)!=="{}"){
                  this.currenlyricObj.seek(this.currentTime*1000)
              }
              this.$refs.audio.play();
        },
        songEnd(){
              if(this.mode===playMode.loop){
                    this.loop()
              }else{
                    this.next();
              }
        },  
        onClickProgressBar(percent){
          this.currentTime=this.currentSong.during*percent;
          this.$refs.audio.currentTime=this.currentTime;
          if(!this.playing){
              this.togglePlaying();//当暂停的时候 拖动进度条 播放
          }
          if(JSON.stringify(this.currenlyricObj)!=="{}"){
            this.currenlyricObj.seek(this.currentTime*1000)
          }
        },
        timeupdate(e){
          //console.log(e.target.currentTime);
          this.currentTime=e.target.currentTime;
        },
        formatTime(interval,n=2){
            let m=Math.floor(interval/60);
            let s=Math.floor(interval%60);
            if((s+"").length<n){
              s="0"+s;
            }
            return `${m}:${s}`
        },
        prev(){
          if(!this.songReady){
                return;
           }
           if(!this.playing){
            this.togglePlaying()
          }
          if(this.playList.length===1){
            this.loop();
            return
          }else{
            let index =this.currentIndex-1;
            if(index==-1){
              index=this.playList.length-1;
            }
            this.setCurrentIndex(index)
            this.songReady=false
          }
        },
        next(){
          if(!this.songReady){
                return;
          }
          if(!this.playing){
            this.togglePlaying()
          }

          if(this.playList.length===1){
            this.loop();
            return
          }else{
            let index =this.currentIndex+1;
            if(index==this.playList.length){
              index=0;
            }
            this.setCurrentIndex(index)
            this.songReady=false
          }
        },
        back(){
            this.setFullScreen(false)
        },
        open(){
            this.setFullScreen(true)
        },
        ...mapMutations({
           setFullScreen: "SET_FULL_SCREEN",
           setPlayState:"SET_PLAYING_STATE",
        }),
        enter(el,done){
            const {x,y,scale}=this._getPosAndScale();
            let animation={
                0:{
                    transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                },
                60:{
                    transform: `translate3d(0,0,0) scale(1.1)`
                },
                100:{
                    transform: `translate3d(0,0,0) scale(1)`
                }
            };
            animations.registerAnimation({
                name:"move",
                animation,
                presets:{
                    duraing:400,
                    easing: 'linear'
                }
            });
            animations.runAnimation(this.$refs.cdWrapper, 'move', done)
        },
        afterEnter(){
            animations.unregisterAnimation("move"),
            this.$refs.cdWrapper.style.animation=""
        },

        leave(el,done){
            this.$refs.cdWrapper.style.animation="all .4s";
            const {x,y,scale} =this._getPosAndScale();
            this.$refs.cdWrapper.style[transform]=`translate3d(${x}px,${y}px,0) scale(${scale})`;
            this.$refs.cdWrapper.addEventListener('transitionend', done)
        },
        afterLeave(){
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style[transform] = ''
        },
        _getPosAndScale(){
            const targetWidth=40;
            const paddingLeft=40;
            const paddingTop=80;//大图片的top
            const paddingBottom=30;
            const width=window.innerWidth*0.8;
            const height=window.innerHeight
            const x=-(window.innerWidth/2-paddingLeft);
            const y =height-paddingBottom-width/2-paddingTop;
            const scale=targetWidth/width;
            return {x,y,scale}
        },
        togglePlaying(){
          //歌曲没加载时 play-icon不变
          if(!this.songReady){
              return ;
          }
          //暂停歌曲时 歌词也暂停
          if(JSON.stringify(this.currenlyricObj)!=="{}"){
              this.currenlyricObj.togglePlay();
          }
          this.setPlayState(!this.playing);

          
        },
        ready(){
          //使用play事件的原因是 修改暂停/播放状态的时候 需要校验ready是否准备好 
          //如果使用canplay事件会导致ready先执行 如果此时快速点击暂停按钮 这时play方法还没有执行
          //就会导致点击暂停按钮 还会有播放音乐
          this.songReady=true;
          this.savePlayHistort(this.currentSong);
        },
        error(){
          this.songReady=true
        },
        _getLyric(newSong){
            getLyric(newSong.mid).then((res)=>{
                if(this.currentSong.id!==newSong.id){
                  return
                }
                if(Array.isArray(res.lyric)&&res.lyric.length==0){
                  this.notLyric=true;
                  return 
                }
                var lyric = Base64.decode(res.lyric)
                this.currenlyricObj=new Lyric(lyric,this.handle);
                if(this.playing){
                  this.currenlyricObj.play();
                  if(this.currentTime>0){
                    this.currenlyricObj.seek(this.currentTime*1000)
                  }
                }
              }).catch((error)=>{
                console.log(error);
              })
        },
        handle({lineNum,txt}){
            
            this.currentLineNum=lineNum
            if(lineNum>5){
                let toggleEl = this.$refs.lyricLine[lineNum-5];
                this.$refs.lyricList.scrollToElement(toggleEl);//当歌词来到大于第五行的时候 顶部显示当前行数-5
            }else{
              this.$refs.lyricList.scrollTo(0,0,1000)
            }
            this.playingLyric=txt
        }
    },
    watch:{
        currentSong(newSong,oldSong){
         
          if(!newSong.id){
                return
            }
          if(oldSong.id===newSong.id){
              return
          }
          //防止前进 后退歌曲时 歌词跳动
          if(JSON.stringify(this.currenlyricObj)!=="{}"){
            this.currenlyricObj.stop();
          }
          clearTimeout(this.timer)
          this.timer=setTimeout(()=>{
              this.$refs.audio.src=newSong.url;
              this.$refs.audio.play();
              this._getLyric(newSong);
          },1000)
        },
        playing(){
            this.$nextTick(()=>{
              const audio = this.$refs.audio;
              this.playing?audio.play():audio.pause()
            })

        },
    },
    components:{
        progressBar,
        progressCircle,
        scroll,
        playList
    }
    
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin" 
 .player
    .normal-player
        position: fixed
        left: 0
        right: 0
        top: 0
        bottom: 0
        z-index: 300
        background: $color-background
     .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all .4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        height:34px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
          .icon-playlist
            display: inline-block;
            margin-top: -4px;
      
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
@keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)          
</style>
