import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  /* 获取用户信息：前面是有await吧。
  */
  getInfo({ commit, state }) {
  	// await后面跟的是promise，这里new了个promisr对象，异步的。
    return new Promise((resolve, reject) => {
    	// 掉获取信息接口，异步的。
      getInfo(state.token).then(response => {
      	// 为什么是{data}而不是data，去看下接口的reponse：路径/mock/user.js/users.admin-token or users.editor-token
      	// {data}这么写是es6写法，展开为：{data:data},因为response就是个object
        const { data } = response

        // 如果没有返回数据，说明验证失败，请重新登录。reject了就完事了。就不会再进行后面的操作。
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        // 跟上面一样，es6写法
        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array 角色必须有值且长度大于0，判断精确，又加了个reject判断了一次，代码优良
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        // 真正登录成功验证通过，才会到这一步，然后存roles，name，avatar(头像地址)，介绍
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        // 最后把data  return出去，可以理解为return
        resolve(data)
      }).catch(error => {
      	// 否则就是return出去error
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
