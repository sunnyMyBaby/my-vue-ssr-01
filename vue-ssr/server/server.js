// 这里我们使用的是koa2
// 因为我们要做服务端渲染所以我们要起一个node server因为只有node server才能做
const Koa = require('koa')
const pageRouter = require('./routers/dev-ssr')
const path = require('path')
// koa-send 处理静态文件
const send = require('koa-send')
// 生成一个app
let app = new Koa()
let isDev = process.env.NODE_ENV === 'development'
// 记录所有的请求
app.use(async (ctx, next) => {
  try {
    console.log(`进来了那些路径${ctx.path}`)
    // 等待执行完毕之后进入到下一步
    await next()
  } catch (err) {
    console.log(err)
    ctx.status = 500
    if (isDev) {
      // 开发环境错误直接显示到页面上
      ctx.body = err.message
    } else {
      ctx.body = '请重新尝试'
    }
  }
})
console.log('aaaaa')
app.use(async (ctx, next) => {
  // 如果请求过来的是favicon.ico我们会获取相应目录下的favicon.ico文件\
  // console.log(path.join(__dirname)) 当前文件所处路径 /Users/yangguang02/Desktop/sduty/vue/my-vue-ssr-01/vue-ssr/server
  if (ctx.path === '/favicon.ico') {
    await send(ctx, ctx.path, { root: path.join(__dirname, '../') })
  } else {
    await next()
  }
})
// allowedMethods处理的业务是当所有路由中间件执行完成之后,若ctx.status为空或者404的时候,丰富response对象的header头.
app.use(pageRouter.routes()).use(pageRouter.allowedMethods()) // 这是koa-router固定用法
const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3333
app.listen(PORT, HOST, () => {
  console.log(`监听端口成功${HOST}-${PORT}`)
})
