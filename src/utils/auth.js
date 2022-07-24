import Cookies from 'js-cookie'

// cookie
// 怎么操作cookie
// 借助第三方ku

// document.cookie = 'key=value&key=value'

// localStorage.setItem('')

const TokenKey = 'hrsass_token' // token存储到本地存储 >> key
const timeKey = 'time_key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export const getTime = () => {
  return Cookies.get(timeKey)
}

export const setTime = () => {
  return Cookies.set(timeKey, Date.now())
}
