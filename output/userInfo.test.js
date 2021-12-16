const userInfo = require("../output/userInfo")
const user = require("../user/user");
const systemCommands = require("../systemCommands/systemCommands")
const operationWithVisits = require("../visits/operationWithVisits");
const audit = require("../restaurantLogs/operationWithLogs");
const tipsService = require("../tips/tips");

describe('User Function', () => {
test("Функція, яка перевіряє, скільки користувач повинен заплатити за страву разом з націнкою.", function () {

    user.setPrice(100)
    var result = userInfo.fullPayment()
    expect(result).toBe(140)
})

test("Функція, яка перевіряє, чи немає користувача алергії, чи є.", function () {

    user.setHaveAllergy([])
    var result1 = userInfo.haveAllergy()
    expect(result1).toBe("Nothing")

    user.setHaveAllergy(["Soy"])
    var result2 = userInfo.haveAllergy()
    expect(result2).toHaveLength(1)
    expect(result2).toContain(["Soy"].toString())
})

test("Функція, яка перевіряє бюджет користувача після замовлення і виданих чаєвих.", function () {
    // user.setBudget(1000)
    // user.setPrice(100)
    tipsService.getTipsValue = jest.fn(() => 0);
    // tipsService.getTipsValue = jest.fn(tipsService.getTipsValue).mockImplementation(() => 0)

    user.getBudget = jest.fn(() => 50);
    // user.getBudget = jest.fn(user.getBudget).mockImplementation(() => 50)
    // user.getFullPayment = jest.fn(user.getFullPayment).mockImplementation(() => 39.1)
    user.getFullPayment = jest.fn(() => 39.1);
    let result = userInfo.budgetAfterPay()
    expect(result).toBe(10.9)
})

test("test userInfo.js | canBuy() function", function () {

    user.setBudget(140)
    user.setPrice(100)
    var result1 = userInfo.canBuy()
    expect(result1).toBe(true)

    user.setBudget(139)
    user.setPrice(100)
    var result2 = userInfo.canBuy()
    expect(result2).toBe(false)
})

test("test userInfo.js | StartInfoForUser() function (1st variant)", function () {

    user.setName("Maksym")
    user.setBudget(1000)
    user.setFood("Emperor Chicken")
    user.setAllergy("Soy")
    user.setIngradients(["Chicken", "Asparagus", "Milk", "Honey", "Asparagus", "Milk", "Honey", "Potatoes", "Pickles", "Feta", "Paprika", "Garlic", "Water", "Tuna", "Chocolate", "Asparagus", "Milk", "Honey"])
    user.setHaveAllergy([])
    user.setPrice(100)

    var result = userInfo.StartInfoForUser()
    expect(result[0]).toBe("Maksym")
    expect(result[1]).toBe(1000)
    expect(result[2]).toBe("Emperor Chicken")
    expect(result[3]).toBe("Soy")
    expect(result[4]).toBe(140)
    expect(result[5]).toHaveLength(0)
    expect(result[6]).toBe(860)
})

test("", function () {

    operationWithVisits.getDiscount = jest.fn(operationWithVisits.getDiscount).mockImplementationOnce(function () {

        return 0.1
    })

    audit.addLogs = jest.fn(audit.addLogs).mockImplementationOnce(function () {

        console.log("Додаємо інформацію в логи.")
    })

    audit.writeLogs = jest.fn(audit.writeLogs).mockImplementationOnce(function () {

        console.log("Записуємо логи у файл.")
    })

    operationWithVisits.resetVisits = jest.fn(operationWithVisits.resetVisits).mockImplementationOnce(function () {

        console.log("Обнуляємо кількість відвідувань.")
    })

    user.setFullPayment = jest.fn(user.setFullPayment).mockImplementationOnce(function () {

        console.log("Встановлюємо повну ціну для користувача.")
    })

    user.setPrice(100)

    var result = userInfo.fullPayment()
    expect(result).toBe(126)
})

test("test userInfo.js | start() function", function () {

    systemCommands.EXIT = jest.fn().mockImplementation(function () {
        console.log("EXIT")
    })

    user.setBudget(100)
    user.setPrice(100)
    user.setHaveAllergy(["Soy"])
    var result = userInfo.start()
    expect(result).toBe(false)
});
});

