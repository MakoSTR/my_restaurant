const purchaseTax = require("./purchaseTax")

test("Сума податків за всі замовлені страви.", function () {

    var result = purchaseTax.purchaseTax
    expect(result).toBeDefined()
})