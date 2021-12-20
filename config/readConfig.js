const data = require('./config.json');



class ReadJson {

    getDataFromConfig() {
            return data;
    }
}

const readConfigService = new ReadJson();

module.exports = readConfigService;