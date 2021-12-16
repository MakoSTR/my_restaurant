const readConfigService = require ('../config/readConfig')


class Volatility {

    randomVolatilityData() {
        let data = readConfigService.getDataFromConfig()
        let ingredientVolatility = [(data['order ingredient volatility']/100 + 1), (1 - data['order ingredient volatility']/100)]
        let dishVolatility = [(data['order dish volatility']/100 + 1), (1 - data['order dish volatility']/100)]
        // console.log([ingredientVolatility[this.randomValue()], dishVolatility[this.randomValue()]])
       return [ingredientVolatility[this.randomValue()], dishVolatility[this.randomValue()]]
    }

    randomValue() {
        return Math.round(Math.random());
    }

}

const volatilityAmount = new Volatility();

module.exports = volatilityAmount;