/**
 * @description 计算代码行数
**/
const ignorePath = [
  "\.spec\.ts$",
  "styles"
];

const path = require('path');
const resolve = path.resolve;
const join = path.join;
const fs = require('fs');
const rootPath = resolve(__dirname, './src/app');
let fileNum = 0;

console.log(
  `非空行数: ${readDir(rootPath)}`
);

function readDir(path) {
  const dirData = fs.readdirSync(path);
  let lineNum = 0;
  dirData.forEach(item => {
    for (let i = 0; i < ignorePath.length; i++) {
      if (new RegExp(ignorePath[i]).test(item)) return;
    }
    const itemPath = join(path, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      lineNum += readDir(itemPath);
    } else {
      lineNum += readFile(itemPath);
    }
  });
  return lineNum;
}

function readFile(path) {
  const file = fs.readFileSync(path, 'utf-8').split(/\n+/g).map(item => item.replace(/\s+/g, ''));
  let fileFilter = file;
  fileFilter = fileFilter.filter(item => item.length > 3);
  fileFilter = fileFilter.filter(item => !item.match(/^(\/\/)/));
  return fileFilter.length;
}

