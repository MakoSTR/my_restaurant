const tax = require("./tax")

test("Функція, яка перевіряє значення податку.", function () {

    var result = tax.tax
    expect(result).toBe(0.1)
})

