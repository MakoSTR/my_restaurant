const operationWithBudget = require("./operationWithBudget")
const restaurantBudget = require("./restaurantBudget")
const user = require("../user/user")
const operationWithTax = require("../taxes/operationWithTax");
const systemCommands = require("../systemCommands/systemCommands")

test("Функція, яка перевіряє додавання коштів у бюджет.", function () {

    // systemCommands.EXIT = jest.fn(systemCommands.EXIT).mockImplementationOnce(function () {
    //
    //     console.log("Перевіряємо бюджет.")
    // })

    // restaurantBudget.budget = 1000

    var result2 = restaurantBudget.budget

    var result = operationWithBudget._addToBudget(100)
    expect(result).toBe(parseFloat(result2) + 100)

    operationWithBudget._removeFromBudget(100)
})

test("Функція, яка перевіряє віднімання коштів з бюджета.", function () {

    operationWithBudget.removeFromBudget = jest.fn(operationWithBudget.removeFromBudget).mockImplementationOnce(function () {

        restaurantBudget.budget -= 100
        console.log("Віднімаємо кошти з бюджета.")
    })

    // restaurantBudget.budget = 1000

    var result2 = restaurantBudget.budget

    var result = operationWithBudget._removeFromBudget(100)
    expect(result).toBe(parseFloat(result2) - 100)

    // operationWithBudget._addToBudget(100)
})

test("Функція, яка перевіряє бюджет на банкротство.", function () {

    systemCommands.EXIT = jest.fn(systemCommands.EXIT).mockImplementationOnce(function () {

        console.log("Виходимо з програми.")
    })

    restaurantBudget.budget = -100
    var result = operationWithBudget.checkBudgetForBankruptcy()
    expect(result).toBe(false)
})

test("Функція, яка віднімає ціну замовлення з бюджета і додає до нього ціну з націнкою.", function () {

    operationWithTax.withdrawTaxes = jest.fn(operationWithTax.withdrawTaxes).mockImplementationOnce(function () {
        console.log("Вираховуємо податки.")
    })

    operationWithBudget.removeFromBudget = jest.fn(operationWithBudget.removeFromBudget).mockImplementationOnce(function () {
        console.log("Віднімаємо кошти з бюджета.")
    })

    operationWithBudget.addToBudget = jest.fn(operationWithBudget.addToBudget).mockImplementationOnce(function () {
        console.log("Додаємо кошти у бюджет.")
    })

    user.setPrice(100)
    user.setFullPayment(150)
    restaurantBudget.budget = 1000

    var result = operationWithBudget.Calculate()
    expect(result).toBe(true)
})