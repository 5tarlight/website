const express = require('express')
const http = require('http')
const static = require('serve-static')
const path = require('path')
const expressErrorHandler = require('express-error-handler')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const router = express.Router()
const errorHandler = expressErrorHandler({
  static: {
    '404': './public/404.html'
  }
})

app.set('port', process.env.PORT || 80)
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/', static(path.join(__dirname, 'public')))
app.use(cors())


router.route('/').get(async (req, res) => {
  res.redirect('/index.html')
})

app.use(router)
app.use(expressErrorHandler.httpError(404))
app.use(errorHandler)

http.createServer(app).listen(app.get('port'), async () => {
  console.log('익스프레스 서버를 시작했습니다. : ', app.get('port'))
})