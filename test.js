require('dotenv').config()
const https = require('https')

const appid = '907979496322595'
const redirecturi = 'https://localhost:3000/auth'

const test = `https://api.instagram.com/oauth/authorize?client_id=${appid}&redirect_uri=${redirecturi}&scope=user_profile,user_media&response_type=code`

https
  .get(test, resp => {
    console.log(test)
    let data = ''

    // A chunk of data has been recieved.
    resp.on('data', chunk => {
      data += chunk
    })

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(data)
    })
  })
  .on('error', err => {
    console.log(`Error: ${err.message}`)
  })
