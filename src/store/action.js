import * as types from './mutation-type'
import {playMode} from "api/config"
import shuffle from "common/js/player"
import {saveSearchHistory,deleteOne,clearArr,savePlayHistory,saveFavoriteSong,deleteFavoriteSong}  from 'common/js/cache'
function findIndex(list,song){
    return list.findIndex((item)=>{
        return item.id===song.id
    })
}
export const selectPlay = function({commit},{list,index}){
    commit(types.SET_SEQUENCE_LIST,list),
    commit(types.SET_PLAYLIST,list),
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}
//点击随机播放歌曲
export const randomPlay=function({commit},{list}){
    let randomList=shuffle(list)
    commit(types.SET_SEQUENCE_LIST,list),
    commit(types.SET_PLAYLIST,randomList),
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_CURRENT_INDEX, 0)
}
//点击搜索出的结果播放歌曲 
export const insertSuggestSong=function({commit,state},song){
    let playList=state.playList.slice();
    let sequenceList=state.sequenceList.slice();
    let currentIndex=state.currentIndex;
    //获取当前歌曲的索引
    let currentSong=playList[currentIndex];

    let findSongIndex = findIndex(playList,song);
    //是插入歌曲 把点击的歌曲放在当前播放歌曲的后面 索引加1
    currentIndex++;
    playList.splice(currentIndex,0,song);
    //如果已经包含这首歌
    if(findSongIndex>-1){
        //如果插入的序号大于之前所在的序号
        if(currentIndex>findSongIndex){
            playList.splice(findSongIndex,1);
            currentIndex--;
        }else{
            playList.splice(findSongIndex+1,1);
        }
    }

    //当前播放歌曲所在的索引
    let currentsIndex=findIndex(sequenceList,currentSong)+1;
    //点击的歌曲所在的索引
    let fsIndex=findIndex(sequenceList,song);
    //把点击的歌曲加入到循环list中
    sequenceList.splice(currentsIndex,0,song);
    //如果点击的歌曲已经在序列中了
    if(fsIndex>-1){ 
        if(currentsIndex>fsIndex){
            sequenceList.splice(fsIndex,1);
        }else{
            sequenceList.splice(fsIndex+1,1)
        }
    };
    commit(types.SET_PLAYLIST,playList)
    commit(types.SET_SEQUENCE_LIST,sequenceList)
    commit(types.SET_CURRENT_INDEX,currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

//把搜索记录保存在本地存储和vuex中
export function saveHistory({commit},query){
   let arr =  saveSearchHistory(query);
   commit("SET_SEARCH_HISTORY",arr)
}
//删除搜索历史的某一条数据
export function deleteOneHistory({commit},query){
    let arr = deleteOne(query);
    commit("SET_SEARCH_HISTORY",arr);
}
//清空搜索历史的数据
export function clearSearchHistory({commit}){
    let arr = clearArr();
    commit("SET_SEARCH_HISTORY",arr);
}

//删除播放列表的某个数据
export function deleteSong({commit,state},{item,index}){
    let playList = state.playList.slice();
    let sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;
    let pIndex = playList.findIndex((song)=>{
        return song.id===item.id
    });
    
    playList.splice(pIndex,1);
    sequenceList.splice(index,1);
    if(pIndex<currentIndex || currentIndex===playList.length){
        currentIndex--
    }

    commit("SET_PLAYLIST",playList);
    commit("SET_SEQUENCE_LIST",sequenceList);
    commit("SET_CURRENT_INDEX",currentIndex);
    if(sequenceList.length){
        commit("SET_PLAYING_STATE",true);
    }else{
        commit("SET_PLAYING_STATE",false);
    }
}
//清空播放列表
export function clearCurrentPlayList({commit}){
    commit("SET_PLAYLIST",[]);
    commit("SET_SEQUENCE_LIST",[]);
    commit("SET_CURRENT_INDEX",-1);
    commit(types.SET_PLAYING_STATE, false)
}

//把播放的歌曲添加到最近播放列表中
export function savePlayHistort({commit},song){
    commit(types.SET_PLAY_HISTORY,savePlayHistory(song));
}

//保存喜爱的歌曲
export function saveOneFavoriteSong({commit},song){
    commit(types.SET_FAVORITE_SONG,saveFavoriteSong(song))
}
//删除喜爱歌曲
export function deleteOneFavoriteSong({commit},song){
    commit(types.SET_FAVORITE_SONG,deleteFavoriteSong(song))
}