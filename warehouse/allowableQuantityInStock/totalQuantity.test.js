const totalQuantity = require("./totalQuantity")

test("Функція, яка перевіряє значення максимальної кількості матеріалу на складі.",function () {

    var result = totalQuantity.totalQuantity
    expect(result).toBe(200)
})