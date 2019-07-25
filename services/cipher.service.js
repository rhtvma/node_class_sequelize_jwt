const crypto = require('crypto');
const config = require('config');
const LoggerService = require('../services/logger.service');
const logg = new LoggerService('CipherService', true).logger;

class Cipher {
    constructor() {
        this.conf = config.get('configuration');

        /*Generating passPhrase key*/
        this.passPhrase = this.conf.cipho.passPhrase;

        /*Creating Encryptor and Decryptor using passPhrase key*/
        this._cipher = crypto.createCipher(this.conf.cipho.algo, this.passPhrase);
        this._dcipher = crypto.createDecipher(this.conf.cipho.algo, this.passPhrase);
    }

    set passPhrase(passphrase) {
        this._passPhrase = crypto.pbkdf2Sync(passphrase, this.conf.cipho.salt, this.conf.cipho.iteration, this.conf.cipho.length, this.conf.cipho.digest);
    }

    get passPhrase() {
        return this._passPhrase.toString('hex');
    }

    get cipher() {
        /*Cleaning old reference*/
        this._cipher = undefined;
        /*Returning new instance*/
        return this._cipher = crypto.createCipher(this.conf.cipho.algo, this.passPhrase);
    }

    get dcipher() {
        this._dcipher = undefined;
        return this._dcipher = crypto.createDecipher(this.conf.cipho.algo, this.passPhrase);
    }

    encrypt(plainText) {
        try {
            if (!((plainText || '').trim()))
                return null;

            /*Re-creating cipher and saving new instance*/
            const cyfer = this.cipher;
            /*Using and deserting cipher here.*/
            const code = cyfer.update(plainText, 'utf-8', 'hex'),
                codeFinal = cyfer.final('hex');

            return `${code}${codeFinal}`;
        } catch (er) {
            logg.error(`${`${er.code} ${er.message}` || er.error || er}`);
        }
    }

    decrypt(code) {
        try {
            if (!((code || '').trim()))
                return null;

            const dcyfer = this.dcipher;
            const plainText = dcyfer.update(code, 'hex', 'utf-8'),
                plainTextFinal = dcyfer.final('utf-8');

            return `${plainText}${plainTextFinal}`;
        } catch (er) {
            logg.error(`${`${er.code} ${er.message}` || er.error || er}`);
        }
    }

    createPassword(password) {
        if (!((password || '').trim()))
            return null;
        return (crypto.pbkdf2Sync(password, this.conf.cipho.salt, this.conf.cipho.iteration, this.conf.cipho.length, this.conf.cipho.digest)).toString('hex');
    }
}

module.exports = Cipher;
