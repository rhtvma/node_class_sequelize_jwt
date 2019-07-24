const uuidv4 = require('uuid/v4'),
    uuidv5 = require('uuid/v5'),
    config = require('config');
class UtilityService {
    constructor() {
        this.conf = config.get('configuration');
    }
}

module.exports = UtilityService;
