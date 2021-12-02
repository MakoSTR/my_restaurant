const chanceToSpoil = require("./chanceToSpoil")

test("Перевіряємо значення шансу на те, що інградієнт може спортитись.", function () {

    var result = chanceToSpoil.chanceToSpoil
    expect(result).toBe(1000)
})