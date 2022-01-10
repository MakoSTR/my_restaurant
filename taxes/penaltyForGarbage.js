const fs = require("fs");

var penaltyForGarbage = fs.readFileSync(__dirname + "/penaltyForGarbage.txt")

module.exports.penaltyForGarbage = penaltyForGarbage = JSON.parse(penaltyForGarbage)