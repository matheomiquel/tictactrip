const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const auth = require('./middleware/auth')
const strategy = auth.strategy;
const userController = require('./controller/user')
const justifyController = require('./controller/justify')
const passport = require(`passport`);
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require('./cron/reset')
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.1",
        info: {
            title: "My apis in swaager",
            version: "1.0.0",
        },
        servers: [{
            url: "http://localhost:3000"
        }, ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{
            bearerAuth: [],
        }, ],
    },
    apis: ["app.js", "./controller/*.js", "./swagger_definition/*.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
