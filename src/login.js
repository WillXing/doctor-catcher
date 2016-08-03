import request from 'request'

import * as cookieManager from './cookie_manage.js'

let loginUrl = 'http://www.zimuzu.tv/User/Login/ajaxLogin'

export function login(username, password) {
  return new Promise((resolve, reject) => {
    request({
      url: loginUrl,
      method: 'POST',
      jar: cookieManager.getCookieJar(),
      form: {
        account: username,
        password: password,
        remember: 0,
        url_back: 'http://www.zimuzu.tv/user/user/index'
      }
    }, (err, res, body) => {
      if(err) {
        reject(err)
      } else {
        resolve(JSON.parse(body))
      }
    })
  });
}

export function getUserInfo() {
  let userInfoUrl = 'http://www.zimuzu.tv/user/login/getCurUserTopInfo'
  return new Promise((resolve, reject) => {
    request({
      url: userInfoUrl,
      method: 'GET',
      jar: cookieManager.getCookieJar()
    }, (err, res, body) => {
      if(err) {
        reject(err)
      } else {
        resolve(JSON.parse(body))
      }
    })
  });
}

export function logout() {
  let loginOutUrl = 'http://www.zimuzu.tv/user/logout/ajaxLogout'
  return new Promise((resolve, reject) => {
    request({
      url: loginOutUrl,
      method: 'GET',
      jar: cookieManager.getCookieJar()
    }, (err, res, body) => {
      if(err) {
        reject(err)
      }else {
        resolve(body)
      }
    })
  })
}

export function sign() {
  let signUrl = 'http://www.zimuzu.tv/user/sign'

  return new Promise((resolve, reject) => {
    request({
      url: signUrl,
      method: 'GET',
      jar: cookieManager.getCookieJar(),
      headers: {
        'Referer': 'http://www.zimuzu.tv/user/user/index',
        'Host': 'www.zimuzu.tv',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
      }
    }, (err, res, body) => {
      //analyzeBody(body)
    })
  })
}

function analyzeBody(body) {
  console.log(body)
}