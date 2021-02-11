const bodyParser = require('body-parser');
const Joi = require('joi');
const express = require('express');
const app = express();
const model = require('../models');
const userModel = model.User
const auth = require('../middleware/auth')
const jwtOptions = auth.jwtOptions;
const crypt = require('../services/crypt')
const passport = require(`passport`);
const jwt = require('jsonwebtoken');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.post(`/login`, async function (req, res) {
    const {
        password,
        email
    } = req.body;

    if (email && password) {
        let user = await userModel.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            res.status(401).json({
                msg: `No such user found`,
                user
            });
        }
        if (user.password === crypt(password)) {
            let payload = {
                id: user.id
            };
            let token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({
                msg: `ok`,
                token: token
            });
        } else {
            res.status(401).json({
                msg: `Password is incorrect`
            });
        }
    } else {
        res.json("missing password or username")
    }
});

app.post('/register', async function (req, res) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(12)
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password: Joi.ref('password'),
        email: Joi.string()
            .email({
                minDomainSegments: 2,
                tlds: {
                    allow: ['com', 'fr']
                }
            }).required()
    });
    const result = schema.validate(req.body, {
        abortEarly: false
    })
    if (result.error)
        return res.json(result.error.details)
    try {
        const password = crypt(req.body.password)
        const data = {
            ...req.body,
            password: password
        }
        const user = await userModel.create(data)
        delete user.dataValues.password;
        return res.status(201).json(user);
    } catch (err) {
        res.status(409).json(err.errors[0].message)
    }
});

app.get('/user', passport.authenticate('jwt', {
    session: false
}), async function (req, res) {
    const user = await userModel.findAll({
        attributes: {
            exclude: ['password']
        }
    })
    res.json(user);
});
module.exports = app;
