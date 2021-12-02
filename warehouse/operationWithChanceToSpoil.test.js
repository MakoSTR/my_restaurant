const operationWithChanceToSpoil = require("./operationWithChanceToSpoil")

test("Перевіряємо функцію, яка повертає нам кількість співпадінь." +
    "В 1ому випадку 0, в 2ому 1.", function () {

    operationWithChanceToSpoil.getRandomInt = jest.fn(operationWithChanceToSpoil.getRandomInt).mockImplementationOnce(function () {

        return 5
    })

    var result = operationWithChanceToSpoil.chackChanceToSpoil()
    expect(result).toBe(0)

    operationWithChanceToSpoil.getRandomInt = jest.fn(operationWithChanceToSpoil.getRandomInt).mockImplementationOnce(function () {

        return 1000
    })

    var result = operationWithChanceToSpoil.chackChanceToSpoil()

    operationWithChanceToSpoil.getRandomInt = jest.fn(operationWithChanceToSpoil.getRandomInt).mockImplementationOnce(function () {

        return 5
    })

    expect(result).toBe(1)
})