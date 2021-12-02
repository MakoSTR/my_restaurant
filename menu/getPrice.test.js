const getPrice = require("./getPrice")

test("Функція, яка перевіряє вартість всіх базових інградієнтів.", function () {


    var result1 = getPrice.price(["Chicken"])
    expect(result1).toBe(20)

    var result2 = getPrice.price(["Tuna"])
    expect(result2).toBe(25)

    var result3 = getPrice.price(["Potatoes"])
    expect(result3).toBe(3)

    var result4 = getPrice.price(["Asparagus"])
    expect(result4).toBe(50)

    var result5 = getPrice.price(["Milk"])
    expect(result5).toBe(5)

    var result6 = getPrice.price(["Honey"])
    expect(result6).toBe(15)

    var result7 = getPrice.price(["Paprika"])
    expect(result7).toBe(4)

    var result8 = getPrice.price(["Garlic"])
    expect(result8).toBe(3)

    var result9 = getPrice.price(["Water"])
    expect(result9).toBe(1)

    var result10 = getPrice.price(["Lemon"])
    expect(result10).toBe(2)

    var result11 = getPrice.price(["Tomatoes"])
    expect(result11).toBe(4)

    var result12 = getPrice.price(["Pickles"])
    expect(result12).toBe(2)

    var result13 = getPrice.price(["Feta"])
    expect(result13).toBe(7)

    var result14 = getPrice.price(["Vinegar"])
    expect(result14).toBe(1)

    var result15 = getPrice.price(["Rice"])
    expect(result15).toBe(2)

    var result16 = getPrice.price(["Chocolate"])
    expect(result16).toBe(5)

    var result16 = getPrice.price(["Nothing"])
    expect(result16).toBe(false)
})