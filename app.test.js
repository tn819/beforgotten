const supertest = require("supertest");
const app = require("./app");
const cookieSession = require("cookie-session");
const request = supertest(app);

describe("testing unauthorized route", () => {
    it("GET home page with unauth", () => {
        request.get("/").expect(200);
    });
    it("redirect from GET profile page with unauth", done => {
        request.get("/profile").expect(302);
        done();
    });
    it("redirect from GET petition page with unauth", done => {
        request.get("/petition").expect(302);
        done();
    });
    it("redirect from GET thanks page with unauth", done => {
        request.get("/thanks").expect(302);
        done();
    });
    it("redirect from GET profile page with unauth", done => {
        request.get("/signatures").expect(302);
        done();
    });
    it("redirect from GET profile page with unauth", done => {
        request.get("/delete").expect(302);
        done();
    });
});

describe("testing userid route", () => {
    cookieSession.mockSession({
        userid: 1
    });
    it("redirect from GET home page with userauth", done => {
        request.get("/").expect(302);
        done();
    });
    it("GET profile page with userauth", done => {
        request.get("/profile").expect(200);
        done();
    });
    it("redirect from GET profile page with userauth", done => {
        request.get("/petition").expect(302);
        done();
    });
    it("redirect from GET profile page with userauth", done => {
        request.get("/thanks").expect(302);
        done();
    });
    it("redirect from GET profile page with userauth", done => {
        request.get("/signatures").expect(302);
        done();
    });
    it("redirect from GET profile page with userauth", done => {
        request.get("/delete").expect(302);
        done();
    });
});

describe("testing profileid route", () => {
    cookieSession.mockSession({
        userid: 1,
        profileid: 1
    });
    it("redirect from GET home page with profileauth", done => {
        request.get("/").expect(302);
        done();
    });
    it("redirect from GET profile page with profileauth", done => {
        request.get("/profile").expect(302);
        done();
    });
    it("GET petition page with profileauth", done => {
        request.get("/petition").expect(200);
        done();
    });
    it("redirect from GET thanks page with profileauth", done => {
        request.get("/thanks").expect(302);
        done();
    });
    it("redirect from GET signatures page with profileauth", done => {
        request.get("/signatures").expect(302);
        done();
    });
    it("redirect from GET delete page with profileauth", done => {
        request.get("/delete").expect(302);
        done();
    });
});
describe("testing sigid route", () => {
    cookieSession.mockSession({
        userid: 1,
        profileid: 1,
        sigid: 1
    });
    it("redirect from GET home page with sigauth", done => {
        request.get("/").expect(302);
        done();
    });
    it("redirect from GET profile page with sigauth", done => {
        request.get("/profile").expect(302);
        done();
    });
    it("redirect from GET petition page with sigauth", done => {
        request.get("/petition").expect(302);
        done();
    });
    it("GET thanks page with sigauth", done => {
        request.get("/thanks").expect(200);
        done();
    });
    it("GET signatures page with sigauth", done => {
        request.get("/signatures").expect(200);
        done();
    });
    it("GET delete page with sigauth", done => {
        request.get("/delete").expect(200);
        done();
    });
});
