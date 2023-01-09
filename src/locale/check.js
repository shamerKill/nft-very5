// 检测替换翻译数据
const fs = require('fs');
const path = require('path');


const en = fs.readFileSync(path.join(__dirname, './source.en-US.xlf'), 'utf-8');
const zh = fs.readFileSync(path.join(__dirname, './source.zh-Hans.xlf'), 'utf-8');


const enValue = getUnitArr(en);
const zhValue = getUnitArr(zh);

// 判断是否有更改
const keys = Object.keys(zhValue);
let cache = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="zh">
  <file id="ngi18n" original="ng.template">`;
for (let i = 0; i < keys.length; i++) {
  const key = keys[i];
  if (enValue[key]) {
    cache += enValue[key].data;
  } else {
    cache += zhValue[key].data;
  }
}
cache += `\n  </file>
</xliff>`;

fs.writeFileSync(path.join(__dirname, './_cache.xlf'), cache, 'utf-8');


// 获取unit数组
function getUnitArr (input) {
  const res = input.matchAll(/\n\s+<unit[\s|\S]*?<\/unit>/g);
  const resArr = [...res];
  const result = {};
  resArr.forEach(item => {
    var id = '';
    var source = '';
    const data = item[0];
    data.replace(/id\="(.*?)"/, (_, value) => {
      id = value;
      return '';
    });
    data.replace(/<source>(.*?)<\/source>/, (_, value) => {
      source = value;
      return '';
    });
    result[id] = {
      source: source,
      data: data,
    };
  });
  return result;
}
