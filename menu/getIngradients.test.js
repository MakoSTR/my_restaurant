const getIngradients = require("./getIngradients")

test("Функція, яка перевіряє скільки базових інградієнтів входить у склад страви.", function () {

    var food = "Emperor Chicken"
    var result = getIngradients.ingradients(food)
    expect(result).toHaveLength(19)

    var food = "Fries"
    var result = getIngradients.ingradients(food)
    expect(result).toHaveLength(1)

    var food = "Irish Fish"
    var result = getIngradients.ingradients(food)
    expect(result).toHaveLength(3)
})