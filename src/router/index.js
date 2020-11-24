import Vue from 'vue'
import Router from 'vue-router'
import projectAdd from '../views/project/add'
import projectList from '../views/project/list'
import exhibitionAdd from '../views/exhibition/add'
import exhibitionList from '../views/exhibition/list'
import publishAdd from '../views/publish/add'
import publishList from '../views/publish/list'
import topList from '../views/topList'
Vue.use(Router)
export const routes = [
  {
    path: '*',
    component: projectList,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/',
    name: 'projectList',
    component: projectList,
    meta: {
      title: '项目列表'
    }
  },
  {
    path: '/projectList',
    name: 'projectList',
    component: projectList,
    meta: {
      title: '项目列表'
    }
  },
  {
    path: '/projectList',
    name: 'projectList',
    component: projectList,
    meta: {
      title: '项目列表'
    }
  },
  {
    path: '/projectAdd',
    name: 'projectAdd',
    component: projectAdd,
    meta: {
      title: '新增项目'
    }
  },
  {
    path: '/exhibitionAdd',
    name: 'exhibitionAdd',
    component: exhibitionAdd,
    meta: {
      title: '新增展览&演讲'
    }
  },
  {
    path: '/exhibitionList',
    name: 'exhibitionList',
    component: exhibitionList,
    meta: {
      title: '展览&演讲列表'
    }
  },
  {
    path: '/publishAdd',
    name: 'publishAdd',
    component: publishAdd,
    meta: {
      title: '新增出版'
    }
  },
  {
    path: '/publishList',
    name: 'publishList',
    component: publishList,
    meta: {
      title: '出版列表'
    }
  },
  {
    path: '/topList',
    name: 'topList',
    component: topList,
    meta: {
      title: '首页置顶设置'
    }
  }
]
export const otherRoutes = [
  {
    path: '/projectList',
    name: 'projectList',
    component: projectList,
    meta: {
      title: '项目列表'
    }
  },
  {
    path: '/projectAdd',
    name: 'projectAdd',
    component: projectAdd,
    meta: {
      title: '新增项目'
    }
  },
  {
    path: '/exhibitionAdd',
    name: 'exhibitionAdd',
    component: exhibitionAdd,
    meta: {
      title: '新增展览&演讲'
    }
  },
  {
    path: '/exhibitionList',
    name: 'exhibitionList',
    component: exhibitionList,
    meta: {
      title: '展览&演讲列表'
    }
  },
  {
    path: '/publishAdd',
    name: 'publishAdd',
    component: publishAdd,
    meta: {
      title: '新增出版'
    }
  },
  {
    path: '/publishList',
    name: 'publishList',
    component: publishList,
    meta: {
      title: '出版列表'
    }
  },
  {
    path: '/topList',
    name: 'topList',
    component: topList,
    meta: {
      title: '首页置顶设置'
    }
  }
] 
export default new Router({
  routes
})
