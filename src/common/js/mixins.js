import {mapGetters,mapMutations,mapActions} from "vuex"
import {playMode} from "api/config"
import shuffle from "common/js/player"
export const playmixins={
    mounted() {
        this.handlePlaylist(this.playList)
    },

    computed: {
        ...mapGetters(['playList'])
      },

    activated() {
        this.handlePlaylist(this.playList);
      },
    watch: {
        playList(newplayList){
            this.handlePlaylist(newplayList);
        }
    },
    methods : {
        handlePlaylist(playList){
            throw new Error("plaayer must implement handlePlaylist methods")
        }
    },

}

export const player={
    computed: {
        ...mapGetters([
            "currentSong",
            "playList",
            "mode",
            "sequenceList",
            "favoriteSong"
        ]),
        iconMode(){
            return this.mode===playMode.sequence ? "icon-sequence" : this.mode===playMode.loop ? "icon-loop" :
            this.mode===playMode.random ? "icon-random":""
          },
    },

    methods:{
        isFavorite(song){
            let index = this.favoriteSong.findIndex((item)=>{
                return item.id===song.id
            });
            return index>-1
        },
        toggleFavorite(song){
            let flag = this.isFavorite(song);
            if(flag){
                this.deleteOneFavoriteSong(song);
            }else{
                this.saveOneFavoriteSong(song);
            }
        },
        getFavorite(song){
            let flag =this.isFavorite(song);
            if(flag){
                return "icon-favorite"
            }else{
                return "icon-not-favorite"
            }
        },
        ...mapMutations({
            setCurrentIndex:"SET_CURRENT_INDEX",
            setPlayMode:"SET_PLAY_MODE",
            setPlayList:"SET_PLAYLIST"
        }),
        ...mapActions([
            "saveOneFavoriteSong",
            "deleteOneFavoriteSong"
        ]),
        changeMode(){
            let mode=(this.mode+1)%3;
            let playList =[];
            if(mode===playMode.random){
              playList = shuffle(this.playList);
            }else{
              playList=this.sequenceList;
            }
  
            var index = this.resetCurrentSong(playList);
            this.setPlayMode(mode);
            this.setPlayList(playList);
            this.setCurrentIndex(index)
          },

          
          resetCurrentSong(list){
            let index = list.findIndex((value)=>{
                return value.id===this.currentSong.id
            });
            return index;//直接在这个方法中把这个值返回去 
          },
    }
}

export const searchMixins={
    methods: {
        onQueryChange(item){
            this.query=item
        },
        addQuery(key){
            this.$refs.serachBox.setQuery(key);
        },
        ...mapActions([
            "saveHistory",
            "deleteOneHistory"
        ])
    },
}