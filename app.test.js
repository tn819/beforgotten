const supertest = require("supertest");
const app = require("./app");
const cookieSession = require("cookie-session");
const request = supertest(app);
const db = require("./utils/db");
jest.mock("./utils/db");

describe("testing noauth route", () => {
    test("GET home page with unauth", () => {
        return request.get("/").then(() => {
            expect(200);
        });
    });

    test("redirect from GET profile page with unauth", () => {
        return request.get("/profile").then(() => {
            expect(302);
        });
    });
    test("redirect from GET petition page with unauth", () => {
        return request.get("/petition").then(() => {
            expect(302);
        });
    });

    test("redirect from GET thanks page with unauth", () => {
        return request.get("/thanks").then(() => {
            expect(302);
        });
    });
    test("redirect from GET signatures page with unauth", () => {
        return request.get("/signatures").then(() => {
            expect(302);
        });
    });
    test("redirect from GET delete page with unauth", () => {
        return request.get("/delete").then(() => {
            expect(302);
        });
    });
}, 10000);

describe("testing userid route", () => {
    cookieSession.mockSession({
        userid: 1
    });
    test("redirect from GET home page with userauth", () => {
        return request.get("/").then(() => {
            expect(302);
        });
    });
    test("GET profile page with userauth", () => {
        return request.get("/profile").then(() => {
            expect(200);
        });
    });
    test("redirect from GET profile page with userauth", () => {
        return request.get("/petition").then(() => {
            expect(302);
        });
    });
    test("redirect from GET thanks page with userauth", () => {
        return request.get("/thanks").then(() => {
            expect(302);
        });
    });
    test("redirect from GET signatures page with userauth", () => {
        return request.get("/signatures").then(() => {
            expect(302);
        });
    });
    test("redirect from GET delete page with userauth", () => {
        return request.get("/delete").then(() => {
            expect(302);
        });
    });
});

describe("testing profileid route", () => {
    cookieSession.mockSession({
        userid: 1,
        profileid: 1
    });
    test("redirect from GET home page with profileauth", () => {
        return request.get("/").then(() => {
            expect(302);
        });
    });
    test("redirect from GET profile page with profileauth", () => {
        return request.get("/profile").then(() => {
            expect(302);
        });
    });
    test("GET petition page with profileauth", () => {
        return request.get("/petition").then(() => {
            expect(200);
        });
    });
    test("POST petition page with profileauth", () => {
        return request
            .post("/petition")
            .send()
            .then(() => {
                expect(200);
            });
    });
    test("redirect from GET thanks page with profileauth", () => {
        return request.get("/thanks").then(() => {
            expect(302);
        });
    });
    test("redirect from GET signatures page with profileauth", () => {
        return request.get("/signatures").then(() => {
            expect(302);
        });
    });
    test("redirect from GET delete page with profileauth", () => {
        return request.get("/delete").then(() => {
            expect(302);
        });
    });
});

describe("testing sigid route", () => {
    cookieSession.mockSession({
        userid: 1,
        profileid: 1,
        sigid: 1
    });
    test("redirect from GET home page with sigauth", () => {
        return request.get("/").then(() => {
            expect(302);
        });
    });
    test("redirect from GET profile page with sigauth", () => {
        return request.get("/profile").then(() => {
            expect(302);
        });
    });
    test("redirect from GET petition page with sigauth", () => {
        return request.get("/petition").then(() => {
            expect(302);
        });
    });
    test("GET thanks page with sigauth", () => {
        return request.get("/thanks").then(() => {
            expect(200);
        });
    });
    test("GET signatures page with sigauth", () => {
        return request.get("/signatures").then(() => {
            expect(200);
        });
    });
    test("GET delete page with sigauth", () => {
        return request.get("/delete").then(() => {
            expect(200);
        });
    });
});
