<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input type="text" v-model="query" :placeholder="placeholder" class="box">
        <i class="icon-dismiss" @click="clear"></i>
    </div>
</template>

<script>
import {debounce} from "common/js/search"
export default {
    data(){
        return{
            query:"" 
        }
    },

    props:{
        placeholder:{
            type:String,
            default:"搜素歌手,歌曲"
        }
    },

    methods:{
        clear(){
            this.query="";
        },

        setQuery(key){
            this.query=key
        }
        
    },
    created() {
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 500))
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
