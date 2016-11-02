import * as Doctor from './check_doctor'
import * as _ from 'lodash'

const domain = 'http://www.scgh114.com/'

// const openId = "oLRQYuHbg718ojEye15ztikdPeqA"
const openId = "oLRQYuDCZO5QzyfNiArHBh8g-RL8"

//const shenID = 273
const huaxiID = 13

const urlArray = []

let now = new Date().getTime()

for(let i = 14; i <= 15; i++) {
  let dateTS = new Date(now + i * 24 * 60 * 60 * 1000)
  let date = `${dateTS.getFullYear()}-${dateTS.getMonth() + 1}-${dateTS.getDate()}`
  let huaxiMorning = 'weixin/workinfo/index?workdate='+date+'&dutyTime=1&openID=&departId='+huaxiID+"&time="+Date.parse(new Date())
  // let huaxiAfternoon = 'weixin/workinfo/index?workdate='+date+'&dutyTime=3&openID=&departId='+huaxiID+"&time="+Date.parse(new Date())
  /*let shenMorning = 'weixin/workinfo/index?workdate='+date+'&dutyTime=1&openID='+openId+'&departId='+shenID+"&time="+Date.parse(new Date())
  let shenAfternoon = 'weixin/workinfo/index?workdate='+date+'&dutyTime=3&openID='+openId+'&departId='+shenID+"&time="+Date.parse(new Date())*/

  urlArray.push({url: huaxiMorning, date, morning: true, departId: huaxiID})
  // urlArray.push({url: huaxiAfternoon, date, morning: false, departId: huaxiID})
  /*urlArray.push({url: shenMorning, date, morning: true})
  urlArray.push({url: shenAfternoon, date, morning: false})*/
}

init();

async function init() {

  Doctor.prepareFolder()

  for (let i = 0; i < urlArray.length; i++) {
    try{
      let doctorsInfo = await Doctor.checkDoctorList(`${domain}${urlArray[i].url}`)

      let availableDoctors = await Doctor.fetchDoctorStatus(doctorsInfo, urlArray[i].date, urlArray[i].morning, urlArray[i].departId, openId)

      let nowDate = new Date()
      let timeCondition = `${nowDate.getHours()}${nowDate.getMinutes()}${nowDate.getSeconds()}`

      if(availableDoctors.doctors.length != 0 && (timeCondition*1 > 231330)) {
        await Doctor.catchDoctor(availableDoctors, domain)
      }


    }catch(e) {
      console.log('skip error:', e)
    }
  }

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
