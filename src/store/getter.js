export const singer=state=>state.singer
export const playing=state=>state.playing
export const fullScreen=state=>state.fullScreen
export const playList=state=>state.playList
export const sequenceList=state=>state.sequenceList
export const currentIndex=state=>state.currentIndex
export const mode=state=>state.mode
export const disc=state=>state.disc
export const rankDisc=state=>state.rankDisc
export const currentSong=(state)=>{
    return state.playList[state.currentIndex] || {}
}

export const searchHistory=state=>state.searchHistory
export const playHistory=state=>state.playHistory
export const favoriteSong=state=>state.favoriteSong