const fs = require("fs");
// const dailyTax = require("./purchaseTax")
const operationWithDailyTax = require("./operationWithDailyTax");
const allPurchaseTax = require("./purchaseTax");

// Функція, яка записуємо всі отримані податки у файл.
module.exports.purchaseTax = function purchaseTax(value){

    // Отримуємо поточне значення податку.
    var result = allPurchaseTax.purchaseTax
    // Додаємо до поточного значення податку отримане.
    result = result + value
    // Записуємо значення податку у локальне значення.
    allPurchaseTax.purchaseTax = result

    // Викликаємо функцію, яка запише локальне значення податків у файл.
    exports.writeFile_purchaseTax()

    // Повертаємо локальне значення податків для тестування.
    return allPurchaseTax.purchaseTax
}

// Функція, яка записує локальне значення податків у файл.
module.exports.writeFile_purchaseTax = function purchaseTax(){

    // Записуємо локальне значення податку у файл.
    fs.writeFileSync(__dirname + "/purchaseTax.txt",JSON.stringify(allPurchaseTax.purchaseTax))
}

// Функція, як ресетить суму всіх податків. Тобто, ставить значення файлу 0, який містить податки.
module.exports.resetPurchaseTax = function resetPurchaseTax(){

    // Значення, яке ставити у файлі, який містить податки.
    allPurchaseTax.purchaseTax = 0

    // Викликаємо функцію, яка запише локальне значення податків у файл.
    exports.writeFile_resetPurchaseTax()

    // Повертаємо значення файлу з податками для тестування.
    return allPurchaseTax.purchaseTax
}

// Функція, яка записує локальне значення податку у файл.
module.exports.writeFile_resetPurchaseTax = function resetPurchaseTax(){

    // Записуємо значення податків у файл.
    fs.writeFileSync(__dirname + "/purchaseTax.txt",JSON.stringify(allPurchaseTax.purchaseTax))
}

// Функція, яка повертає значення податків з файлу.
module.exports.getTaxes = function getTaxes() {

    // Викликаємо функцію, яка зчитує дані з файлу податків.
    var result = exports.readFile_getTaxes()

    // Повертаємо значення податків.
    return JSON.parse(result).toFixed(1)
}

// Функція, яка зчитує податки з файлу.
module.exports.readFile_getTaxes = function readFile_getTaxes(){

    // Зчитуємо значення податків з файлу і повертаємо це значення.
    return fs.readFileSync(__dirname + "/purchaseTax.txt")
}