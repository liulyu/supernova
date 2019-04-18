import storage  from "good-storage"
const  MAX_LENGTH=15
const  SEARCH_LIST="_search_"
const  PLAY_HISTORY="_playHistory_"
const  MAX_PLAY_HISTORY_LENGTH=200
const  FAVORITE_SONG="_favorite_"
export function saveSearchHistory(query){
    let queryArr  = storage.get(SEARCH_LIST,[]);
    queryArr  = insertArr(queryArr,query,(item)=>{return item==query},MAX_LENGTH);
    storage.set(SEARCH_LIST,queryArr)
    return queryArr
}

function insertArr(arr,item,compare,max){
    let index= arr.findIndex(compare);
    if(index == 0){
        return arr; 
    }
    else if(index>0){
        arr.splice(index,1);
    }
    arr.unshift(item);
    if(max && arr.length>max){
        arr.pop();
    }
    return arr;
}   

export function loadSearchList(){
    let queryArr  = storage.get(SEARCH_LIST,[]);
    return queryArr
}
function deleteFromArray(array,compare){
    let index = array.findIndex(compare);
    if(index>-1){
        array.splice(index,1);
    }
    return array;
}
export function deleteOne(query){
    let arr=storage.get(SEARCH_LIST);
    arr = deleteFromArray(arr,(item)=>{return item==query},SEARCH_LIST);
    storage.set(SEARCH_LIST,arr)
    return arr
}

export function clearArr(){
    storage.clear();
    return []
}

export function savePlayHistory(song){
    let arr = storage.get(PLAY_HISTORY,[]);
    arr  = insertArr(arr,song,(item)=>{return item.id==song.id},MAX_PLAY_HISTORY_LENGTH);
    storage.set(PLAY_HISTORY,arr)
    return arr
}

export function loadPlayHistory(){
    return storage.get(PLAY_HISTORY,[]);
}

export function saveFavoriteSong(song){
    let arr = storage.get(FAVORITE_SONG,[]);
    arr  = insertArr(arr,song,(item)=>{return item.id==song.id},MAX_PLAY_HISTORY_LENGTH);
    storage.set(FAVORITE_SONG,arr)
    return arr
}

export function deleteFavoriteSong(song){
    let arr = storage.get(FAVORITE_SONG,[]);
    arr= deleteFromArray(arr,(item)=>{return song.id===item.id});
    storage.set(FAVORITE_SONG,arr)
    return arr
}

export function loadFavoriteSong(){
    return storage.get(FAVORITE_SONG,[]);
}