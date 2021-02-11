const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const model = require('../models');
const userModel = model.User
const passportJWT = require(`passport-jwt`);
// ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;
// JwtStrategy which is the strategy for the authentication
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = `wowwow`;
const strategy = new JwtStrategy(jwtOptions, async function (jwt_payload, next) {
    let user = await userModel.findByPk(jwt_payload.id);
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

module.exports = {
    strategy,
    jwtOptions
}
