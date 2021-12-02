const restaurantBudget = require("./restaurantBudget")

test("Функція, яка перевіряє дані з бюджета.", function () {

    var result = restaurantBudget.budget = 1000
    expect(result).toBe(1000)
})