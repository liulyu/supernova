<template>
 <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" class="item" v-for="(song, index) in songs" :key="index">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{song.singer}}<span v-show="song.album">·{{song.album}}</span></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
    props:{
        songs:{
            type:Array,
            default:()=>[]
        },
        rank:{
          type:Boolean,
          default:false
        }
    },
    
    methods:{
      selectItem(song,index){
        this.$emit("select",song,index)
      },
      getRankCls(index){
          if(index<=2){
            return `icon icon${index}`
          }else{
            return "text"
          }
      },
      getRankText(index){
          if(index>2){
            return `${index}`
          }
      }
    }
}
</script>

<style lang="stylus" scoped>
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
    .song-list
        .item
            display: flex
            align-items: center
            height: 64px
            flex-flow:row nowrap
            .rank
              flex: 0 0 25px
              width: 25px
              margin-right: 30px
              text-align: center
              .icon
                display: inline-block
                width: 25px
                height: 24px
                background-size: 25px 24px
                &.icon0
                  bg-image('first')
                &.icon1
                  bg-image('second')
                &.icon2
                  bg-image('third')
                .text 
                  color: @color-theme
                  font-size: @font-size-large  
           
            .content
              flex: 1
              line-height: 20px
              overflow: hidden
              .name
                  color:$color-text
                  font-size:$font-size-medium
              .desc  
                  color:$color-text-d
                  font-size:$font-size-medium 
</style>
