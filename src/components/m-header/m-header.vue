<template>
    <div class="m-header">
        <div class="icon"></div>
        <h1 class="text">autumn-rain-music</h1>
        <router-link to="/user" tag="div" class="mine">
            <span class="icon-mine"></span>
        </router-link>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
    
    .m-header
        position relative
        height :44px
        text-align :center
        color:$color-theme
        font-size 0
     .icon 
         display inline-block
         bg-image('logo') 
         height  32px
         width 30px
         background-size 30px 32px
         vertical-align: top
         margin-top: 6px
         margin-right 6px

      .text 
        display inline-block
        vertical-align: top
        line-height: 44px
        font-size: $font-size-large  
        margin:0
      .mine
        position: absolute
        top: 0
        right: 0
      .icon-mine
    //   行内元素的padding和margin属性无效
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>
