function transList(list) {
  const treeList = []
  const map = {}

  //  1、构建map结构，存储id和部门数据
  list.forEach(item => {
    if (!item.children) {
      item.children = []
    }
    map[item.id] = item
  })

  list.forEach(item => {
    const parent = map[item.pid]
    if (parent) {
      parent.children = item
    } else {
      treeList.push(item)
    }
  })

  return treeList
}
const arr = [
  {
    'id': '604e115c7bfcfa45d019d3e9',
    'pid': '-1',
    'name': '传智教育',
    'code': '1',
    'introduce': '程序员的摇篮',
    'createTime': '2022-06-30 16:21:32'
  },
  {
    'id': '604e21feb205b95968e13129',
    'pid': '',
    'name': '总裁办',
    'code': '1001',
    'manager': '管理员',
    'introduce': '公司战略部',
    'createTime': '2021-03-14 22:47:25'
  },
  {
    'id': '604e222bb205b95968e1312a',
    'pid': '',
    'name': '行政部',
    'code': 'XZB',
    'manager': '管理员',
    'introduce': '行政部',
    'createTime': '2021-03-14 22:47:25'
  },
  {
    'id': '604e223fb205b95968e1312b',
    'pid': '',
    'name': '人事部',
    'code': 'RSB',
    'manager': '管理员',
    'introduce': '人事部',
    'createTime': '2021-03-14 22:47:25'
  },
  {
    'id': '604e2251b205b95968e1312c',
    'pid': '',
    'name': '财务部',
    'code': 'CWB',
    'manager': '管理员',
    'introduce': '财务部',
    'createTime': '2021-03-14 22:47:25'
  },
  {
    'id': '604e2262b205b95968e1312d',
    'pid': '604e2251b205b95968e1312c',
    'name': '财务核算部',
    'code': 'CWHSB',
    'manager': '管理员',
    'introduce': '财务核算部',
    'createTime': '2021-03-14 22:47:25'
  },
  {
    'id': '604e227db205b95968e1312e',
    'pid': '604e2251b205b95968e1312c',
    'name': '税务管理部',
    'code': 'SWGLN',
    'manager': '管理员',
    'introduce': '税务管理部',
    'createTime': '2021-03-14 22:47:25'
  },
  {
    'id': '604e2297b205b95968e1312f',
    'pid': '604e2251b205b95968e1312c',
    'name': '薪资管理部',
    'code': 'XZGLB',
    'manager': '管理员',
    'introduce': '薪资管理部',
    'createTime': '2021-03-14 22:47:25'
  },
  {
    'id': '6051ad90e93db6522c1d00d2',
    'pid': '',
    'name': '技术部',
    'code': 'JSB',
    'manager': '孙财',
    'introduce': '技术部',
    'createTime': '2021-03-17 15:18:23'
  },
  {
    'id': '6051adb6e93db6522c1d00d3',
    'pid': '6051ad90e93db6522c1d00d2',
    'name': 'Java研发部',
    'code': 'JYFB',
    'manager': '管理员',
    'introduce': 'JAVA研发部',
    'createTime': '2021-03-17 15:18:23'
  },
  {
    'id': '6051add6e93db6522c1d00d4',
    'pid': '6051ad90e93db6522c1d00d2',
    'name': 'Python研发部',
    'code': 'PYFB',
    'manager': '罗晓晓',
    'introduce': 'Python研发部',
    'createTime': '2021-03-17 15:18:23'
  },
  {
    'id': '6051adefe93db6522c1d00d5',
    'pid': '6051ad90e93db6522c1d00d2',
    'name': 'Php研发部',
    'code': 'PhpYFB',
    'manager': '孙财',
    'introduce': 'Php研发部',
    'createTime': '2021-03-17 15:18:23'
  },
  {
    'id': '6051ae03e93db6522c1d00d6',
    'pid': '',
    'name': '运营部',
    'code': 'YYB',
    'manager': '孙财',
    'introduce': '运营部',
    'createTime': '2021-03-17 15:18:23'
  },
  {
    'id': '6051ae15e93db6522c1d00d7',
    'pid': '',
    'name': '市场部',
    'code': 'SCB',
    'manager': '孙财',
    'introduce': '市场部',
    'createTime': '2021-03-17 15:18:23'
  },
  {
    'id': '6051ae28e93db6522c1d00d8',
    'pid': '6051ae15e93db6522c1d00d7',
    'name': '北京事业部',
    'code': 'BJSYB',
    'manager': '孙财',
    'introduce': 'BJSYB',
    'createTime': '2021-03-17 15:18:23'
  },
  {
    'id': '6051ae3de93db6522c1d00d9',
    'pid': '6051ae15e93db6522c1d00d7',
    'name': '上海事业部',
    'code': 'SHSYB',
    'manager': '文吉星',
    'introduce': '上海事业部',
    'createTime': '2021-03-17 15:18:23'
  },
  {
    'id': '62dcb0c437ecc10a8800fe70',
    'pid': '604e21feb205b95968e13129',
    'name': '456',
    'code': '123',
    'manager': '管理员',
    'introduce': '123123',
    'createTime': '2022-06-30 16:21:32'
  }
]

console.log(transList(arr))
