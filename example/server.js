const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app =express();

//将webpack配置文件用webpack进行编译
const compiler = webpack(WebpackConfig)
//使用webpack-dev-middleware作为中间件
app.use(webpackDevMiddleware(compiler,{
    publicPath: '/__build__/',
    stats:{
        colors:true,
        chunks:false
    }
}))

app.use(webpackHotMiddleware(compiler))

//设置当前文件夹为静态目录
app.use(express.static(__dirname))

//解析body参数成json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const router = express.Router();
//接受请求路由
router.get('/simple/get',function (req,res,next) {
    res.json({
        msg:'hello world'
    })
})

router.get('/demo1/test',(req,res,next) => {
    res.json(req.query);
})

router.post('/demo1/post',(req,res) => {
    res.json(req.body);
})

router.post('/demo1/post-arr',(req,res) => {
    let msg = [];
    req.on('data',chunk => {
        if(chunk){
            msg.push(chunk);
        }
    })
    req.on('end',() => {
        let buff = Buffer.concat(msg);
        res.json(buff.toJSON())
    })
})


registerExtendRouter()


app.use(router)

const port = process.env.PORT || 9999

app.listen(port,() => {
    console.log("server is start at localhost:"+port)
})


function registerExtendRouter () {
    router.get('/extend/get', function(req, res) {
        res.json({
            msg: 'hello world'
        })
    })

    router.options('/extend/options', function(req, res) {
        res.end()
    })

    router.delete('/extend/delete', function(req, res) {
        res.end()
    })

    router.head('/extend/head', function(req, res) {
        res.end()
    })

    router.post('/extend/post', function(req, res) {
        res.json(req.body)
    })

    router.put('/extend/put', function(req, res) {
        res.json(req.body)
    })

    router.patch('/extend/patch', function(req, res) {
        res.json(req.body)
    })

    router.get('/extend/user', function(req, res) {
        res.json({
            code: 0,
            message: 'ok',
            result: {
                name: 'jack',
                age: 18
            }
        })
    })
}
