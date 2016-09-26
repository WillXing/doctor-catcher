import request from 'request'

import getLinksAndNextPage from './get_rank_links'
import * as LoginManager from './login'
import * as getMovies from './get_movies'

const domain = 'http://www.zimuzu.tv'
const listPageUrl = 'http://www.zimuzu.tv/eresourcelist'
const startListPageQuery = '?page=22&channel=&area=&category=&format=&sort='

if(process.argv.length != 4) {
  console.error('Invalid arguments')
  console.error('eg. node app.js <username> <password>')
  process.exit(1)
}

let username = process.argv[2], password = process.argv[3];

init();

async function init() {

  console.info('Login...', username)

  let loginRes = await LoginManager.login(username, password)

  if(loginRes.status != 1) {
    console.log('Login failed', loginRes.status, loginRes.info)
    process.exit(1)
  }

  console.info('Login success')

  getMovies.prepareFolder()

  await getLinksAndResolve(listPageUrl, startListPageQuery)

  await LoginManager.logout()

  console.info('Logout success')

}


async function getLinksAndResolve(listPageUrl, listPageQuery) {

  let url = `${listPageUrl}${listPageQuery}`;

  console.log('Try to get link from this URL:', url)

  let result = await getLinksAndNextPage(url)

  await resolveEachLink(result.links)

  if(result.nextPageQuery != null) {
    await getLinksAndResolve(listPageUrl, result.nextPageQuery)
  }
}

async function resolveEachLink(links) {
  for (let i = 0; i < links.length; i++) {
    try{
      await getMovies.fetchMovie(`${domain}${links[i]}`)
    }catch(e) {
      console.log('skip error link')
    }
  }
}