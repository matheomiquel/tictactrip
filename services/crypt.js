const crypto = require('crypto');
const crypt = function (password) {
    return crypto.createHmac('sha256', password)
        .update('I love cupcakes')
        .digest('hex');
}
module.exports = crypt
