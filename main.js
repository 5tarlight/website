'use strict'

const express = require('express')
const http = require('http')
const serveStatic = require('serve-static')
const path = require('path')
const expressErrorHandler = require('express-error-handler')
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')

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
app.use(cookieParser())
app.use(expressSession({
  secret: 'my key',
  resave: true,
  saveUninitialized: true
}))

router.route('/').get(async (req, res) => {
  res.redirect('/index.html')
})

router.route('/process/register').post(async (req, res) => {
  connection.connect()

  let name = req.body.name || req.query.name
  let profile = req.body.profile || req.query.profile
  let password = req.body.password || req.query.password

  await connection.query("INSERT INTO `author` (name, profile, password) VALUES (?, ?, ?);", [name, profile, password], (error, results) => {
    if(error) {
      console.dir(error)

      res.writeHead('200', {'Content-Type': 'html;charset=utf8'})
      res.end("<h1>Error T.T</h1>")
    } else {
      res.writeHead('200', {'Content-Type': 'html;charset=utf8'})
      res.end('<h1>Success!!</h1>')
    }
  })

  connection.end()
})

router.route("/author/list").get(async (req, res) => {
  connection.connect()
  connection.query("SELECT name, profile FROM `author`", [], (error, results, fields) => {
    res.writeHead('200', {'Content-type': 'html;charset=utf8'})
    if(error) {
      res.end('<h1>Error</h1>')
      console.dir(error)
    } else {
      for(let index=0; index < results.length; ++index) {
        res.write('<p>name: ' + results[index]['name'])
        res.write('\tprofile: ' + results[index]['profile'] + '<br />')
      }
      res.end('</p>')
    }
  })
})

app.use(router)
app.use(expressErrorHandler.httpError(404))
app.use(errorHandler)

http.createServer(app).listen(app.get('port'), async () => {
  console.log('익스프레스 서버를 시작했습니다. : ', app.get('port'))
})