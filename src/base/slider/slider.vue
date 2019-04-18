<template>
    <div class="slider" ref="slider">
        <div class="sliderGroup" ref="sliderGroup">
            <slot>
            </slot>
        </div>

        <div class="dots" >
            <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex===index}"></span>
        </div>
    </div>
</template>
<script>
 import  bScroll from 'better-scroll'
 import addClass from "common/js/dom"
export default {
   name:"slider",
   data(){
       return{
           dots:[],
           currentPageIndex:0
       }
   },
   props:{
       loop:{
           type:Boolean,
           default:true
       },

       autoPlay:{
           type:Boolean,
           default:true
       },

       interval:{
           type:Number,
           default:4000
       }
   },

   mounted(){
       this.$nextTick(()=>{
            this._setSliderWidth();
            this.initDots();
            this._initSlider();
            if(this.autoPlay){
                this._play();
            }
        })
       window.addEventListener("resize",()=>{
           if(!this.slider){
               retrun;
           }

           this._setSliderWidth(true);
           this.slider.refresh()
       })
   },

   methods:{
       _setSliderWidth(isResize){
           this.childs = this.$refs.sliderGroup.children;
           var sliderWidth = this.$refs.slider.clientWidth;
           var width=0;
           for (let index = 0; index < this.childs.length; index++) {
               const element = this.childs[index];
               addClass(element,"slider-item")
               element.style.width=sliderWidth+"px";
               width+=sliderWidth;
           }
           if(this.loop&&!isResize){
               width+=2*sliderWidth
           }
        
           this.$refs.sliderGroup.style.width=width+"px"
       },
      
      _initSlider(){
          this.slider=new bScroll(this.$refs.slider,{
              scrollX:true,
              scrollY:false,
              momentum:false,
              snap: {
                loop: this.loop, // 循环
                threshold: 0.3,
                speed: 400 // 轮播间隔
                },
              click:true
          }),

          this.slider.on("scrollEnd",()=>{
              var pageIndex = this.slider.getCurrentPage().pageX;
              
              this.currentPageIndex=pageIndex;
              //console.log("_initSlider"+this.currentPageIndex);
              if(this.autoPlay){
                clearTimeout(this.timer);
                this._play()
          }
          })

          
      },

      initDots(){
          this.dots=new Array(this.childs.length)
      },

      _play(){
          var pageIndex=this.currentPageIndex;
          if(this.loop){
              if(pageIndex===4){
                  pageIndex=0
              }else{
                  pageIndex+=1
              }
          }
          //console.log("play:"+pageIndex);
          this.timer = setTimeout(()=>{
              this.slider.goToPage(pageIndex,0,400)
          },this.interval)
      }

   }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .sliderGroup
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
        
    .dots
        position: relative
        right: 0
        left: 0
        bottom: 12px
        text-align: center
        font-size: 0
        .dot
            display: inline-block
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background :$color-text-l  
            &.active
                width:15px
                border-radius:5px
                background:$color-text-ll
</style>