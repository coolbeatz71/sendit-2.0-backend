import request from 'supertest';
import app from '../../App';
import { User } from './../../database/models/User';
import { Status } from './../../interfaces/models.interface';
import { Admin } from '../../api/controllers/admin';
import { USER_PASSWORD, JWT_NON_AUTH_ADMIN } from '../../database/config';
import { updateParcelValidationError, updateLocationValidationError } from '../../../__mocks__';

const adminTests = () => {
  const agent = request(app);
  const notFoundToken: string = `Bearer ${JWT_NON_AUTH_ADMIN}`;

  let adminToken: string;
  let userToken: string;
  let nonAuthAdminToken: string;
  let parcelId: string;
  let destination: string;

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

  describe(Admin.prototype.getAllParcels, () => {
    it('should successfully get all parcels', async () => {
      const res = await agent
        .get('/api/v1/admin/parcels')
        .set('Authorization', adminToken)
        .set('accept', 'application/json');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
      expect(res.body.data).toHaveLength(2);
      parcelId = res.body.data[0]._id;
      destination = res.body.data[0].destination;
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

  describe(Admin.prototype.updateParcelStatus, () => {
    it('should successfully update parcel status', async () => {
      const res = await agent
        .put(`/api/v1/admin/parcels/status/${parcelId}`)
        .set('Authorization', adminToken)
        .set('accept', 'application/json')
        .send({
          status: Status.TRANSITING,
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toEqual('Parcel status successfully updated');
      expect(res.body.data.status).toEqual('transiting');
    });

    it('should throw validation error', async () => {
      const res = await agent
        .put(`/api/v1/admin/parcels/status/${parcelId}`)
        .set('Authorization', adminToken)
        .set('accept', 'application/json')
        .send({
          status: '',
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual(updateParcelValidationError);
    });

    it('should throw invalid params error', async () => {
      const res = await agent
        .put(`/api/v1/admin/parcels/status/wrong-id-here`)
        .set('Authorization', adminToken)
        .set('accept', 'application/json')
        .send({
          status: Status.TRANSITING,
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('The query params is invalid');
    });

    it('should throw invalid value for status error', async () => {
      const res = await agent
        .put(`/api/v1/admin/parcels/status/${parcelId}`)
        .set('Authorization', adminToken)
        .set('accept', 'application/json')
        .send({
          status: 'wrong status',
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('Invalid value for the status');
    });

    it('should throw status duplication error', async () => {
      const res = await agent
        .put(`/api/v1/admin/parcels/status/${parcelId}`)
        .set('Authorization', adminToken)
        .set('accept', 'application/json')
        .send({
          status: Status.TRANSITING,
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('the new status must be different from the old');
    });

    it('should throw status duplication error', async () => {
      const res = await agent
        .put(`/api/v1/admin/parcels/status/${parcelId}`)
        .set('Authorization', adminToken)
        .set('accept', 'application/json')
        .send({
          status: Status.TRANSITING,
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('the new status must be different from the old');
    });

    it('should fail to update the parcel status', async () => {
      const res = await agent
        .put(`/api/v1/admin/parcels/status/5c0a7922c9d89830f4911426`)
        .set('Authorization', adminToken)
        .set('accept', 'application/json')
        .send({
          status: Status.CANCELLED,
        });
      expect(res.status).toBe(500);
      expect(res.body.message).toEqual('Failed to update the parcel status');
    });
  });

  describe(Admin.prototype.updateParcelLocation, () => {
    it('should successfully update the presentLocation and status to transiting', async () => {
      const res = await agent
        .put(`/api/v1/admin/parcels/location/${parcelId}`)
        .set('Authorization', adminToken)
        .set('accept', 'application/json')
        .send({
          presentLocation: 'Rwanda Kigali',
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toEqual('Parcel present location successfully updated');
      expect(res.body.data.presentLocation).toEqual('Rwanda Kigali');
      expect(res.body.data.status).toEqual('transiting');
    });

    it('should successfully update the presentLocation and status to delivered', async () => {
      const res = await agent
        .put(`/api/v1/admin/parcels/location/${parcelId}`)
        .set('Authorization', adminToken)
        .set('accept', 'application/json')
        .send({
          presentLocation: destination,
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toEqual('Parcel present location successfully updated');
      expect(res.body.data.presentLocation).toEqual(destination);
      expect(res.body.data.status).toEqual('delivered');
    });

    it('should throw invalid query params error', async () => {
      const res = await agent
        .put('/api/v1/admin/parcels/location/wrong-id-here')
        .set('Authorization', adminToken)
        .set('accept', 'application/json')
        .send({
          presentLocation: destination,
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('The query params is invalid');
    });

    it('should throw validation error', async () => {
      const res = await agent
        .put(`/api/v1/admin/parcels/location/${parcelId}`)
        .set('Authorization', adminToken)
        .set('accept', 'application/json')
        .send({
          presentLocation: '',
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual(updateLocationValidationError);
    });

    it('should throw no parcel found error', async () => {
      const res = await agent
        .put('/api/v1/admin/parcels/location/5c0a7922c9d89830f4911426')
        .set('Authorization', adminToken)
        .set('accept', 'application/json')
        .send({
          presentLocation: 'Rwanda Kigali',
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toEqual('No parcel was found');
    });

    it('should throw presenLocation duplication error', async () => {
      const res = await agent
        .put(`/api/v1/admin/parcels/location/${parcelId}`)
        .set('Authorization', adminToken)
        .set('accept', 'application/json')
        .send({
          presentLocation: destination,
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('the new present location must be different from the old');
    });
  });

  describe(Admin.prototype.countParcels, () => {
    it('should successfully count parcels', async () => {
      const res = await agent
        .get('/api/v1/admin/parcels/count/')
        .set('Authorization', adminToken)
        .set('accept', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual({ pending: 1, transiting: 0, delivered: 1, cancelled: 0 });
    });
  });
};

export default adminTests;
