import { User } from './../../database/models/User';
import request from 'supertest';
import app from '../../App';
import { Parcels } from '../../api/controllers/parcels';
import { USER_PASSWORD, JWT_NON_AUTH_ADMIN } from '../../database/config';

const adminTests = () => {
  const agent = request(app);
  const notFoundToken: string = `Bearer ${JWT_NON_AUTH_ADMIN}`;

  let adminToken: string;
  let userToken: string;
  let nonAuthAdminToken: string;

  beforeAll(async () => {
    const adminResponse = await agent
      .post('/api/v1/auth/signin')
      .send({
        email: 'loggedin_admin@email.com',
        password: USER_PASSWORD,
      })
      .set('accept', 'application/json');
    adminToken = `Bearer ${adminResponse.body.token}`;
  });

  beforeAll(async () => {
    const userResponse = await agent
      .post('/api/v1/auth/signin')
      .send({
        email: 'loggedin_user@email.com',
        password: USER_PASSWORD,
      })
      .set('accept', 'application/json');
    userToken = `Bearer ${userResponse.body.token}`;
  });

  beforeAll(async () => {
    const res = await agent
      .post('/api/v1/auth/signin')
      .send({
        email: 'admin@email.com',
        password: USER_PASSWORD,
      })
      .set('accept', 'application/json');

    const idAdmin = res.body.data._id;
    nonAuthAdminToken = `Bearer ${res.body.token}`;

    // update the admin isLoggedIn field to false
    await User.updateOne({ _id: idAdmin }, { isLoggedIn: false });
  });

  describe(Parcels.prototype.getAll, () => {
    it('should successfully get all parcels', async () => {
      const res = await agent
        .get('/api/v1/admin/parcels')
        .set('Authorization', adminToken)
        .set('accept', 'application/json');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
      expect(res.body.data).toHaveLength(2);
    });

    it('should throw authorization missing error', async () => {
      const res = await agent.get('/api/v1/admin/parcels').set('accept', 'application/json');
      expect(res.status).toBe(401);
      expect(res.body.message).toEqual('Authorization is missing');
    });

    it('should throw invalid token error', async () => {
      const res = await agent
        .get('/api/v1/admin/parcels')
        .set('Authorization', 'Bearer wrong-token-here')
        .set('accept', 'application/json');
      expect(res.status).toBe(401);
      expect(res.body.message).toEqual('The token appears to be invalid or expired');
    });

    it('should throw Access forbidden error', async () => {
      const res = await agent
        .get('/api/v1/admin/parcels')
        .set('Authorization', userToken)
        .set('accept', 'application/json');
      expect(res.status).toBe(403);
      expect(res.body.message).toEqual('Access forbidden: only authenticated admin is authorized');
    });

    it('should throw user not found with the token error', async () => {
      const res = await agent
        .get('/api/v1/admin/parcels')
        .set('Authorization', notFoundToken)
        .set('accept', 'application/json');
      expect(res.status).toBe(401);
      expect(res.body.message).toEqual('The token appears to be invalid or expired');
    });

    it('should throw not logged in admin error', async () => {
      const res = await agent
        .get('/api/v1/admin/parcels')
        .set('Authorization', nonAuthAdminToken)
        .set('accept', 'application/json');
      expect(res.status).toBe(403);
      expect(res.body.message).toEqual('You need to first log in');
    });
  });
};

export default adminTests;
