<template>
    <transition name="slide" singer="singer">
        <musicList :songs="songs" :singer="singer" :bg_image="singer.avatar" :name="singer.name"></musicList>
    </transition>
</template>

<script>
import {mapGetters} from "vuex"
import {ERR_OK} from "api/config"
import {getSingerDetal} from "api/singer"
import {createSong} from "common/js/song"
import musicList from "base/musicList/musicList"
import {processSongsUrl} from "api/handlesongurl"
export default {
    data(){
        return{
            songs:[]
        }
    },
    computed:{
        ...mapGetters([
            "singer"
        ])
    },
    created(){
        this._getDetail(this.singer.id);
    },

    methods:{
        _getDetail(id){
            if(!id){
                this.$router.back();
                return
            }
            getSingerDetal(id).then((res)=>{
                if(res.code===ERR_OK){
                    processSongsUrl(this._normalData(res.data.list)).then((songs)=>{
                        this.songs=songs;
                    })
                }
            }).catch((err)=>{
                console.log(err);
            })
        },
        _normalData(songs){
            var ret=[];
            songs.forEach((item)=>{
                ret.push(createSong(item.musicData))
            });
            return ret;
        }
    },
    components:{
        musicList
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "~common/stylus/variable"
    

    .slide-enter-active,.slide-leave-active{
        transition:all 1s   
    }    

    .slide-enter,.slide-leave-to{
        transform translate3d(100%,0,0)    
    }
</style>
