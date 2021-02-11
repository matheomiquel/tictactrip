const app = require('../app')
const assert = require("assert");
const chai = require('chai');
const chaiHttp = require('chai-http');
const {
    sequelize
} = require('../models');
chai.use(chaiHttp);
chai.should();
let token = "";
describe('hooks', function () {

    after(function () {
        sequelize.query("DELETE FROM `Users`")
    });

    it("register", (done) => {
        chai.request(app)
            .post('/api/register')
            .send({
                firstName: "toto",
                username: "tata",
                lastName: "tutu",
                email: "titi@email.fr",
                password: "bijour",
            })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });
    it("register", (done) => {
        chai.request(app)
            .post('/api/register')
            .send({
                firstName: "toto",
                username: "other",
                lastName: "tutu",
                email: "titi@email.fr",
                password: "bijour",
            })
            .end((err, res) => {
                res.should.have.status(409);
                done();
            });
    });
    it("register", (done) => {
        chai.request(app)
            .post('/api/register')
            .send({
                firstName: "toto",
                username: "tata",
                lastName: "tutu",
                email: "other@email.fr",
                password: "bijour",
            })
            .end((err, res) => {
                res.should.have.status(409);
                done();
            });
    });
    it("login", (done) => {
        chai.request(app)
            .post('/api/login')
            .send({
                email: "titi@email.fr",
                password: "bijour",
            })
            .end((err, res) => {
                res.should.have.status(200);
                token = `Bearer ${res.body.token}`;
                done();
            });
    });


    it("liste des utilisateurs sans être connecté", (done) => {
        chai.request(app)
            .get('/api/user')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it("liste des utilisateurs en étant connecté", (done) => {
        chai.request(app)
            .get('/api/user')
            .set('Authorization', token)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
