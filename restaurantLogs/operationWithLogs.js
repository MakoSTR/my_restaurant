const fs = require("fs")
const logsFile = require("./logs")

// Локальна змінна, в яку ми записуємо логи, щоб потім записати їх у файл.
module.exports.logs = logs = []

// Функція, яка отримує значення в параметрі і записує його в локальну змінну логів.
module.exports.addLogs = function addLogs(value) {

    // Додавання інформації в локальну змінну логів.
    exports.logs.push(value)

    // Повертаємо локальне значення логів для тестування.
    return exports.logs
}

// Функція, яка записує значення з локальної змінної логів у файл.
module.exports.writeLogs = function writeLogs() {

    // Викликаємо функцію, яка беспосередньо виконує функцію запису у файл логів.
    exports.writeFile_writeLogs()

    // Очищуємо локальне значення логів, щоб можно було записати в неї нову інформацію.
    exports.logs.length = 0

    // Повертаємо довжину локальної змінної з логами для тестування.
    // Вона має бути 0, тому що вона була очищена.
    return exports.logs.length
}

// Функція, яка беспосередньо записує локальну змінну з логами у файл.
module.exports.writeFile_writeLogs = function writeFile_writeLogs(){

    // Записуємо значення локальної змінної логів у файл.
    const data = JSON.stringify(exports.logs);
    fs.appendFileSync(__dirname + "/logs.txt", `${data}\n`)
}

// Функція, яка зчитує всю інформацію з файла логів і показує користувачу.
module.exports.showLogs = function showLogs() {

    // Викликаємо функцію, яка зчитує інформацію з файла логів.
    var result = exports.readFile_showLogs()
    result = (result).toString()
    // Показуємо користувачі логи у консолі.
    console.log(result)

    // Повертаємо значення логів для тестування.
    return result
}

// Функція, яка беспосередньо зчитує інформацію з файла логів.
module.exports.readFile_showLogs = function readFile_showLogs(){

    // Повертаємо всю зчитану з файла логів інформацію.
    return fs.readFileSync(__dirname + "/logs.txt")
}

// module.exports.getLogs = function getLogs(){
//
//     return logsFile.logsFile
// }