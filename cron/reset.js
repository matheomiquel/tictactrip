const cron = require('node-cron')
const {
    sequelize
} = require('../models');

cron.schedule('0 0 * * *', function () {
    sequelize.query("UPDATE `Users` SET `word`=0,`updatedAt`=NOW()")
})
