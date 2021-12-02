const readyMeals = require("./readyMeals")

test("Функція, яка перевіряє кількість страв, які є на складі." +
    "Якщо їх не 13, то помилка.", function () {

    var result = Object.keys(readyMeals.readyMeals)
    expect(result).toHaveLength(13)
})