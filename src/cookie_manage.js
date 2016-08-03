import request from 'request'
import tough from 'tough-cookie'
import FileCookieStore from 'tough-cookie-filestore'

let cookieJar = new tough.CookieJar(new FileCookieStore('./cookie.json'))

export function setCookie (cookie, loginUrl, options) {
  cookieJar.setCookieSync(cookie, loginUrl, options);
}

export function getCookieFromStore () {

}

export function checkCookieExpire(url, key) {
  let expired = false

  let cookies = cookieJar.getCookiesSync(url, {})

  cookies.map((cookie) => {
    if(cookie.key == key) {
      expired = Date.parse(cookie.expires) < Date.now()
    }
  })

  return expired
}

export function getCookieJar() {
  return request.jar(new FileCookieStore('./cookie.json'))
}