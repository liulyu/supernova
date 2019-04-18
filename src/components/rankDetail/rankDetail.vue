<template>
    <transition name="slide">
            <musicList :rank="rank" :name="rankDisc.topTitle" :bg_image="rankDisc.picUrl" :songs="songs"></musicList>
    </transition>
</template>

<script>
import {mapGetters} from "vuex"
import musicList from "base/musicList/musicList"
import {getRankDetail} from "api/rank"
import {ERR_OK} from 'api/config'
import {createSong} from "common/js/song"
import {processSongsUrl} from "api/handlesongurl"
export default {
    data(){
        return {
            songs:[],
            rankDetail:"rankDetail",
            rank:true
    }},
    computed:{
        ...mapGetters([
            "rankDisc"
        ])
    },
    mounted(){
        this._getRankDetail();
    },
    methods:{
        _getRankDetail(){
            if(!this.rankDisc.id){
                this.$router.push("/Rank")
                return 
            }
            getRankDetail(this.rankDisc.id).then((res)=>{
                if(res.code===ERR_OK){
                    processSongsUrl(this._normalData(res.songlist)).then((songs)=>{
                        this.songs=songs;
                    })
                }
            }).catch((error)=>{
                console.log(error);
            })
        },
        _normalData(songs){
            var ret=[];
            songs.forEach((item)=>{
                ret.push(createSong(item.data))
            });
            return ret;
        }
    },
    components:{
        musicList
    }
}
</script>

<style lang="stylus" scoped>
    .slide-enter-active, .slide-leave-active{
        transition: all 0.3s;
    }
    .slide-enter, .slide-leave-to{
        transform: translate3d(100%, 0, 0);
    }
</style>
