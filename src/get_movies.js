import fs from 'fs'
import request from 'request'
import cheerio from 'cheerio'

import * as cookieManager from './cookie_manage.js'


export function fetchMovie(movieUrl) {
  let regex = /\/(\d*)$/
  let replacement = `/list/${regex.exec(movieUrl)[1]}`
  let movieResourceUrl = movieUrl.replace(regex, replacement)

  console.info('Fetching: ', replacement)

  return new Promise((resolve, reject) => {
    request({
      url: movieResourceUrl,
      jar: cookieManager.getCookieJar()
    }, (err, res, body) => {

      if(err) {
        reject(err)
        console.info('Fetch failed:', err)
      }else {
        resolve(analyzeBody(body))
        console.info('Fetched: ', replacement)
      }
    })
  })
}


function analyzeBody (body) {


  let $ = cheerio.load(body, {decodeEntities: false})

  let item = $('.media-box .media-list .clearfix')

  let result = []

  item.each((i, el) => {
    let itemResult = {}

    itemResult.title = $(el).find('.fl').find('a').attr('title')

    let downloadLink = $(el).find('.fr').find('a')

    itemResult.links = []

    downloadLink.each((d_i, d_el) => {
      let link = $(d_el).attr('href') || $(d_el).attr('thunderhref') || $(d_el).attr('xmhref');
      let linkName = $(d_el).html()

      if(link) {
        itemResult.links.push({
          [linkName]: link
        })
      }
    })

    result.push(itemResult)

  })

  let regex = /\s?[\/|\\]\s?/g

  let title = $("meta[name='keywords']").attr('content').replace(regex, '')

  fs.writeFileSync(`./result/${title}.txt`, JSON.stringify(result, null, 2))

}

export function prepareFolder() {
  if(fileExists(`./result/`)) {
    deleteFolderRecursive(`./result/`)
  }
  fs.mkdirSync(`./result/`)
}

function fileExists(filename){
  try{
    require('fs').accessSync(filename)
    return true;
  }catch(e){
    return false;
  }
}

function deleteFolderRecursive(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file) {
      var curPath = path + "/" + file
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}