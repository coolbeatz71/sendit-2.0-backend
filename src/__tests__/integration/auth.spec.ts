import request from 'supertest';
import faker from 'faker';
import { Auth } from '../../api/controllers/auth';
import app from '../../App';
import { USER_PASSWORD } from '../../database/config';
import { signinValidationError, signupValidationError } from '../../../__mocks__';

const authTests = () => {
  const agent = request(app);

  describe(Auth.prototype.signIn, () => {
    it('should successfully signin the user', async () => {
      const res = await agent
        .post('/api/v1/auth/signin')
        .send({
          email: 'user@email.com',
          password: USER_PASSWORD,
        })
        .set('accept', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.data).toBeDefined();
    });

    it('should throw validation error', async () => {
      const res = await agent
        .post('/api/v1/auth/signin')
        .send({
          email: 'wrong-email',
        })
        .set('accept', 'application/json');
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual(signinValidationError);
    });

    it('should respond no user found', async () => {
      const res = await agent
        .post('/api/v1/auth/signin')
        .send({
          email: 'user-wrong@email.com',
          password: USER_PASSWORD,
        })
        .set('accept', 'application/json');
      expect(res.status).toBe(404);
      expect(res.body.message).toEqual('No user found with the provided email address');
    });

    it('should respond password is incorrect', async () => {
      const res = await agent
        .post('/api/v1/auth/signin')
        .send({
          email: 'user@email.com',
          password: '123Incorrect-password',
        })
        .set('accept', 'application/json');
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('The password you provided is incorrect');
    });
  });

  describe(Auth.prototype.signUp, () => {
    it('should successfully sign up the user', async () => {
      const res = await agent
        .post('/api/v1/auth/signup')
        .send({
          password: USER_PASSWORD,
          email: 'user_2@email.com',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        })
        .set('accept', 'application/json');
      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.isLoggedIn).toBeFalsy();
      expect(res.body.data.isAdmin).toBeFalsy();
    });

    it('should throw email duplication error', async () => {
      const res = await agent
        .post('/api/v1/auth/signup')
        .send({
          password: USER_PASSWORD,
          email: 'user_2@email.com',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        })
        .set('accept', 'application/json');
      expect(res.status).toBe(409);
      expect(res.body.message).toEqual('Account with that email address already exists');
    });

    it('should throw validation error', async () => {
      const res = await agent
        .post('/api/v1/auth/signup')
        .send({
          password: '',
          email: 'wrong-email',
          firstName: 'firstName111',
          lastName: 'lastName111',
        })
        .set('accept', 'application/json');
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual(signupValidationError);
    });
  });
};

export default authTests;
