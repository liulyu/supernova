import * as types from "./mutation-type"

const mutation ={
    [types.SET_SINGER](state,singer) {
        state.singer=singer;
    },
    [types.SET_PLAYING_STATE](state,playing) {
        state.playing=playing;
    },
    [types.SET_FULL_SCREEN](state,fullScreen) {
        state.fullScreen=fullScreen;
    },
    [types.SET_PLAYLIST](state,playList) {
        state.playList=playList;
    },
    [types.SET_SEQUENCE_LIST](state,sequenceList) {
        state.sequenceList=sequenceList;
    },
    [types.SET_PLAY_MODE](state,mode) {
        state.mode=mode;
    },
    [types.SET_CURRENT_INDEX](state,currentIndex) {
        state.currentIndex=currentIndex;
    },
    [types.SET_DISC](state,disc) {
        state.disc=disc;
    },

    [types.SET_RANK_DESC](state,rankDisc) {
        state.rankDisc=rankDisc;
    },

    [types.SET_SEARCH_HISTORY](state,searchHistory) {
        state.searchHistory=searchHistory;
    },

    [types.SET_PLAY_HISTORY](state,playHistory) {
        state.playHistory=playHistory;
    },
    [types.SET_FAVORITE_SONG](state,favoriteSong) {
        state.favoriteSong=favoriteSong;
    }
}

export default mutation