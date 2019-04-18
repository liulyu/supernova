import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const Recommend = (resolve) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module);
  });
};
const rankDetail = (resolve) => {
  import('components/rankDetail/rankDetail').then((module) => {
    resolve(module);
  });
};
const detail = (resolve) => {
  import('components/detail/detail').then((module) => {
    resolve(module);
  });
};
const singerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then((module) => {
    resolve(module);
  });
};
const Tab = (resolve) => {
  import('components/tab/tab').then((module) => {
    resolve(module);
  });
};
const Singer = (resolve) => {
  import('components/singer/singer').then((module) => {
    resolve(module);
  });
};
const Search = (resolve) => {
  import('components/search/search').then((module) => {
    resolve(module);
  });
};
const Rank = (resolve) => {
  import('components/rank/rank').then((module) => {
    resolve(module);
  });
};

const userCenter = (resolve) => {
  import('base/user-center/user-center').then((module) => {
    resolve(module);
  });
};
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/Recommend'
    },
    {
      path:"/Rank",
      component:Rank,
      children:[
        {path:":id",
        component:rankDetail
        }
      ]
    },
    {
      path:"/Recommend",
      component:Recommend,
      children:[
        {
          path:":id",
          component:detail
        }
      ]
    },
    {
      path:"/Search",
      component:Search,
      children:[
        {
          path:":id",
          component:singerDetail
        }
      ]
    },
    {
      path:"/Singer",
      component:Singer,
      children:[
        {
          path:":id",
          component:singerDetail
        }
      ]
    },
    {
      path:"/Tab",
      component:Tab
    },

    {
      path:"/user",
      component:userCenter
    }
  ]
})
