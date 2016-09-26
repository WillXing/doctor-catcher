import fs from 'fs'
import request from 'request'
import cheerio from 'cheerio'

export default function getLinksAndNextPageWrap(url) {
  return new Promise((resolve, reject) => {
    request({
      url: url
    }, (err, res, body) => {
      if(err) {
        reject(err)
      }else {
        let analyzeResult = analyzeBody(body)
        resolve(analyzeResult)
      }
    })
  })
}

function analyzeBody(body) {
  let $ = cheerio.load(body)

  let links = []

  let isLastPage = $('.pages a').last().hasClass('cur')

  let nextPageQuery = null

  $('.resource-showlist .clearfix .fl-info dl dt h3 a').each((i, el) => {
    links.push($(el).attr('href'))
  })

  if(!isLastPage) {
    nextPageQuery = $('.pages a').eq(-2).attr('href')
  }

  return {
    links: links,
    nextPageQuery: nextPageQuery
  }
}