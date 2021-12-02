const notBaseIngradients = require("./notBaseIngradients")
const baseIngradients = require("./baseIngradients")
const readyMeals = require("../warehouse/readyMeals")

// Пустий масив, в який ми записуємо всі інградієнти (-> 14), які входять у страву.
var ingradientsArray = []

// Функція перебору всіх інградієнтів (-> 24), які входять у страву.
function getAllIngradients(food) {
    // Отримуємо масив інградієнтів, які входять у страву і присвоюємо у змінну ingradients.
    var ingradients = notBaseIngradients.notBaseIngradients[food]
    // Цикл перебору інградієнтів зі змінної ingradients.
    for (var i = 0; i < ingradients.length; i++) {
        // Якщо наш 1ий інградієнт не знаходиться у масиві з базовими елементами, то передаємо через рекурсію (-> 14) цю страву повторно у нашу функцію getAllIngradients() (-> 7).
        // Якщо наш інградієнт є у масиві з базовими інградієнтами, то записуємо його у масив (-> 21).
        if (!baseIngradients.baseIngradients.hasOwnProperty(ingradients[i])) {
            // Рекурсія. Отримує інградієнт тільки тоді, якщо він не входить масив з базовими інградієнтами.
            getAllIngradients(ingradients[i])
        }
        // Якщо інградієнт входить у список з базовими інградієнтами, то записуємо його у масив (-> 21).
        if (baseIngradients.baseIngradients.hasOwnProperty(ingradients[i])) {
            // Запис базових інградієнтів у масив.
            ingradientsArray.push(ingradients[i])
        }
    }
    // Повертаємо у функцію ingradients() (-> 29) масив зі всіма базовими інградієнтами, які входять у страву.
    return ingradientsArray
}

// Функція, яка повертає масив зі всіма інградієнтами, які входять у страву, яку ми передаємо параметром.
module.exports.ingradients = function ingradients(food) {
    // Передаємо страву, яку отримуємо в параметрі у функцію getAllIngradients (-> 5), а результат її присвоюємо у змінну result.
    var result = getAllIngradients(food)
    // Важливо ! Після отримання масиву, ми передаємо його дальше, а локальну зміну потрібно ресетнути.
    // Ресет для того, щоб при наступному замовлення локальна зміна була пуста.
    // Якщо не буде пустою - то замість однієї страви буде замовлено - дві.
    ingradientsArray = []
    // Результат повертаємо у main.js (-> 28).
    return result
}

//
module.exports.getReadyMeals = function getReadyMeals(food) {

    var ingradientsArray = []
    var readyMealsArray = []

    var ingradients = notBaseIngradients.notBaseIngradients[food]

    for (var i = 0; i < ingradients.length; i++) {

        if (baseIngradients.baseIngradients.hasOwnProperty(ingradients[i])) {

            ingradientsArray.push(ingradients[i])
        }
        if (readyMeals.readyMeals.hasOwnProperty(ingradients[i])) {

            readyMealsArray.push(ingradients[i])
        }
    }

    if (readyMealsArray.length > 0) {

        return [ingradientsArray, readyMealsArray]
    } else {

        return [ingradientsArray, readyMealsArray]
    }
}