const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const auth = require('./middleware/auth')
const strategy = auth.strategy;
const userController = require('./controller/user')
const justifyController = require('./controller/justify')
const passport = require(`passport`);
require('./cron/reset')
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function (req, res, next) {
    if (req.is('text/*')) {
        req.text = '';
        req.setEncoding('utf8');
        req.on('data', function (chunk) {
            req.text += chunk
        });
        req.on('end', next);
    } else {
        next();
    }
});



app.use(passport.initialize());
passport.use(strategy);


app.use('/api', userController)
app.use('/api', passport.authenticate('jwt', {
    session: false
}), justifyController)
app.listen(3000, function () {
    console.log(`Express is running on port 3000`);
});

module.exports = app
