import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

/* 进度条的配置，可搁置研究*/
NProgress.configure({ showSpinner: false }) // NProgress Configuration

/* 白名单*/
const whiteList = ['/login', '/auth-redirect','/audit'] // no redirect whitelist

/* 路由拦截器：路由跳转前*/
router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 获取页面的title，还不知道哪里会用，这里是全局，应该有个组件会用到title
  document.title = getPageTitle(to.meta.title)

  // 确定是否用户已经登录，用token来判定，就是cookie
  const hasToken = getToken()
  // 如果有token，即已经登录成功
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已经成功登录，并且路由还是跳转到登录页，那就重定向到首页，并且进度条结束
      next({ path: '/' })
      NProgress.done()
    } else {
      // 如果已经成功登录，但是路由不是跳往登录页，去判断用户是否有角色，也就是说，生成路由只调用一次，生成路由的时候设置的角色
      // determine whether the user has obtained his permission roles through getInfo
      // 去store里面拿roles，这里是布尔值，判断是否有roles
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // 如果有roles，说明已经生成路由了，因为生成路由的actions里面去set的roles，既然已经生成路由了，那就直接在路由里面跳就是了
      // to.path的在有权限的路由里面那就直接跳，不在里面就跳404
      if (hasRoles) {
        next()
      } else {
        try {
          // 如果没有获取用户权限，说明是第一次跳，也就是刚登陆进来，需要生成路由，那就获取用户信息，拿着用户的角色去获取权限，这个项目的角色对应
          // route权限。也就是说角色roles是个数组。route里面的roles也是个数组，这2个匹配上的就加进路由里面，匹配不上的就是没有权限。
          // get user info 获取用户信息的目的是为了获取用户的角色 角色对应权限
          // admin对应route里面admin的权限路由，editor对应route里面editor的权限，如果只是这么2个角色的话，那直接写死都行，生成路由都不必写那么长
          // 一大串。写那么长是为了写活，route的roles和用户的roles都是数组，前后两边都可以有更多角色。
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          // await的用法：见笔记
          // 这里{roles}只是拿了data里面的roles，其实就是roles.roles的意思
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles 拿着角色去生成路由，这里是角色对应角色生成的权限（重要！）
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes 把获取的路由丢进router
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record 待解读
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login 利用try--catch语法来处理异常
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

/* 路由拦截器：路由跳转后*/
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
