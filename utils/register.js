const bcrypt = require("bcryptjs");
const passwordValidator = require("password-validator");
const validator = require("validator");

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
            resolve(plainTextPassword);
        } else {
            reject(
                "Please enter a valid password with 8-16 characters with uppercase and lowercase letters, numbers and no space"
            );
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
                console.log("generated hash", hash);
                resolve(hash);
            })
            .catch(err => {
                reject(err);
            });
    });
};

module.exports.checkValidRegistrationNoPW = (firstname, lastname, email) => {
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
            resolve(updatedInputs);
        }
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
                    return bcrypt.hash(result, 10);
                })
                .then(hashedPassword => {
                    updatedInputs.password = hashedPassword;
                    console.log(updatedInputs, hashedPassword);
                    resolve(updatedInputs);
                })
                .catch(err => {
                    reject(`Please enter a valid password (${err})`);
                });
        }
    });
};

module.exports.checkValidProfile = (age, url, city) => {
    return new Promise((resolve, reject) => {
        let updatedProfileInputs = {};

        updatedProfileInputs.age = age ? parseInt(age.trim()) : null;
        updatedProfileInputs.url = !url
            ? null
            : validator.isURL(url.trim(), {
                  protocols: ["http", "https"],
                  allow_protocol_relative_urls: true
              })
            ? url.trim()
            : reject("invalid url");
        updatedProfileInputs.city = !city
            ? null
            : city.split(" ").every(word => {
                  return validator.isAlpha(word);
              })
            ? city
            : reject("invalid city");
        console.log(updatedProfileInputs);
        resolve(updatedProfileInputs);
    });
};
