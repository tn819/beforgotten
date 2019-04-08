const bcrypt = require("bcryptjs");
const passwordValidator = require("password-validator");
const validator = require("validator");

// legacy click handler approach
// const register = document.querySelector("button input[name='register']");
// const login = document.querySelector("button input[name='login']");
//
// const firstname = document.querySelector("input[name='firstname']");
// const lastname = document.querySelector("input[name='lastname']");
// const email = document.querySelector("input[type='email']");
// const password = document.querySelector("input[type='password']");
// const error = document.querySelector("div[name = 'error']");

// Create a schema
const schema = new passwordValidator();

// 8-16 characters, at least 1 uppercase and lowercase, has a digit, no spaces
schema
    .is()
    .min(8)
    .is()
    .max(16)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits()
    .has()
    .not()
    .spaces();

const validatePassword = plainTextPassword => {
    return new Promise((resolve, reject) => {
        if (schema.validate(plainTextPassword)) {
            console.log("validating pw", plainTextPassword);
            return resolve(plainTextPassword);
        } else {
            return reject(schema.validate(plainTextPassword, { list: true }));
        }
    });
};

const hashPassword = plainTextPassword => {
    return new Promise((resolve, reject) => {
        bcrypt
            .genSalt(10)
            .then(salt => {
                console.log("generated salt");
                bcrypt.hash(plainTextPassword, salt);
            })
            .then(hash => {
                console.log("generated hash");
                resolve(hash);
            })
            .catch(err => {
                reject(err);
            });
    });
};

module.exports.checkValidRegistration = (
    firstname,
    lastname,
    email,
    password
) => {
    return new Promise((resolve, reject) => {
        let updatedInputs = {};
        updatedInputs.firstname = firstname.trim();
        updatedInputs.lastname = lastname.trim();
        updatedInputs.email = email.trim();
        if (
            validator.isEmpty(updatedInputs.firstname) ||
            validator.isEmpty(updatedInputs.lastname)
        ) {
            reject("Please enter a valid full name");
        } else if (!validator.isEmail(updatedInputs.email)) {
            reject("Please enter a valid email");
        } else {
            password = password.trim();
            validatePassword(password)
                .then(result => {
                    console.log("hashing pw", password);
                    hashPassword(result);
                })
                .then(hashedPassword => {
                    updatedInputs.password = hashedPassword;
                    console.log(updatedInputs);
                    resolve(updatedInputs);
                })
                .catch(err => {
                    reject("Please enter a valid password", err);
                });
        }
    });
};
