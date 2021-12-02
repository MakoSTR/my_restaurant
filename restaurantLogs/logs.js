const fs = require("fs")

// За допомогою logsFile можна буде отримати все ліги, які у нас є.

// Отримуємо з файла logs.txt всі логи, а саме ім'я, інградієнти на складі після замовлення, бюджет ресторану після замовлення.
var logsFile = fs.readFileSync(__dirname + "/logs.txt")

// Отриманий масив з логами записуємо у змінну logsFile.
module.exports.logsFile = logsFile = (logsFile).toString();