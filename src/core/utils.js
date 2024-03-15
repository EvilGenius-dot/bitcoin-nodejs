const crypto = require('crypto');

const utils = {}

utils.IntToHex = (int) => {
    return int.toString(16)
}

utils.DataToHash = (data) => {
    return crypto.createHash('sha256').update(headers).digest('hex')
}

module.exports = utils