<template>
  <div class="recommend" ref="recommend">
    <scroll  class="recommend-content" :data="discList" ref="scroll">
        <div>
          <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
         <slider>
            <div v-if="recommends.length" v-for="item in recommends">
              <a :href="item.linkUrl">
                <img class="needsclick"  :src="item.picUrl" @load="loadImg">
              </a>
            </div>
         </slider>  
        </div>

        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item" @click="toDetail(item)">
              <div class="icon">
                  <img  alt="" width="60px" height="60px"  v-lazy="item.imgurl" class="needsclick">
              </div>

              <div class="text">
                  <h3 class="name" v-text="item.creator.name"></h3>
                  <p class="desc" v-text="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
        </div>
          <div class="load" v-show="!discList.length">
             <load></load>
        </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend,getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import slider from 'base/slider/slider'
  import scroll from 'base/scroll/scroll'
  import load from 'base/load/loading'
  import {playmixins} from 'common/js/mixins';
  import {mapMutations} from "vuex"
  export default {
    data() {
      return {
          recommends:[],
          discList:[]
      }
    },
    mixins:[playmixins],
    created() {
          this._getRecommend();
          this._getDiscList();
    },
    destroyed() {
        clearTimeout(this.timer)
    },
    methods: {
      ...mapMutations([
        "SET_DISC"
      ]),
      toDetail(item){
          this.$router.push({path:`/Recommend/${item.dissid}`})
          this.SET_DISC(item);
      },
      handlePlaylist(playlist){
            let b =playlist.length>0 ? 60 :0;
            this.$refs.recommend.style.bottom=b+"px";
            this.$refs.scroll.refresh();
        },

      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          } else {
            console.log('没,没有推荐')
          }
        })
      },

      loadImg(){
          this.$refs.scroll.refresh();
      }
    },
    components: {
        slider,
        scroll,
        load
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
   .recommend
      position: fixed
      width: 100%
      top: 88px
      bottom: 0
     .recommend-content
        height:100%
        overflow:hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 40px
          line-height: 40px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
          margin-bottom :-10px
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: space-between
            flex: 1
            line-height: 40px
            overflow: hidden
            font-size: $font-size-medium
            .name
              color: $color-text
              margin-bottom :-5px
            .desc
              color: $color-text-d
    .load
      position absolute
      top 50%
      width 100%
      transform translate(0,-50%)    
</style>