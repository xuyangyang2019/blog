// import dayjs from "dayjs";

// 函数声明在JS解析时进行函数提升，因此在同一个作用域内，不管函数声明在哪里定义，该函数都可以进行调用
// function ifZero(value) {
//   if (value > 0) {
//     return value
//   } else {
//     return 0
//   }
// }

// 函数表达式的值是在JS运行时确定，并且在表达式赋值完成后，该函数才能调用
const ifZero = (value) => {
  if (value > 0) {
    return value
  } else {
    return 0
  }
}

// const timeFilter = value => {
//   value = value.toString()
//   if (value) {
//     // taskId
//     if (value.length === 17) {
//       value = value.substr(0, 13)
//     }
//     if (value.length === 13) {
//       return dayjs(Number(value)).format('YYYY-MM-DD HH:mm:ss')
//     }
//     return dayjs.unix(Number(value)).format('YYYY-MM-DD HH:mm:ss')
//   } else {
//     return '-'
//   }
// }

const reviseTime = (value) => {
  let localTime = new Date(value),
    year = localTime.getFullYear(),
    month = localTime.getMonth() + 1,
    day = localTime.getDate(),
    hours = localTime.getHours(),
    minutes = localTime.getMinutes(),
    // seconds = localTime.getSeconds(),
    finTime
  for (let i = 0; i < 10; i++) {
    if (i === minutes) {
      minutes = "0" + minutes
    }
  }
  finTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes
  // + ":" +seconds
  return finTime
}

// // 当前零点
// let currentDay = () => {
//   let time = new Date().getTime();
//   let date = new Date(time);
//   let hour = date.getHours();
//   let minutes = date.getMinutes();
//   let seconds = date.getSeconds();
//   let mills = date.getMilliseconds();
//   time = time - hour * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000 - mills;
//   return time;
// };

// /**
//  * 格式化时间戳（秒|毫秒）
//  * @param {timestamp} value
//  */
// const timeFilter = value => {
//   value = value.toString();
//   if (value) {
//     // taskId
//     if (value.length === 17) {
//       value = value.substr(0, 13);
//     }
//     if (value.length === 13) {
//       return dayjs(Number(value)).format("YYYY-MM-DD HH:mm:ss");
//     }
//     return dayjs.unix(Number(value)).format("YYYY-MM-DD HH:mm:ss");
//   } else {
//     return "-";
//   }
// };

// /**
//  * 手机号格式化
//  * @param {String} phone
//  */
// const formatPhone = phone => {
//   phone = phone.toString();
//   return phone.substr(0, 3) + "****" + phone.substr(7, 11);
// };

// /**
//  * 4位一空格（格式化银行卡）
//  * @param {String} val
//  */
// const formatBank = val => {
//   if (val) {
//     return val
//       .toString()
//       .replace(/\s/g, "")
//       .replace(/(.{4})/g, "$1 ");
//   }
// };

// /**
//  * 千分位格式化
//  * @param {数字} val
//  */
// const toThousands = val => {
//   let num = (val || 0).toString(),
//     result = "";
//   while (num.length > 3) {
//     result = "," + num.slice(-3) + result;
//     num = num.slice(0, num.length - 3);
//   }
//   if (num) {
//     result = num + result;
//   }
//   return result;
// };

// /**
//  * 格式化小数位
//  * @param val 传入的值
//  * @param pos 保留的小数位
//  * @returns {*}
//  */
// const formatFloat = (val, pos = 2) => {
//   let f = parseFloat(val);
//   if (isNaN(f)) {
//     return false;
//   }
//   f = Math.round(val * Math.pow(10, pos)) / Math.pow(10, pos); // pow 幂
//   let s = f.toString();
//   let rs = s.indexOf(".");
//   if (rs < 0) {
//     rs = s.length;
//     s += ".";
//   }
//   while (s.length <= rs + pos) {
//     s += "0";
//   }
//   return s;
// };

// /**
//  * 格式化时长
//  * @param second
//  * @returns {string}
//  */
// const realFormatSecond = second => {
//   let secondType = typeof second;

//   if (secondType === "number" || secondType === "string") {
//     second = parseInt(second);

//     let hours = Math.floor(second / 3600);
//     second = second - hours * 3600;
//     let mimute = Math.floor(second / 60);
//     second = second - mimute * 60;

//     return hours + ":" + ("0" + mimute).slice(-2) + ":" + ("0" + second).slice(-2);
//   } else {
//     return "0:00:00";
//   }
// };

// // ========================================

// // 发朋友圈|群发|小工具 页面的子路由对应的title
// const titleFilter = routeName => {
//   console.log(routeName);
//   let titleName = {
//     circleSend: "发朋友圈",
//     circleMy: "群发助手",
//     circleLog: "朋友圈日志",
//     groupSend: "群发助手",
//     groupLog: "群发日志",
//     newFriend: "新的朋友",
//     addFriend: "添加好友",
//     autoHi: "自动打招呼",
//     qrCode: "微信二维码",
//     autoTask: "自动任务",
//     autoReply: "自动回复",
//     clearFans: "清理僵尸粉",
//     phoneManagement: "手机管理"
//   };

//   return titleName[routeName] ? titleName[routeName] : routeName;
// };

// // 当前会话列表的 聊天的时间显示
// const transformTime = time => {
//   let nt = Number(time);
//   let date = new Date(nt);
//   let h = date.getHours();
//   let m = date.getMinutes();
//   if (time > currentDay) {
//     if (m < 10) {
//       return h + ":0" + m;
//     } else {
//       return h + ":" + m;
//     }
//   } else if (time > currentDay - 24 * 60 * 60 * 1000) {
//     return "昨天";
//   } else {
//     let month = date.getMonth() + 1;
//     let day = date.getDate();
//     return `${month}月${day}日`;
//   }
// };

// // 根据labelId获取labelName
// const labelFilter = (labelId, labels) => {
//   for (const label of labels) {
//     if (label.LabelId === Number(labelId)) {
//       return label.LabelName;
//     }
//   }
//   return labelId;
// };

// /**
//  * 获取文件名
//  * @param {string} file
//  */
// const getFileName = file => {
//   let name = file;
//   try {
//     name = JSON.parse(file).name;
//     return name;
//   } catch (error) {
//     return name.replace(/.*\//, "");
//   }
// };

export default {
  ifZero,
  reviseTime
}
