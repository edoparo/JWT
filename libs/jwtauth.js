var jwt = require('jsonwebtoken');
var Promise = require('promise');
var _ = require('lodash');

const SECRET = 'supersecret';

module.export = {
    check: check,
    create: create
};

function check(token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, SECRET, function (err, session) {
            if (err || !session) {
                return reject(err)
            }

            resolve(session)
        });
    });
}

function create(details) {
    if (typeof details !== 'object') {
        details = {}
    }

    if (!details.maxAge || typeof details.maxAge !== 'number') {
        details.maxAge = 3600
    }

    details.sessionData = _.reduce(details.sessionData || {}, function (memo, val, key) {
        if (typeof val !== "function" && key !== "password") {
            memo[key] = val
        }
        return memo
    }, {});

    return jwt.sign(
        {
            data: details.sessionData
        },
        SECRET,
        {
            expiresIn: details.maxAge,
            algorithm: 'HS256'
        });

}