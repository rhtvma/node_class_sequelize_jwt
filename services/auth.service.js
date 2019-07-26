const jwt = require('jsonwebtoken');
const config = require('config');

class TokenService {
    constructor() {
        this.conf = config.get('configuration');
        this.secretOrPrivateKey = this.conf.jwt.secret;
        this.jwtSignOptions = {
            algorithm: this.conf.jwt.algorithm,
            expiresIn: this.conf.jwt.tokenLife,
            audience: this.conf.jwt.audience,
            issuer: this.conf.jwt.issuer,
            subject: this.conf.jwt.subject
        };
    }

    generateToken(payload, callback) {
        jwt.sign(payload, this.secretOrPrivateKey, this.jwtSignOptions, callback);
    }

    refreshToken(payload, refreshOptions, callback) {
        const payload = jwt.verify(payload, this.secretOrPrivateKey, refreshOptions.verify);
        delete payload.iat;
        delete payload.exp;
        delete payload.nbf;
        delete payload.jti; //We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
        const jwtSignOptions = this.jwtSignOptions.jwtid = refreshOptions.jwtid;
        // The first signing converted all needed options into claims, they are already in the payload
        //https://gist.github.com/ziluvatar/a3feb505c4c0ec37059054537b38fc48
        return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
    }

    // token2 = tokenGenerator.refresh(token, { verify: { audience: 'myaud', issuer: 'myissuer' }, jwtid: '2' });


    verify(token, iss, aud, sub, callback) {
        jwt.verify(token, this.conf.jwt.secret, {
            algorithm: this.conf.jwt.algorithm,
            issuer: iss || this.conf.jwt.issuer,
            audience: aud || this.conf.jwt.audience,
            subject: sub || this.conf.jwt.subject
        }, callback);
    }
    
    // verify(token, iss, aud, sub, callback) {
    // verify(token) {
    //     return jwt.verify(token, this.secretOrPrivateKey, this.jwtSignOptions);
    // }

}

module.exports = TokenService;
