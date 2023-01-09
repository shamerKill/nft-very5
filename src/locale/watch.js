// 检测更该数据
const fs = require('fs');
const path = require('path');


const current = fs.readFileSync(path.join(__dirname, './source.xlf'), 'utf-8');
const old = fs.readFileSync(path.join(__dirname, './source.zh-Hans.xlf'), 'utf-8');


const currentValue = getUnitArr(current);
const oldValue = getUnitArr(old);

const changeKeys = [];

// 判断是否有更改
const keys = Object.keys(currentValue);
for (let i = 0; i < keys.length; i++) {
  const key = keys[i];
  if (oldValue[key] !== currentValue[key]) {
    changeKeys.push(key);
  }
}
console.log(changeKeys, changeKeys.length);


// 获取unit数组
function getUnitArr (input) {
  const res = input.matchAll(/<unit[\s|\S]*?<\/unit>/g);
  const resArr = [...res];
  const result = {};
  resArr.forEach(item => {
    var id = '';
    var source = '';
    item[0].replace(/id\="(.*?)"/, (_, value) => {
      id = value;
      return '';
    });
    item[0].replace(/<source>(.*?)<\/source>/, (_, value) => {
      source = value;
      return '';
    });
    result[id] = source;
  });
  return result;
}
