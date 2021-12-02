const fs = require("fs")

// За допомогою baseIngradients можна буде отримати інградієнти, які у нас є і їх ціну.

// Отримуємо з файла baseIngradients.txt (-> menu/baseIngradients.txt) масив об'єктів з базовими інградієнтами.
var baseIngradients = fs.readFileSync(__dirname + "/baseIngradients.txt")

// Отриманий масив об'єктів присвоюємо змінній baseIngradients.
module.exports.baseIngradients = baseIngradients = JSON.parse(baseIngradients);