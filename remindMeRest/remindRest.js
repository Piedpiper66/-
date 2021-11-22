const fs = require('fs');

const { exec } = require('child_process');

// 获取 mp3 文件名列表
const result = fs.readdirSync('./').filter(name => name.match(/(\.mp3|m4r)$/));

// 获取 mp3 文件名
const restAudioName = result.find(name => name.includes('rest'));

const studyAudioName = result.find(name => name.includes('backToStudy'));

// 获取命令行参数列表
const argvs = process.argv;

// 获取输入参数
const userArgs = argvs.slice(2);

// 获取输入的第一个参数
const intervalArg = userArgs.length && userArgs[0];

// 初始化播放间隔时间
const realInterval = +intervalArg * (60 * (60 * 1000));
// const realInterval = +intervalArg * 1 * 1000;

// 初始化休息时间
const pauseTime = 10 * (1000 * 60);

let timer;

running();

// 延迟播放音乐
function running() {
   if (!Number.isNaN(realInterval) && restAudioName) {
      timer = setTimeout(() => {
         exec(`start ${restAudioName}`, (err, out, outErr) => {
            if (err) {
               console.log('err: ', err);
               return;
            }
            if (outErr) {
               console.log('outErr: ', outErr);
               return;
            }
            if (out) {
               console.log('out: ', out);
            }
            pauseThenRunning();
         });
      }, realInterval);
   }
}

// 重置播放
function pauseThenRunning() {
   clearTimeout(timer);

   setTimeout(() => {
      if (studyAudioName) {
         exec(`start ${studyAudioName}`, (err, out, outErr) => {
            if (err) {
               console.log('err: ', err);
               return;
            }
            if (outErr) {
               console.log('outErr: ', outErr);
               return;
            }
            if (out) {
               console.log('out: ', out);
            }
         });
      }
      running();
   }, pauseTime);
}