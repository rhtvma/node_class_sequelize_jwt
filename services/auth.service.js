const jwt = require('jsonwebtoken');
const config = require('config');

class TokenService {
    constructor() {
        this.conf = config.get('configuration');
    }

    generateToken(payload, callback) {
        jwt.sign(payload,
            this.conf.jwt.secret,
            {
                algorithm: this.conf.jwt.algorithm,
                expiresIn: this.conf.jwt.tokenLife,
                audience: this.conf.jwt.audience,
                issuer: this.conf.jwt.issuer,
                subject: this.conf.jwt.subject
            },
            callback);
    }

    verify(token, iss, aud, sub, callback) {
        jwt.verify(token, this.conf.jwt.secret, {
            algorithm: this.conf.jwt.algorithm,
            issuer: iss || this.conf.jwt.issuer,
            audience: aud || this.conf.jwt.audience,
            subject: sub || this.conf.jwt.subject
        }, callback);
    }

}

module.exports = TokenService;
