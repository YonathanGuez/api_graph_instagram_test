const express = require('express')
const https = require('https')
const fs = require('fs')
const { parse } = require('url')
require('dotenv').config()

const app = express()
const logger = (req, res, next) => {
  // console.log(res)
  console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
  next()
}
app.use(logger)

// Body parser Middleware we need this for POST end pars the Body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const appid = process.env.APP_ID_INSTA
const redirecturi = process.env.URI_REDIRECTION
const appsecret = process.env.APP_SECRET
// GET home route
app.get('/', (req, res) => {
  res.header('Content-type', 'text/html')

  const authorize = `https://api.instagram.com/oauth/authorize?client_id=${appid}&redirect_uri=${redirecturi}&scope=user_profile,user_media&response_type=code`
  return res.end(`<h1>connection </h1><a href=${authorize}>connect</a>`)
})

function test(code) {
  return new Promise((resolve, reject) => {
    const url = `https://api.instagram.com/oauth/access_token?client_id=${appid}&client_secret=${appsecret}&grant_type=authorization_code&redirect_uri=${redirecturi}&code=${code}`
    console.log(`\n${url}`)
    const { protocol, hostname, path } = parse(url)
    const data = []

    const req = https
      .request(
        {
          protocol,
          hostname,
          path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
        res => {
          res.on('data', chunk => data.push(chunk))
          res.on('end', () => {
            const content = Buffer.concat(data).toString()
            resolve({ res, data: JSON.parse(content) })
          })
        },
      )
      .on('error', e => reject(e))
    req.end()
  })
}
// GET home route
app.get('/auth', async (req, res) => {
  res.header('Content-type', 'text/html')
  const { code } = req.query // params = {id:"000000"}
  // console.log(code)
  const { data } = await test(code)
  res.send(`<h1> code autorisaton ${JSON.stringify(data, null, 2)}</h1>`)
})

// we will pass our 'app' to 'https' server
https
  .createServer(
    {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem'),
      passphrase: 'tests',
    },
    app,
  )
  .listen(3000, () => {
    console.log(`Server listening`)
  })
