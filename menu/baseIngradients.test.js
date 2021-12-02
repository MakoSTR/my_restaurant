const fs = require("fs")
const baseIngradients = require("./baseIngradients")

test("Функція, яка перевіряє кількість базових інградієнтів на складі.", function () {

    var result = Object.keys(baseIngradients.baseIngradients)
    expect(result).toHaveLength(16)
})