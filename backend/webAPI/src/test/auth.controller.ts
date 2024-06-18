import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import Server from '../server';

describe('AuthController', () => {
  it('should Ping auth', () =>
    request(Server)
      .get('/api/v1/auth/')
      .expect('Content-Type', /json/)
      .then((r: any) => {
        expect(r.body).to.be.an('object').that.has.property('user_id');
      }));

  it('should signup a user', () =>
    request(Server)
      .post('/api/v1/auth/signup')
      .send({ name: 'test', email: 'test@test.com', password: 'test' })
      .expect('Content-Type', /json/)
      .then((r: any) => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('message')
          .equal('User created successfully');
      }));

  it('should login a user', () =>
    request(Server)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'test' })
      .expect('Content-Type', /json/)
      .then((r: any) => {
        expect(r.body).to.be.an('object').that.has.property('token');
      }));

  it('should refresh a token', () =>
    request(Server)
      .post('/api/v1/auth/refreshToken')
      .set('refresh_token', 'some_refresh_token')
      .expect('Content-Type', /json/)
      .then((r: any) => {
        expect(r.body).to.be.an('object').that.has.property('token');
      }));

  it('should logout a user', () =>
    request(Server)
      .post('/api/v1/auth/logout')
      .set('refresh_token', 'some_refresh_token')
      .expect('Content-Type', /json/)
      .then((r: any) => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('message')
          .equal('Logged out.');
      }));
});

