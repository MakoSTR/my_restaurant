const fs = require("fs")

// За допомогою notBaseIngradients можна буде отримати страви, які є в меню, а також інградієнти, з яких вони складаються.

// Отримуємо з файла notBaseIngradients.txt (-> menu/notBaseIngradients.txt) масив об'єктів зі стравами.
var notBaseIngradients = fs.readFileSync(__dirname + "/notBaseIngradients.txt")

// Отриманий масив об'єктів присвоюємо змінній notBaseIngradients.
module.exports.notBaseIngradients = notBaseIngradients = JSON.parse(notBaseIngradients);
