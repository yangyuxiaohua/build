import Vue from 'vue'
import VueRouter from 'vue-router'
// import Index from '../views/Index.vue'
import Login from '../views/Login.vue'


Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'login',
    component: Login
  }, {
    path: '/index',
    name: 'index',
    component: () => import( /* webpackChunkName: "about" */ '../views/Index.vue'),
    children: [{
        path: '/index/home',
        name: 'home',
        component: () => import('../views/home/Home.vue')
      },
      {
        path: '/index/project',
        name: 'project',
        component: () => import('../views/project/Project.vue'),
        children: [{
            path: '/index/project/basicInfor',
            name: 'basicInfor',
            component: () => import('../views/project/BasicInfor.vue')
          },
          {
            path: '/index/project/acceptanceContent',
            name: 'acceptanceContent',
            component: () => import('../views/project/AcceptanceContent.vue')
          },
          // {
          //   path: '/index/project/taskArrangement',
          //   name: 'taskArrangement',
          //   component: () => import('../views/project/TaskArrangement.vue')
          // },
        ]
      },
      {
        path: '/index/acceptTask',
        name: 'acceptTask',
        component: () => import('../views/acceptTask/AcceptTask.vue'),
        children: [{
            path: '/index/acaceptTask/taskArrangement',
            name: 'taskArrangement',
            component: () => import('../views/acceptTask/TaskArrangement.vue')
          },
        ]
      },
      {
        path: '/index/recode',
        name: 'recode',
        component: () => import('../views/recode/Recode.vue'),
        children: [{
            path: '/index/recode/dataReview',
            name: 'dataReview',
            component: () => import('../views/recode/DataReview.vue')
          },
          {
            path: '/index/recode/evaluation',
            name: 'evaluation',
            component: () => import('../views/recode/Evaluation.vue')
          },
          {
            path: '/index/recode/completionInspection',
            name: 'completionInspection',
            component: () => import('../views/recode/CompletionInspection.vue')
          },
          {
            path: '/index/recode/fireDetection',
            name: 'fireDetection',
            component: () => import('../views/recode/FireDetection.vue')
          }
        ]
      },
      {
        path: '/index/standard',
        name: 'standard',
        component: () => import('../views/standard/Standard.vue'),
        children: [{
            path: '/index/standard/assess',
            name: 'assess',
            component: () => import('../views/standard/Assess.vue')
          },
          {
            path: '/index/standard/standardDataReview',
            name: 'standardDataReview',
            component: () => import('../views/standard/StandardDataReview.vue')
          },
        ]
      },
      {
        path: '/index/user',
        name: 'user',
        component: () => import('../views/user/User.vue'),
        children: [{
            path: '/index/user/userManage',
            name: 'userManage',
            component: () => import('../views/user/UserManage.vue')
          },
          {
            path: '/index/user/userList',
            name: 'userList',
            component: () => import('../views/user/UserList.vue')
          }
        ]
      },
    ]
  },
  {
    path: '/blank',
    name: 'blank',
    component: () => import( /* webpackChunkName: "about" */ '../views/Blank.vue'),
  },
  {
    path: '*',
    name: '404',
    component: () => import('../views/404.vue')
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router