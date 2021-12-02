const ingradients = require("./ingradients")

test("Функція, яка перевіряє значення максимальної кількості інградієнтів.",function () {

    var result = ingradients.ingradients
    expect(result).toBe(10)
})