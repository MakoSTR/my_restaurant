const fs = require("fs")

// Отримуємо % націнки страви з файлу.
if (fs.existsSync(__dirname + "/percent.txt")) {
    var percent = fs.readFileSync(__dirname + "/percent.txt")
}else{
    var percent = 1.4
}

// Отриманий % записуємо у змінну percent.
module.exports.percent = percent = JSON.parse(percent)