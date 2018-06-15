import { Message } from 'element-ui'
import fileDownload from 'js-file-download'
import axios from 'axios'
import Raven from 'raven-js'

import {AUTH_TOKEN_KEY} from '@constants/config'
import RespCode from '@constants/RespCode'

const defaultHeader = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  AUTH_TOKEN_KEY: window.localStorage[AUTH_TOKEN_KEY]
}

const fileHeader = {
  'Accept': 'application/json',
  AUTH_TOKEN_KEY: window.localStorage[AUTH_TOKEN_KEY]
}

/**
 * @desc 发起ajax请求 最外层wrapper 支持自动提示错误等
 * @param {Object} opts 同axios的opts 并追加参数autoErrMsg
 * @return {Any} resData/undefined
 */
export default async opts => {
  // 根据具体业务逻辑制定 如何处置resolve和reject
  try {
    let data = await businessRequest(opts)
    return data
  } catch (err) {
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing') {
      Raven.captureException(err)
    }
    // 所有请求返回的err默认自动提示
    // msg优先级: resData.msg > err.message > `${err}`

    if (opts.autoErrMsg !== false) {
      let msg = `${err}`
      if (err) msg = err.msg || msg
      if (err.resData) msg = err.resData.msg || msg
      if (msg.indexOf('code 401') >= 0) {
        window.location.href = '/api/auth/login/url/noAjax'
      }
      // let a = JSON.stringify(JSON.parse(msg))
      // console.log(a)
      if (err.code !== 'EP999') { // 重新输入密码 请求方法内处理
        Message({
          showClose: true,
          message: msg,
          duration: 5000,
          type: 'error'
        })
      }
    }
    throw err
  }
}

/**
 * @desc 发起ajax请求 并融入业务相关参配置
 * @param {Object} opts 同axios的opts
 * @return {Any} resData/undefined
 */
async function businessRequest (opts) {
  let { res, resData, resBlob } = await requestDataOrBlob({
    // 根据业务自行定制
    baseURL: '/api',
    timeout: 0, // 未知超时时间
    headers: opts.file ? fileHeader : defaultHeader,
    ...opts
  })

  let disposition = res.headers['content-disposition']
  if (disposition) disposition = decodeURIComponent(disposition)
  // 根据具体业务逻辑制定 何时认为成功返回resData
  let isAttachment = resData && resData.data && resData.data.attachmentId
  if (resData && (resData.code === 'S200' || resData.code === 'S0000' || isAttachment)) {
    let authToken = res.headers['x-auth-token']
    if (authToken) {
      window.localStorage[AUTH_TOKEN_KEY] = defaultHeader[AUTH_TOKEN_KEY] = authToken
    }
    return resData
  } else if (disposition && disposition.indexOf('attachment') !== -1) {
    //  https://stackoverflow.com/questions/16086162/handle-file-download-from-ajax-post/23797348#23797348
    let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
    let matches = filenameRegex.exec(disposition)
    let filename
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '')
      filename = decodeURI(filename)
    }
    fileDownload(resBlob, filename)
  } else {
    // 保持统一throw error对象 并将data挂载在error上
    if (process.env.NODE_ENV === 'testing') {
      console.error(`${resData.code}: ${opts.url}   msg:${resData.msg}`)
    }
    handleErrorCode(resData)
    // let err = new Error('Server Business Error')
    // err.resData = resData
    // throw err
  }
  // let err = new Error('Server Business Error')
  // err.resData = resData
  // throw err
}

/**
 * @desc 发起ajax请求 同时获得resData和resBlob
 * @param {Object} opts 同axios的opts
 * @return {Object} { res, resData, resBlob }
 */
async function requestDataOrBlob (opts) {
  let res = await axios({
    ...opts,
    // 由于axios的限制 此处responseType只能设为blob 以满足文件下载的场景需要
    responseType: 'blob'
  })

  // 注意 此处为hack 由于axios的限制 以及财务后台下载接口特性 (成功为blob 失败为json)
  // 此处必须 记录blob 并转为json
  // 以保证两种用例正常使用 (json接口正常 下载正常 下载错误正常提示) 后续需改进优化
  // https://github.com/axios/axios/issues/815#issuecomment-340972365
  let resBlob = res.data
  let resData = null
  try {
    let resText = await new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.addEventListener('abort', reject)
      reader.addEventListener('error', reject)
      reader.addEventListener('loadend', () => {
        resolve(reader.result)
      })
      reader.readAsText(resBlob)
    })
    resData = JSON.parse(resText)
  } catch (err) {
    // ignore 如果是正常下载 返回才不是json 而是文件流 异常忽略
  }
  return { res, resData, resBlob }
}

function handleErrorCode (res) {
  let err = {}
  switch (res.code) {
    case RespCode.E101_NOT_LOGIN:
      err = {msg: `Not Logged In`, code: res.code, data: res.data}
      window.location.href = '/api/auth/login/url/noAjax'
      break
    case RespCode.S201_ASYN_SUCCESS:
      err = {data: res.data, code: res.code, msg: res.msg}
      break
    case RespCode.S202_TASK_EXECUTING:
      err = {data: res.data, code: res.code, msg: res.msg}
      break
    case RespCode.S203_BATCH_DATA_SUCCESS:
      err = {data: res.data, code: res.code, msg: res.msg}
      break
    default:
      err = {msg: `${res.code}: ${res.msg}`, code: res.code, data: res.data}
  }
  let msg = new Error(err.msg)
  msg.resData = res
  throw res
}
