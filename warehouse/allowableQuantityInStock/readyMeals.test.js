const readyMeals = require("./readyMeals")

test("Функція, яка перевіряє значення максимальної кількості готових страв.",function () {

    var result = readyMeals.readyMeals
    expect(result).toBe(3)
})