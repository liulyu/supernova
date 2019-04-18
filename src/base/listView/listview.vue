<template>
  <scroll :data="data" 
  class="listview"
  ref="listview"
  @scroll="scroll"
  :probeType="probeType"
  :listenScroll="listenScroll">
    <ul>
      <li v-for="(group,index) in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item" @click="selectOne(item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
      <!-- @touchmove.stop.prevent在移动字母导航的时候禁止页面整体的滚动 因为滚动就是touchmove的默认事件-->
      <ul class="list-shortcut"  @touchstart.prevent="onShortcutTouchStart" @touchmove.prevent="onShortcutTouchMove">
        <li v-for="(item, index) in shortcutList"  class="item" :index-data=index :key="index" :class="{'active':index===currenIndex}">
           {{item}}
        </li>
      </ul>

      <div class="list-fixed" v-show="fixed_title" ref="fixedTop">
          <h2 class="fixed-title">{{fixed_title}}</h2>
      </div>

     <div class="loading-container" v-show="!data.length">
        <load></load>
      </div> 
  </scroll>
    
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  import load from "base/load/loading"
  const TITLE_HEIGHT = 30
  const ANCHOR_HEIGHT =17  //字母索引之间的距离间隔
  const FIXED_HEIGHT=30
  export default {
    data(){
      return{
        scrollY:-1,
        currenIndex:0,
        diff:0 //下一个要显示的fixed_title和已经显示的fixed_title之间的距离 完全重合就是0
      }
    },
    created(){
      this.touch={};
      this.listHeight = [];
      this.probeType=3
      this.listenScroll=true;
    },
    props: {
      data: {
        type: Array,
        default: [],
      },
    },

   watch:{
     //想要在watch中观测的数据 就要放在data选项中 不能再created中定义
     data(){
       this.$nextTick(()=>{
         this.getSingerHeightArray();
       })
     },

     scrollY(newY){
       let listHeight=this.listHeight
        if(newY>0){
          this.currenIndex=0;
          return;
        }

        for (let i = 0; i < listHeight.length-1; i++) {
          let y1=listHeight[i];
          let y2=listHeight[i+1];
          if(y2 && (-newY>=y1 && -newY<y2)){
            this.currenIndex=i;
            this.diff=y2+newY;
            return 
          }
        };

        //this.currenIndex=listHeight.length-2
     },
     diff(newDiff){
       //如果下一个title进入到了之前固定的title中 得到具体的值 不然返回0
       let fixedTop=newDiff>=0 && newDiff<FIXED_HEIGHT ? newDiff-FIXED_HEIGHT:0;
       this.$refs.fixedTop.style.transform=`translate3d(0,${fixedTop}px,0)`
     }
   
   },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      //如果顶部向下拉 不显示fixed_title
      fixed_title(){
        if(this.scrollY>0){
          return "";
        }
        return this.data.length && this.data[this.currenIndex].title
      }
    },
   
    created() {
      this.probeType = 3        //better-scroll配置
      this.listenScroll = true  //传给scroll组件是否监听滚动
      this.touch = {}
      this.listHeight = []      //每个歌手li的高度组成的集合
    },
    methods: {
      refresh(){
        this.$refs.listview.refresh();
      },
      onShortcutTouchStart(e) {
        let anchorIndex = parseInt(getData(e.target, 'index'));
        this.touch.anchorIndex=anchorIndex;
        var firstTouch = e.touches[0].pageY;
        this.touch.y1=firstTouch;
        this.scrollTo(anchorIndex)
      },
      
      onShortcutTouchMove(e){
        var firstTouch = e.touches[0];
        this.touch.y2=firstTouch.pageY;
        let moveNum = Math.floor((this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT);
        this.scrollTo(this.touch.anchorIndex+moveNum)
      },

      scrollTo(index){
        //前两个判断是滑动过程中超出导航区域 手动固定
        //后一个判断是点击超出字母导航区域 本来getData的是null parseInt之后变成NaN
        if(index<0 || index>this.listHeight.length-2 ||Number.isNaN(index)){
          return
        }
        this.currenIndex=index;
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
      },

      scroll(pos){
        this.scrollY=pos.y
      },
      //得到每个字母对应的歌手li的高度组成的数组
      getSingerHeightArray(){
          let height=0;
          let listItem = this.$refs.listGroup;
          this.listHeight.push(height)
          for (let i = 0; i < listItem.length; i++) {
            const element = listItem[i];
            var cheight = element.clientHeight;
            height+=cheight;
            this.listHeight.push(height)
          }
      },
      selectOne(item){
        this.$emit("item",item)
      }
    },
  
    components: {
      Scroll,
      load
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.active
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

