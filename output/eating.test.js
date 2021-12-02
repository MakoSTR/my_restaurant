const eating = require("./eating")
const user = require("../user/user")

test("Перевіряємо, чи правильно виводиться інформація, що користувач почав трапезу.", function () {

    user.setName("Maksym")
    user.setFood("Emperor Chicken")
    var result = eating.eating()
    expect(result[0]).toBe("Maksym")
    expect(result[1]).toBe("Emperor Chicken")
})