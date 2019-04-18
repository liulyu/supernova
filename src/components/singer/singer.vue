<template>
  <div class="singer" ref="singer">
    <ListView  :data="singers" ref="list" @item="item"></ListView>
    <router-view></router-view>
  </div>
</template>

<script>
  import ListView from 'base/listView/listview'
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {Singer} from 'common/js/singer'
  import {mapMutations} from "vuex"
  import {playmixins} from 'common/js/mixins';
  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'

  export default {
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList();
    },
    mixins:[playmixins],
    methods: {
      handlePlaylist(playlist){
            let b =playlist.length>0 ? 60 :0;
            this.$refs.singer.style.bottom=b+"px";
            this.$refs.list.refresh();
        },
      item(data){
          this.$router.push({path:`/singer/${data.id}`})
          this.SET_SINGER(data);
      },
      
      ...mapMutations([
          "SET_SINGER"  //相当于this.SET_SINGER=this.$store.commit("SET_SINGER")
      ]),

      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          } 
        })
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id:item.Fsinger_mid,
              name:item.Fsinger_name
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id:item.Fsinger_mid,
            name:item.Fsinger_name
          }))
        })
        // 为了得到有序列表，我们需要处理 map
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
     
    },
    components: {
      ListView
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 81px
    bottom: 0
    width: 100%
</style>
