// const jwt = require('jsonwebtoken')
// const tokenConfig = require('../config').tokenConfig

const VistorService = require('../services').VistorService
const { InvalidQueryError } = require('../lib/error')
const APIError = require('../middlewares/rest').APIError

module.exports = {
  // 游客登陆
  'POST /api/vistor/login': async (ctx) => {
    const { userName, password } = ctx.request.body
    console.log('vistorLogin', ctx.request.body)
    if (!userName || !password) {
      throw new InvalidQueryError()
    }
    const vistor = await VistorService.findOne({ name: userName })
    if (!vistor || vistor.password !== password) {
      throw new APIError('vistor:not_found', '用户名或密码错误')
    } else {
      ctx.rest(vistor)
    }
  },
  // 游客注册
  'POST /api/vistor/register': async (ctx) => {
    const { userName, password } = ctx.request.body
    if (!userName || !password) {
      throw new InvalidQueryError()
    }
    if (await VistorService.findOne({ name: userName })) {
      ctx.error = '用户已存在'
    } else {
      const result = await VistorService.save({ name: userName, password: password })
      ctx.rest(result)
      //   ctx.result = result
      // {
      // userInfo: {
      //   id: user._id,
      //   username: user.username,
      //   nickname: user.nickname
      // },
      // token: jwt.sign(
      //   {
      //     data: user._id,
      //     exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3 // 设置 token 过期时间: 3d
      //   },
      //   tokenConfig.secret
      // )
      // }
      //   return nextTick()
    }
  }
  // //github登录
  // router.get("/api/getGithub",(req,res) => {
  // 	db.vistor.find({githubID: req.query.id},(err,doc) => {
  // 		if(err){
  // 			res.status(500).end()
  // 		}else{
  // 			res.json(doc)
  // 		}
  // 	})
  // })
  // router.get("/login/git",(req,res) => {
  // 	//请替换为自己的client_id
  // 	let path = "https://github.com/login/oauth/authorize?client_id=YourID&scope=['user']"
  // 	res.redirect(path)
  // })
  // router.get("/login_github",(req,res) => {
  // 	//请替换为自己的client_id和client_secret
  // 	let params = {
  // 		client_id: "YourID",
  // 		client_secret: "Your Secret",
  // 		code: req.query.code,
  // 		scope: ["user"],
  // 		redirect_uri: "http://localhost:6180/login_github"
  // 	}
  // 	api.post("https://github.com/login/oauth/access_token",params)
  // 	.then((fullData) =>{
  // 		let arr1 = fullData.split("&"),
  // 			arr2 = arr1[0].split("="),
  // 			token = arr2[1]
  // 		return token
  // 	}).then((token) => {
  // 		api.get("https://api.github.com/user",{access_token: token}).then((user_info) => {
  // 			db.vistor.find({githubID: user_info.id},(err,doc) =>{
  // 				if(err){
  // 					res.status(500).end()
  // 				}else{
  // 					if(!doc.length){
  // 						new db.vistor({
  // 							name: user_info.login,
  // 							imgUrl: user_info.avatar_url,
  // 							githubID: user_info.id
  // 						}).save()
  // 					}
  // 					res.cookie("githubId",user_info.id,{maxAge: 1000*60*60*24})
  // 					res.status(200).end()
  // 				}
  // 			})
  // 		}).catch((err) => {
  // 			res.status(500).end()
  // 		})
  // 	}).catch((err) =>{
  // 		res.status(500).end()
  // 	})
  // })
}
