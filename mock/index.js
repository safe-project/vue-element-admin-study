

import Mock from 'mockjs'

// mockjs使用的  暂时注释
// import { param2Obj } from '../src/utils'

/*这4个都是数据*/
import user from './user'
import role from './role'
import article from './article'
import search from './remote-search'

/*思考：什么情景用...*/
const mocks = [
  ...user,
  ...role,
  ...article,
  ...search
]

// 为前端mock数据
// 请小心谨慎的使用它，因为它会重定义http请求
// 很容易引起你的第三方库失效
// mockjs是线上模拟数据，本地开发先注释掉
// export function mockXHR() {
//   // mock patch
//   // https://github.com/nuysoft/Mock/issues/300
//   Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
//   Mock.XHR.prototype.send = function() {
//     if (this.custom.xhr) {
//       this.custom.xhr.withCredentials = this.withCredentials || false

//       if (this.responseType) {
//         this.custom.xhr.responseType = this.responseType
//       }
//     }
//     this.proxy_send(...arguments)
//   }

//   function XHR2ExpressReqWrap(respond) {
//     return function(options) {
//       let result = null
//       if (respond instanceof Function) {
//         const { body, type, url } = options
//         // https://expressjs.com/en/4x/api.html#req
//         result = respond({
//           method: type,
//           body: JSON.parse(body),
//           query: param2Obj(url)
//         })
//       } else {
//         result = respond
//       }
//       return Mock.mock(result)
//     }
//   }

//   for (const i of mocks) {
//     Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
//   }
// }

// for mock server 我们开发时使用mock server来模拟数据
const responseFake = (url, type, respond) => {
  return {
    url: new RegExp(`/mock${url}`),
    type: type || 'get',
    response(req, res) {
      res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
    }
  }
}

export default mocks.map(route => {
  return responseFake(route.url, route.type, route.response)
})
