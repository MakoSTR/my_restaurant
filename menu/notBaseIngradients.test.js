const fs = require("fs")
const notBaseIngradients = require("./notBaseIngradients")

test("Функція, яка перевірає кількість страв.", function () {

    var result = Object.keys(notBaseIngradients.notBaseIngradients)
    expect(result).toHaveLength(13)
})