<template>
    <div class="search">
        <div class="search-box-wrap">
                <serachBox ref="serachBox" @query="onQueryChange"></serachBox>
        </div>
        <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
            <scroll class="shortcut" :data="shortcut" ref="shortcut">
                <div>
                    <div class="hot-key">
                        <h1 class="title">热门搜索</h1>
                        <ul>
                            <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
                                <span>{{item.k}}</span>
                            </li>
                        </ul>
                    </div>
                
                    <div class="search-history" v-show="searchHistory && searchHistory.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="_clearSearchHistory">
                                <i class="icon-clear" ></i>
                            </span>
                        </h1>
                        <searchList  :searches="searchHistory" @select="addQuery" @delete="deleteOneHistory"></searchList>
                    </div>
                </div>
            </scroll>   
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <suggest  ref="suggestList" :query="query" @setSearchHistory="saveHistory"></suggest>
        </div> 
        <confirm text="是否清空所有搜索记录!" ref="isConfirm"  @confirm="confirm"></confirm>
        <router-view></router-view> 
    </div>
</template>

<script>
import serachBox from "base/search-box/search-box"
import suggest from "base/suggest/suggest"
import {getHotKey} from "api/search"
import {ERR_OK} from 'api/config'
import scroll from "base/scroll/scroll"
import searchList from "base/search-list/search-list"
import confirm from "base/confirm/confirm"
import {mapActions,mapGetters} from 'vuex';
import {playmixins,searchMixins} from 'common/js/mixins';
export default {
    data(){
        return{
            hotKey:[],
            query:"",
        }
    },
    mixins:[playmixins,searchMixins],
    computed:{
        ...mapGetters([
            "searchHistory",
        ]),
        shortcut(){
            return this.hotKey.concat(this.searchHistory)
        }
    },
    watch:{
        query(newQuery){
            this.$nextTick(()=>{
                if(!newQuery){
                    this.$refs.shortcut.refresh();
                }
            })
        }
    },
    components:{
        serachBox,
        suggest,
        searchList,
        confirm,
        scroll
    },
    methods:{
        handlePlaylist(playlist){
            let b =playlist.length>0 ? 60 :0;
            this.$refs.shortcutWrapper.style.bottom=b+"px";
            this.$refs.shortcut.refresh();

            this.$refs.searchResult.style.bottom=b+"px";
            this.$refs.suggestList.refresh();//不能直接操作scroll组件的refresh的方法 需要在suggest组件先调用
        },
        confirm(){
            this.clearSearchHistory();
        },
        _clearSearchHistory(){
            this.$refs.isConfirm.show();
        },
        ...mapActions([
            "saveHistory",
            "deleteOneHistory",
            "clearSearchHistory"
        ]),
        
        
        
        _getHotKey(){
            getHotKey().then((res)=>{
                if(res.code===ERR_OK){
                    this.hotKey=res.data.hotkey.splice(0,10)
                }
            }).catch((err)=>{
                console.log(err);
            })
        }
    },

    created(){
        this._getHotKey();
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
        .search
            .search-box-wrap
                margin:20px
            .shortcut-wrapper
                position: fixed
                top: 178px
                bottom: 0
                width: 100%
                .shortcut
                    height:100%
                    overflow:hidden
                    .hot-key
                        margin: 0 20px 20px 20px
                        .title
                            margin-bottom: 20px
                            font-size: $font-size-medium
                            color: $color-text-l
                        .searchHistory
                            height:100%
                            overflow hidden    
                        .item
                            display: inline-block
                            padding: 5px 10px
                            margin: 0 20px 10px 0
                            border-radius: 6px
                            background: $color-highlight-background
                            font-size: $font-size-medium
                            color: $color-text-d
            .search-history
                position: relative
                margin: 0 20px
                .title
                    display: flex
                    align-items: center
                    height: 40px
                    font-size: $font-size-medium
                    color: $color-text-l
                    .text
                       flex: 1
                    .clear
                       extend-click()
                    .icon-clear
                        font-size: $font-size-medium
                        color: $color-text-d            
            .search-result
                position: fixed
                width: 100%
                top: 178px
                bottom: 20px          
</style>
