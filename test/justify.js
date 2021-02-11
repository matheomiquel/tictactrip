const app = require('../app')
const assert = require("assert");
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const {
    sequelize
} = require('../models');
chai.use(chaiHttp);
chai.should();
let token = "";
let string = "";
for (let i = 0; i < 80000; i++) {
    string += "bijour "
}
describe('hooks', function () {
    before(function () {
        sequelize.query("DELETE FROM `Users`")
    })
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

    it("liste des utilisateurs en étant connecté", (done) => {
        chai.request(app)
            .post('/api/justify')
            .set('Authorization', token)
            .set('Content-Type', 'text/plain')
            .send(string)
            .end((err, res) => {
                const result = res.text.split('\n');
                result.map(line => {
                    expect(line.length).to.be.below(81);
                })
                res.should.have.status(200);
                done();
            });
    });
    it("liste des utilisateurs en étant connecté", (done) => {
        chai.request(app)
            .post('/api/justify')
            .set('Authorization', token)
            .set('Content-Type', 'text/plain')
            .send("bijour")
            .end((err, res) => {
                const result = res.text.split('\n');
                result.map(line => {
                    expect(line.length).to.be.below(81);
                })
                res.should.have.status(402);
                done();
            });
    });
});
