const user = require("../user/user")

// Функція для демонстрації трапези.
module.exports.eating = function eating() {

    // Отримуємо ім`я користувача.
    var name = user.getName()

    // Отримуємо страву, яку замовив користувач.
    var food = user.getFood()

    // Виводимо повідомлення про трапезу.
    console.log(name + " eats " + food)

    console.log("-------------------------------------------------------------")

    // Повертаємо імя і страву користувача для тестування.
    return [user.getName(), user.getFood()]
}