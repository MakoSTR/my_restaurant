const percent = require("./percent")

test("Функція, яка перевіряє націнку, з якою ми продаємо страви.", function () {

    var result = percent.percent
    expect(result).toBe(1.4)
})