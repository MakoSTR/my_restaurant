const volatility = require("./volatility")

describe('VolatilityService Class', () => {
    test("Checkin randomVolatilityData function if volatility value are array which include any two numbers from expecting array ", function () {
        let result = volatility.randomVolatilityData();
        expect([0.9, 1.1, 1.25, 0.75])
            .toEqual(expect.arrayContaining(result));

    });
});