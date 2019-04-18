import {playMode} from "api/config"
import {loadSearchList,loadPlayHistory,loadFavoriteSong} from 'common/js/cache';
const state={
    singer:{},
    playing:false,
    fullScreen:false,
    playList:[],
    sequenceList:[],
    mode:playMode.sequence,
    currentIndex:-1,
    disc:{},
    rankDisc:{},
    searchHistory:loadSearchList(),
    playHistory:loadPlayHistory(),
    favoriteSong:loadFavoriteSong()
}


export default state