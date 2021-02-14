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


/**
 * @swagger
 * /api/register:
 *  post:
 *    description: inscrit un utilisateur
 *    tags: [User]
 *    requestBody:
 *        required: true
 *        content:
 *            application/x-www-form-urlencoded:
 *                schema:
 *                  $ref: '#/definitions/UserCreation'
 *    responses:
 *      '201':
 *        description: renvoie l'utilisateur qui vient d'être crée.
 *      '400':
 *        description: un élement manque ou n'est pas en accord avec les règles
 *      '409':
 *        description: l'email ou le username est déjà pris
 */
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
        return res.status(400).json(result.error.details)
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




/**
 * @swagger
 * /api/login:
 *  post:
 *    description: connexion d'un utilisateur
 *    consumes:
 *      - application/x-www-form-urlencoded
 *    tags: [User]
 *    requestBody:
 *        required: true
 *        content:
 *            application/x-www-form-urlencoded:
 *                schema:
 *                  $ref: '#/definitions/login'
 *    responses:
 *      '200':
 *        description: renvoie un message de validation ainsi que le token de connexion
 *      '400':
 *        description: le mot de passe ou l'email est manquant ou le mot de passe est incorrect
 *      '404':
 *        description: l'email n'a pas été trouvé
 */
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
            res.status(404).json({
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
            res.status(400).json({
                msg: `Password is incorrect`
            });
        }
    } else {
        res.status(400).json("missing password or username")
    }
});


/**
 * @swagger
 * /api/user:
 *  get:
 *    description: Renvoie le liste de tout les utilisateurs.
 *    consumes:
 *      - application/x-www-form-urlencoded
 *    tags: [User]
 *    responses:
 *      '200':
 *        description: Renvoie le liste de tout les utilisateurs.
 *      '401':
 *        description: l'utilisateur n'est pas connecté
 */
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
