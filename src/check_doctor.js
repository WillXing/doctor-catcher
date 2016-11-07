import fs from 'fs'
import path from 'path'
import request from 'request'
import cheerio from 'cheerio'
import * as _ from 'lodash'

export function checkDoctorList(url) {
  return new Promise((resolve, reject) => {
    request({
      url: url,
    }, (err, res, body) => {
      if (err) {
        reject(err)
        console.error('Fetch failed:', err)
      } else {
        resolve(analyzeDoctor(body))
      }
    })
  })
}


function analyzeDoctor(body) {


  // let $ = cheerio.load(body)
  let $ = cheerio.load(body, { decodeEntities: false })

  let item = $('.contain table')

  let result = []

  let hospitalName = '无';

  let hospitalNoReg = /hospNo\s=\s"(\d*)"/g

  let hospitalNo = hospitalNoReg.exec(body)[1]

  item.each((i, el) => {

    let name = $(el).find('.name').html()
    let price = $(el).find('.price').html()
    let wid = $(el).find('.order_btn').attr('wid')
    let specialName = $(el).find('#typeface_color').html()

    hospitalName = $(el).find('.hos-tip').html()

    let doctorRes = {
      name,
      price,
      wid,
      specialName,
    }

    result.push(doctorRes)

  })

  return {
    doctors: result,
    hospitalNo,
    hospitalName
  }


}
export function fetchDoctorStatus(doctorInfo, date, morning, departId, openIds) {

  let url = 'http://www.scgh114.com:80/weixin/doctor/refreshWorkInfo'

  let widArray = []

  doctorInfo.doctors.map(doctor => widArray.push(doctor.wid))

  let widStr = widArray.join(',')

  return new Promise((resolve, reject) => {
    request({
      url: url,
      method: 'POST',
      form: {
        workId: widStr,
        hospitalNo: doctorInfo.hospitalNo,
      }
    }, (err, res, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(analyzeDoctorNumber(doctorInfo, JSON.parse(body), date, morning, departId, openIds))
      }
    })
  });
}

function analyzeDoctorNumber(doctorsInfo, numberInfo, date, morning, departId, openIds) {
  let doctors = doctorsInfo.doctors

  _.map(doctors, (doctor) => {
    let doctorNumberInfo = _.find(numberInfo.data, { workId: doctor.wid })

    if (doctorNumberInfo != undefined) {
      doctor.count = doctorNumberInfo.count
    } else {
      doctor.count = 0
    }

    doctor.catchUrl = `weixin/workinfo/register?workId=${doctor.wid}&departId=${departId}&openID=${ morning ? openIds[0] : openIds[1] }&hospitalNo=${doctorsInfo.hospitalNo}`

  })

  _.remove(doctors, doctor => doctor.count == 0)

  // if (doctors.length > 0) {
  //   let d = new Date()
  //   let time = `${d.getHours()}:${d.getMinutes()}`
  //   fs.writeFileSync(`./result/${doctorsInfo.hospitalNo}=${date}=${morning ? 'morning' : 'afternoon'}=${time}.txt`, JSON.stringify(doctors, null, 2))
  // }

  doctorsInfo.doctors = doctors

  return doctorsInfo

}


export async function catchDoctor(availableDoctorsInfo, domain) {
  console.log('catching')
  if(fileExists('./result/caught.txt')) {
    fs.appendFileSync(`./logs/${urlArray[i].date}`, `Already Got`)
    return true
  }

  let doctors = availableDoctorsInfo.doctors

  for(let i= doctors.length - 2; i<doctors.length; i++) {
    if(i<0) {
      continue
    }

    let registerData = await getRegisterData(`${domain}${doctors[i].catchUrl}`)
    let msg = await catching(registerData)

    if(msg == 'not_start') {
      break
    }
  }
}

async function catching(data) {
  return new Promise((resolve, reject) => {
    request({
      url: 'http://www.scgh114.com/weixin/registered/registrationByType',
      method: 'POST',
      form: data
    }, (err, res, body) => {
      if (err) {
        reject(err)
      } else {
        let resolveData;
        let res = JSON.parse(body)
        let resRegx = /成功/g
        if(resRegx.exec(res.msg)) {
          fs.appendFileSync(`./logs/${urlArray[i].date}`, `Gotcha!!!`)
          fs.writeFileSync(`./result/caught.txt`, body)
          resolveData = 'success'
        }
        let notStartRegx = /时间/g
        if(notStartRegx.exec(res.msg)) {
          let time = new Date()
          fs.writeFileSync(`./result/not_start_${time.getMinutes()}:${time.getSeconds()}`, time.toString())
          resolveData = 'not_start'
        }
        let overRegx = /超过/g
        if(overRegx.exec(res.msg)) {
          resolveData = 'over_time'
        }

        console.log('Catch res:', res.msg)

        resolve(resolveData)
      }
    })
  });
}

async function getRegisterData(url) {
  return new Promise((resolve, reject) => {
    request({
      url: url,
    }, (err, res, body) => {
      if (err) {
        reject(err)
        console.error('Fetch failed:', err)
      } else {
        resolve(analyzeCatching(body))
      }
    })
  })
}

function analyzeCatching(body) {
  let $ = cheerio.load(body, { decodeEntities: false })
  let workrecordid = $('#registrationFrom #workRecordId').val() || ''
  let hospitalno = $('#registrationFrom #hospitalno').val() || ''
  let hospitalname = $('#registrationFrom #hospitalname').val() || ''
  let hospitaid = $('#registrationFrom #hospitalid').val() || ''
  let isRealNameCard = $('#registrationFrom #isRealNameCard').val() || ''
  let iscertificateid = $('#registrationFrom #iscertificateid').val() || ''
  let workid = $('#registrationFrom #workId').val() || ''
  let dutydate = $('#registrationFrom #workDutyDate').val() || ''
  let doctorid = $('#registrationFrom #doctorId').val() || ''
  let workDutyTimeNum = $('#registrationFrom #workDutyTime').val() || ''
  let dutytime = $('#registrationFrom #dutytime').val() || ''
  let doctorName = $('#registrationFrom #doctorName').val() || ''
  let doctorSpecialityName = $('#registrationFrom #doctorSpecialityName').val() || ''
  let hospitalFlag = $('#registrationFrom #hospitalFlag').val() || ''
  let openID = $('#registrationFrom #openID').val() || ''
  let type = $('#registrationFrom #type').val() || ''
  let username = $('#registrationFrom #username').val() || ''
  let certificateid = $('#registrationFrom #certificateid').val() || ''
  let card = '0003708577'
  let owner = '刘禹君'
  let tel = '18202842182'
  let sex = '1'

  return {
    workrecordid, hospitalno, hospitalname, hospitaid, isRealNameCard, iscertificateid,
    workid, dutydate, doctorid, workDutyTimeNum, dutytime, doctorName, doctorSpecialityName,
    hospitalFlag, openID, type, username, certificateid, card, owner, tel, sex,
  }
}


export function prepareFolder() {
  if (!fileExists(`./result/`)) {
    fs.mkdirSync(`./result/`)
  }
  if (!fileExists(`./logs/`)) {
    fs.mkdirSync(`./logs/`)
  }
}

export function fileExists(filename) {
  try {
    require('fs').accessSync(filename)
    return true;
  } catch (e) {
    return false;
  }
}
