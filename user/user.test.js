const user = require("../user/user")

test("Перевіряємо всі функції типу GET." +
    "1 рядок - передаємо параметр." +
    "2 рядок - отримуємо цей ж параметр.", function () {

    user.setName("Maksym")
    expect(user.getName()).toBe("Maksym")

    user.setBudget(1234)
    expect(user.getBudget()).toBe(1234)

    user.setFood(["Emperor Chicken"])
    expect(user.getFood()).toContain(["Emperor Chicken"].toString())

    user.setAllergy("Soy")
    expect(user.getAllergy()).toBe("Soy")

    user.setPrice(5678)
    expect(user.getPrice()).toBe(5678)

    user.setIngradients(["Soy", "Milk"])
    expect(user.getIngradients()).toContain(["Soy"].toString())
    expect(user.getIngradients()).toContain(["Milk"].toString())

    user.setHaveAllergy(["Water", "Honey"])
    expect(user.getHaveAllergy()).toContain("Water")
    expect(user.getHaveAllergy()).toContain("Honey")

    user.setBudgetAfterPay(9012)
    expect(user.getBudgetAfterPay()).toBe(9012)

    user.setFullPayment(3456)
    expect(user.getFullPayment()).toBe(3456)
})

test("Функція запускається при старті програми і отримує значення користувача." +
    "Перевіряємо, чи всі дані отримані.", function () {

    var result = user.User("Maksym",1000,["Emperor Chicken"],["Soy"])
    expect(result[0]).toBe("Maksym")
    expect(result[1]).toBe(1000)
    expect(result[2]).toContain("Emperor Chicken")
    expect(result[3]).toContain("Soy")

})