import fs from 'fs'
import request from 'request'
import cheerio from 'cheerio'

export default function getLinksWrap(url) {
  return new Promise((resolve, reject) => {
    request({
      url: url
    }, (err, res, body) => {
      if(err) {
        reject(err)
      }else {
        let links = analyzeBody(body)
        //console.log('resolve', links)
        resolve(links)
      }
    })
  })
}

function analyzeBody(body) {
  let $ = cheerio.load(body)

  let links = []

  $('.resource-showlist .clearfix .fl-info dl dt strong a').each((i, el) => {
    links.push($(el).attr('href'))
  })

  return links
}