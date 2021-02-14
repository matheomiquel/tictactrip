const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const model = require('../models');
const userModel = model.User
const justify = require('../services/justify').justify
const stringReduce = require('../services/justify').stringReduce
const addSpace = require('../services/justify').addSpace
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/**
 * @swagger
 * /api/justify:
 *  post:
 *    description: inscrit un utilisateur
 *    tags: [Justify]
 *    requestBody:
 *        required: true
 *        content:
 *            text/plain:
 *                schema:
 *                  type: string
 *    responses:
 *      '200':
 *        description: Renvoie le text envoyé au format justifié.
 *      '401':
 *        description: L'utilisateur n'est pas connecté.
 *      '402':
 *        description: L'utilisateur a dépassé sa limite journalière.
 */
app.post('/justify', async function (req, res) {
    const user = await userModel.findByPk(req.user.id, {
        attributes: ['word', 'id']
    })
    const word = (req.text.match(/\S+/g))
    if ((user.word + word.length) > 80000)
        return res.status(402).json("Payment Required.");
    user.word += word.length;
    user.save()
    const paragraph = stringReduce(req.text);
    const withoutSpacing = paragraph.map(para => {
        return justify(para.match(/\S+/g))
    }).join('').split('\n')
    const result = (addSpace(withoutSpacing));
    res.send(result.join('\n'))
})

module.exports = app;
