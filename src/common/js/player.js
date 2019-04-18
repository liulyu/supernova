export default function shuffle(input){
    var  list=[].concat(input);//不要直接使用= 不然一个数组改变 另外一个数组也会改变
    for (var index = list.length-1;  index>=0 ; index--) {
        var randomIndex = Math.floor(Math.random()*(index+1));
        var randomItem=list[randomIndex];
        list[randomIndex]=list[index];
        list[index]=randomItem;
    }
    return list
}