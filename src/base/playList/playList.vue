<template>
  <transition name="list-fade">
    <div class="playlist" @click="hide" v-show="showFlag">
        <!-- @click.stop阻止该区域事件冒泡 -->
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="clearPlayList"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll class="list-content" ref="listContent">
            <transition-group name="list" tag="ul">
            <li ref="listItem" class="item" v-for="(item,index) in sequenceList" :key="item.id" >
              <i :class="currentPlayIcon(item)"  class="current"></i>
              <span class="text" @click="playCurrentSong(item,index)">{{item.name}}</span>
              <span  class="like" @click="toggleFavorite(item)">
                <i :class="getFavorite(item)" ></i>
              </span>
              <span  class="delete" @click.stop="deleteOne(item,index)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>   
        <div class="list-operate">
          <div  class="add">
            <i class="icon-add"></i>
            <span class="text" @click="showAddSong">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表!" @confirm="sure" ></confirm>
      <addSong ref="addSong" @hidePlayList="hidePlayList"></addSong>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import scroll from "base/scroll/scroll"
  import {playMode} from 'api/config'
  import {mapGetters,mapMutations,mapActions} from "vuex"
  import confirm from "base/confirm/confirm"
  import {player} from "common/js/mixins"
  import addSong from "base/add-song/add-song"
  export default {
    data() {
      return {
        showFlag: false,
      }
    },
    mixins:[player],
    computed:{
        ...mapGetters([
            "sequenceList","currentSong","playList","mode","playing"
        ]),
        modeText(){
            return playMode.sequence==this.mode ? "顺序播放" :playMode.loop==this.mode?"单曲播放":playMode.random==this.mode?"随机播放":""
        }
    },
    methods: {
      hidePlayList(){
        this.showFlag=false
      },
      showAddSong(){
          this.$refs.addSong.show();
      },
      sure(){
          this.clearCurrentPlayList();
          this.showFlag=false;
      }, 
      clearPlayList(){
          this.$refs.confirm.show();
      },
      deleteOne(item,index){
          this.deleteSong({item,index});
          if(!this.playList.length){
              this.hide();
          }
      },  
      scrollTolistItem(item){
         let index =  this.sequenceList.findIndex((song)=>{
              return song.id===item.id
          });
          this.$refs.listContent.scrollToElement(this.$refs.listItem[index],200);
      }, 
      ...mapMutations({
          setCurrentIndex:"SET_CURRENT_INDEX",
          setPlaying:"SET_PLAYING_STATE"
      }),
      ...mapActions(["deleteSong","clearCurrentPlayList"]),
      playCurrentSong(item,index){
         if(playMode.random===this.mode){
              index = this.playList.findIndex((song)=>{
                return item.id===song.id
            });
         }
         this.setCurrentIndex(index);
         this.setPlaying(true)
      },
      currentPlayIcon(item ){
          if(this.currentSong.id===item.id){
              return "icon-play"
          }
          return ""
      },
      show() {
        this.showFlag = true;
        this.$nextTick(()=>{
            this.$refs.listContent.refresh()
            this.scrollTolistItem(this.currentSong);
        })
      },
      hide() {
        this.showFlag = false
      },
      
    },
    watch:{
        currentSong(newSong,oldSong){
            //使用id是因为数组为空时返回一个空对象 不是false
            if(!newSong.id){
                return
            }
            if(!this.showFlag || newSong.id===oldSong.id ){
                return;
            }
            this.scrollTolistItem(newSong);
        }
    },
    components: {
        scroll,
        confirm,
        addSong
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 999
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>