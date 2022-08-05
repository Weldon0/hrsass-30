/**
 * Created by PanJiaChen on 16/11/18.
 */

import { error } from 'autoprefixer/lib/utils'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

// export function transListToTree1(list, rootValue) {
//   const arr = []
//   //  arr >> 处理
//   list.forEach(item => {
//     // 判断当前节点的id是否等于传入的pid(rootValue)
//     if (item.pid === rootValue) {
//       // 判断item是否有子节点？
//       const children = transListToTree(list, item.id)
//       // 如果有子节点 >> 把这些子节点作为当前item的children属性
//       if (children.length) {
//         item.children = children
//       }
//       arr.push(item)
//     }
//   })
//   return arr
// }

// list >> 😳待转化的数据 rootValue >> 根节点的pid
// 筛选出 pid = rootValue的所有节点

// 怎么样找到一级节点的子节点
// 所有的数据里面的pid如果等于当前以及节点的id

// 算法
// 复杂度

// 时间复杂度
// 空间复杂度

// 预期 >> 一次性遍历构建好关联关系
export function transListToTree(list, rootValue) {
  const arr = []
  //  arr >> 处理
  list.forEach(item => {
    // 判断当前节点的id是否等于传入的pid(rootValue)
    if (item.pid === rootValue) {
      // 判断item是否有子节点？
      const children = transListToTree(list, item.id)
      // 如果有子节点 >> 把这些子节点作为当前item的children属性
      if (children.length) {
        item.children = children
      }
      arr.push(item)
    }
  })
  return arr
}

export function transListToTreeNew(list, rootPid) {
  // 构建好关系的树节点
  const treeList = []

  //
  // 数组结构 》》
  const map = { } // map[id]

  list.forEach(item => {
    if (!item.children) {
      item.children = []
    }
    map[item.id] = item
  })

  list.forEach(item => {
    // 判断当前遍历项是否有父级节点
    const parent = map[item.pid]
    if (parent) {
      parent.children.push(item)
    } else if (item.pid === rootPid) {
      treeList.push(item)
    }
  })

  return treeList
  // console.log(map)
}
