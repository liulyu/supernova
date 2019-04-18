<template>
  <div class="progress-bar" ref="progressBar" @click="clickProgreeBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" 
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from "common/js/dom"
const transform =prefixStyle("transform");
const PROGRESS_BARWIDTH=16
export default {
  props:{
    percent:{
      type:Number,
      default:0
    }
  },
  created(){
    this.touch={};
  },
  methods:{
    progressTouchStart(e){
        /**this.$refs.progressBar.getBoundingClientRect().left;播放条元素到最左边的距离
         * 
         */
        this.touch.inital=true
        this.touch.touchX = e.touches[0].pageX;//
        this.touch.left=this.$refs.progress.clientWidth;//此时已经播放的黄色进度条的长度;
    },
    progressTouchMove(e){
        if(!this.touch.inital){
          return
        }
        let moveWidth=e.touches[0].pageX-this.touch.touchX;
        this.touch.offset=Math.min(Math.max(0,moveWidth+this.touch.left),this.$refs.progressBar.clientWidth-PROGRESS_BARWIDTH)
        this._percentMove(this.touch.offset)
   },
    progressTouchEnd(){
      this.changePercent();
      this.touch.inital=false
    },
    clickProgreeBar(e){
        let  rect = this.$refs.progressBar.getBoundingClientRect();
        let offsetWidth = e.pageX-rect.left;
        console.log(offsetWidth);
        
        if(offsetWidth<=this.$refs.progressBar.clientWidth){
          this._percentMove(offsetWidth);
          this.changePercent()
        }
    },

    changePercent(){
          let barWidth=this.$refs.progressBar.clientWidth-PROGRESS_BARWIDTH;
          this.$emit("percent",this.$refs.progress.clientWidth/barWidth);
    },

    _percentMove(width){
        this.$refs.progressBtn.style[transform]=`translate3d(${width}px,0,0)`
        this.$refs.progress.style.width=width+"px"
    }
  },
  watch: {
    percent(newPrecent){
      if( !this.touch.inital){
        var clientWidth=this.$refs.progressBar.clientWidth-PROGRESS_BARWIDTH;
        var width = clientWidth*newPrecent;
        this._percentMove(width)
      }
    }
  },  
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>