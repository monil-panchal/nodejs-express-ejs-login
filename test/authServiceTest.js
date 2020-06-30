import chai from 'chai';
import AuthService from '../src/service/authService.js'

const expect = chai.expect
const assert = chai.assert
const authService = new AuthService()

// Integration testing to authenticating user

describe('fetchUser() test for checking if user exist' , () => {

    let user = {
        email: 'Monil.panchal@dal.ca'
    }

    it('user should exist in the system ', async () => {
        let responseObj = await authService.fetchUser(user)

        expect(responseObj)
        assert.isNotNull(responseObj)
        assert.isNotNull(responseObj.email)
        expect(responseObj.email).to.equal(user.email);
    });
});


describe('validatePassword() test for validating the plain and encrypted password' , () => {

    let userRequest = {
        email: 'Monil.panchal@dal.ca',
        password: 'password'
    }

    let userFromDB = {
        email: 'Monil.panchal@dal.ca',
        password: '$2b$10$r6qtmoK1A1BQuiNXygiESuHsWM/LwBaQGOeT0rM0hR6gvr13PPUtS'
    }

    it('user password should be matched and validated in the system ', async () => {
        let responseObj = await authService.validatePassword(userRequest, userFromDB)

        expect(responseObj)
        assert.isNotNull(responseObj)
        assert.isTrue(responseObj)

    });
});