'use strict'

const express = require('express')
const http = require('http')
const serveStatic = require('serve-static')
const path = require('path')
const expressErrorHandler = require('express-error-handler')
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'nodejs',
  password: '111111',
  database: 'website',
  port: 3333
})

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
app.use('/', serveStatic(path.join(__dirname, 'public')))
app.use(cors())


router.route('/').get(async (req, res) => {
  res.redirect('/index.html')
})

router.route('/process/register').post(async (req, res) => {
  connection.connect()

  let name = req.body.name || req.query.name
  let profile = req.body.profile || req.query.profile

  await connection.query("INSERT INTO `author` (name, profile) VALUES (?, ?);", [name, profile], (error, results) => {
    if(error) {
      console.dir(error)

      res.writeHead('200')
      res.end("Error T.T")
    } else {
      console.dir(results)

      res.writeHead('200')
      res.end('Success!!')
    }
  })

  connection.end()
})

app.use(router)
app.use(expressErrorHandler.httpError(404))
app.use(errorHandler)

http.createServer(app).listen(app.get('port'), async () => {
  console.log('익스프레스 서버를 시작했습니다. : ', app.get('port'))
})