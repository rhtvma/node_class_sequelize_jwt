const ConstantService = require('../services/constants.service'),
    DBService = require('../services/db.service'),
    async = require('async');

class ValidatorInterface {
    constructor() {
        if (this.constructor === ValidatorInterface) {
            throw new TypeError('Cannot construct abstract class/interface.');
        } else if (this.validateSignupData === ValidatorInterface.validateSignupData) {
            throw new TypeError('Please implement method validateSignupData.');
        } else if (this.validateSearchMatchData === ValidatorInterface.validateSearchMatchData) {
            throw new TypeError('Please implement method validateSearchMatchData.');
        }

        this.constants = new ConstantService();
        this.dbService = new DBService();
    }

    // abstract Login validator
    validateLoginData(req, res, next) {
        throw new TypeError('Please call method validateLoginData of derived class.');
    }

    // abstract Signup validator
    validateSignupData(req, res, next) {
        throw new TypeError('Please call method validateSignupData of derived class.');
    }

    // abstract Search My Match validator
    validateSearchMatchData(req, res, next) {
        throw new TypeError('Please call method validateSearchMatchData of derived class.');
    }

    // abstract Match Making validator
    validateMatchMakingData(req, res, next) {
        throw new TypeError('Please call method validateMatchMakingData of derived class.');
    }

    // abstract Get My Likes validator
    validateGetAllMyLikesData(req, res, next) {
        throw new TypeError('Please call method validateGetMyLikesData of derived class.');
    }

    // abstract Block A User Data validator
    validateBlockAUserData(req, res, next) {
        throw new TypeError('Please call method validateBlockAUserData of derived class.');
    }

    // abstract Block Users List validator
    validateBlockUsersListData(req, res, next) {
        throw new TypeError('Please call method validateBlockUsersListData of derived class.');
    }

    // abstract "Get List of Users blocked by me" validator
    validateGetBlockedUsersData(req, res, next) {
        throw new TypeError('Please call method validateGetBlockedUsersData of derived class.');
    }

    checkEthnicity(ethArray) {
        let result = true;

        if (ethArray.length < 1)    // Not a mandatory field.
            return true;

        for (let eth of ethArray) {
            result = result && (this.constants.allEthnicity().indexOf(eth.trim().toLowerCase()) >= 0);
            if (!result)
                break;
        }
        return result;
    }

    verifyUserName(userName, query, cb) {
        return this.dbService.executeQuery(query, [userName], cb);
    }

    verifyUserId(uidArr, query, cb) {
        async.map(uidArr, (uid, callback) => {
            this.dbService.executeQuery(query, [uid], callback);
        }, cb);
    }

    isValidEmail(email) {
        return (/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i).test(email);
        // return (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i).test(email);
    }

    isValidPhone(phoneNumber) {
        // this.pn = new PhoneNumber(phoneNumber);
        // return this.pn.isValid();

        return (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging')
            ? (/^(?:(?:(\+|00)?(1|91)\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/g).test(phoneNumber)
            // ? (/^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/g).test(phoneNumber)
            : (/^(?:(?:(\+|00)?(1|91)\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/g).test(phoneNumber);

    }

    isPhoneRegistered(phoneNumber, query, cb) {
        this.dbService.executeQuery(query, [phoneNumber], cb);
    }

    verifyRatingEligibility(query, params, callback) {
        return this.dbService.executeQuery(query, params, callback);
    }

    isInteger(val) {
        return !(isNaN(parseInt(val, 10)));
    }
}

module.exports = ValidatorInterface;
