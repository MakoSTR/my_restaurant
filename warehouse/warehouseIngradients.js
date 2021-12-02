const fs = require("fs")

// За допомогою warehouseIngradients можна буде отримати кількість інградієнтів на складі.

// Отримуємо з файла warehouseIngradients.txt масив об'єктів з базовими інградієнтами.
var warehouseIngradients = fs.readFileSync(__dirname + "/warehouseIngradients.txt")

// Отриманий масив об'єктів присвоюємо змінній warehouseIngradients.
module.exports.warehouseIngradients = warehouseIngradients = JSON.parse(warehouseIngradients);