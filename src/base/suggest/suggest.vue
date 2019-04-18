<template>
    <scroll class="suggest" :pullUp="pullUp" @scrollEnd="loadMore" ref="list">
        <ul class="suggest-list"> 
            <li class="suggest-item" v-for="item in searchResult" @click="selectOne(item)">
                <div class="icon">
                    <i :class="iconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text">{{getDisplayName(item)}}</p>
                </div>
            </li>
            <div class="loadContainer" v-show="hasMore">
                <loading></loading>
            </div>
        </ul>
        <div class="no-result-wrapper" v-show="!hasMore && !searchResult.length">
                <!-- title是写死的值的时候 不用加: -->
                <noresult title="抱歉，暂无搜索结果"></noresult>
        </div>
        
    </scroll>  
</template>

<script>
import {getSuggest} from 'api/search';
import {ERR_OK} from 'api/config'
import {createSong} from "common/js/song"
import {processSongsUrl} from "api/handlesongurl"
import scroll from "base/scroll/scroll"
import loading from "base/load/loading" 
import {Singer} from 'common/js/singer';
import {mapMutations,mapActions} from 'vuex'
import noresult from "base/no-result/no-result"
const prepage=20;
const TYPE_SINGER="singer"
export default {
    data(){
        return{
            page:1,
            searchResult:[],
            pullUp:true,
            hasMore:true
        }
    },
    watch: {
        query(newQuery){
            this._search()
        }
    },
    
    props:{
        query:{
            type:String,
            default:""
        },
        showSinger: { // 是否显示歌手检索结果
            type: Boolean,
            default: true
        }
        
    },
    methods:{
        refresh(){
            this.$refs.list.refresh();
        },
        ...mapActions([
            "insertSuggestSong"
        ]),
        ...mapMutations({
            setSinger:"SET_SINGER"
        }),
        selectOne(item){
            if(item.type===TYPE_SINGER){
                let singer=new Singer({
                    id:item.singermid,
                    name:item.singername
                })
                this.$router.push({path:`/Search/${singer.id}`})
                this.setSinger(singer)
            }else{
                this.insertSuggestSong(item);
            }
            this.$emit("setSearchHistory",this.query)
        },
        loadMore(){
            if(!this.hasMore){
                return
            }
            this.page+=1;
            this.search();
        },

        _checkMore(data){
            let song=data.song;
            if(!song.list.length || (this.page*prepage)>=song.totalnum){
                this.hasMore=false;
            }
        },
        getDisplayName(item){
            if(item.type===TYPE_SINGER){
                return item.singername
            }else{
                return `${item.name}-${item.singer}`
            }
        },
        iconCls(item){
            if(item.type===TYPE_SINGER){
                return "icon-mine"
            }else{
                return "icon-music"
            }
        },

        _search(){
            this.page=1;
            this.hasMore=true;
            this.searchResult=[];
            this.search();
        },

        search(){
            getSuggest(this.query,this.page,this.showSinger,prepage).then((res)=>{
                if(res.code===ERR_OK){
                    this._normalizeSearch(res.data);
                }
            }).catch((err)=>{
                console.log(err);
            })
        },

        //格式化获取的歌手数据
        _normalizeSearch(data){
            let ret=[];
            if(data.zhida&&data.zhida.singerid){
                ret.push({...data.zhida,...{type:TYPE_SINGER}})
            }
            if(data.song){
                let songs = this._normalizeSong(data.song.list)
                processSongsUrl(songs).then((res)=>{
                   songs=res;
                   ret=ret.concat(songs);
                   this.searchResult=this.searchResult.concat(ret);
                   this._checkMore(data)
                }).catch((err)=>{
                    console.log(err);
                })
            }
        },

        _normalizeSong(songs){
            let ret=[];
            songs.forEach((song) => {
                ret.push(createSong(song))
            });
            return ret
        }
    },
    components:{
        scroll,
        loading,
        noresult
    }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

   .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
