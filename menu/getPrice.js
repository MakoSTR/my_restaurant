const baseIngradients = require("./baseIngradients")

// Пусте число, в яке ми записуємо загальну суму інградієнтів, які входять у страву.
var money = 0
// Функція, яка отримує у параметрі масив інградієнтів, перебирає його і обраховую ціну. Результат записує у змінну money.
function getAllPrice(ingradients) {
    // Цикл перебору інградієнтів.
    for (var i = 0; i < ingradients.length; i++) {
        // Якщо елемент входить у список з базовими інградієнтами, то отримуємо його ціну і додаємо у локальну змінну money
        if (baseIngradients.baseIngradients.hasOwnProperty(ingradients[i])){
            // Добавляємо ціну кожного інградієнта у змінну money.
            money = money + baseIngradients.baseIngradients[ingradients[i]]
        } else {
            console.log("EXIT: getPrice.js/14")
            return false
        }
    }
    // Повертаємо результат, а саме - загальну ціну, у функцію price().
    return money
}

// Функція, яка повертає ціну за всі базові інградієнти, які ми передаємо у параметрі.
module.exports.price = function price(ingradients) {
    // Передаємо інградієнти, які отримуємо в параметрі у функцію getAllPrice(), а результат її присвоюємо у змінну result.
    var result = getAllPrice(ingradients)
    // Важливо ! Після отримання ціни, ми передаємо її дальше, а локальну зміну потрібно ресетнути.
    // Ресет для того, щоб при наступному замовлення локальна зміна була пуста.
    // Якщо не буде пустою - то замість однієї ціни, буде - дві.
    money = 0
    // Результат повертаємо у main.js.
    return result
}