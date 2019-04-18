<template>
    <transition name="slide">
            <musicList :name="disc.dissname" :bg_image="disc.imgurl" :songs="songs" ></musicList>
    </transition>
</template>

<script>
import {getSonglistDetail} from "api/detail"
import {mapGetters} from "vuex"
import musicList from "base/musicList/musicList"
import {processSongsUrl} from "api/handlesongurl"
import {ERR_OK} from "api/config"
import {createSong} from "common/js/song"
export default {
    data(){
        return {
            songs:[],
            detail:"detail"
    }},
    computed:{
        ...mapGetters([
            "disc"
        ])
    },
    mounted(){
        this._initDiscDetail(this.disc.dissid);
    },
    methods:{
        _initDiscDetail(id){
            if(!id){
                this.$router.push("/Recommend")
                return
            }
            getSonglistDetail(id).then((res)=>{
                if(ERR_OK===res.code){
                    processSongsUrl(this._normalData(res.cdlist[0].songlist)).then((songs)=>{
                        this.songs=songs;
                        console.log(this.songs);
                    })
                }
            })
        },

        _normalData(songs){
            var ret=[];
            songs.forEach((item)=>{
                ret.push(createSong(item))
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
