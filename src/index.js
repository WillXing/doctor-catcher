import request from 'request'

import getRankLinks from './get_rank_links'
import * as LoginManager from './login'
import * as getMovies from './get_movies'
import * as cookieManager from './cookie_manage.js'

const listPageUrl = 'http://www.zimuzu.tv/eresourcelist?channel=movie&area=&category=&format=&year=&sort='

if(process.argv.length != 4) {
  console.error('Invalid arguments')
  console.error('eg. node app.js <username> <password>')
  process.exit(1)
}
let username = process.argv[2], password = process.argv[3];

init();

async function init() {

  console.info('Login...', username, password)

  let loginRes = await LoginManager.login(username, password)

  if(loginRes.status != 1) {
    console.log('Login failed', loginRes.status, loginRes.info)
    process.exit(1)
  }

  //let user = await LoginManager.getUserInfo()

  console.info('Login success')

  //console.info('User: ', user.data.userinfo.nickname)
  //console.info('Level: ', user.data.userinfo.group_name)

  let links = await getRankLinks(listPageUrl)

  getMovies.prepareFolder()

  await resolveEachLink(links)

  //await LoginManager.sign()

  await LoginManager.logout()

  console.info('Logout success')

}

async function resolveEachLink(links) {
  for (let i = 0; i < links.length; i++) {
    await getMovies.fetchMovie(links[i])
  }
}