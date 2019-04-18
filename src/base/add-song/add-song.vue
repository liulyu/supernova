<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="onClose">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="serachBox"  placeholder="搜索歌曲" @query="onQueryChange"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :titles="titles" :currentIndex="currentIndex" @onChangeIndex="onChangeIndex"></switches>
        <div class="list-wrapper">
            <scroll class="list-scroll" v-if="currentIndex==0" ref="playHistoryScroll">
                <div  class="list-inner">
                    <songList :songs="playHistory" @select="selectItem"></songList>
                </div>
            </scroll>
            <!-- 使用v-if是使该dom不渲染 -->
            <scroll class="list-scroll" v-if="currentIndex==1" ref="searchHistoryScroll">
                <div  class="list-inner">
                    <searchList :searches="searchHistory" @select="addQuery" @delete="deleteOneHistory"></searchList>
                </div>
            </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @setSearchHistory="selectSuggest" ></suggest>
      </div>
      <topTip ref="topTip">
          <div class="tip-title">
            <i class="icon-ok"></i>
            <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </topTip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'base/suggest/suggest'
  import switches from 'base/switches/switches';
  import scroll from 'base/scroll/scroll';
  import songList from 'base/songList/songList';
  import searchList from 'base/search-list/search-list';
  import topTip from 'base/top-tip/top-tip';
  import {mapGetters, mapActions} from 'vuex'
  import {searchMixins} from 'common/js/mixins';
  export default {
    data() {
      return {
        showFlag: false,
        showSinger: false,
        query:"",
        titles:[
            {name:"最近播放"},
            {name:"搜索历史"}
        ],
        currentIndex:0
      }
    },
    computed:{
        ...mapGetters([
            "playHistory","searchHistory"
        ])
    },
    
    mixins:[searchMixins],
    
    methods: {
      selectSuggest(item){
          this.saveHistory(item);
          this.$refs.topTip.show();
      },  
      ...mapActions([
          "insertSuggestSong"
      ]),
      selectItem(song){
          this.insertSuggestSong(song);
          this.$refs.topTip.show();
      },  
      onChangeIndex(index){
          this.currentIndex=index
      },  
      show(){
        this.showFlag=true
        if(this.currentIndex===0){
            this.$refs.playHistoryScroll.refresh();
        }else{
            this.$refs.searchHistoryScroll.refresh();
        }
      },
      onClose(){
          this.showFlag=false;
      },  
      
      hide() {
        this.showFlag = false
      },
      
    },
    components: {
      SearchBox,
      Suggest,
      switches,
      scroll,
      songList,
      searchList,
      topTip
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>