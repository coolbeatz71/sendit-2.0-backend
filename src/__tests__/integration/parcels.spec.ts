import faker from 'faker';
import request from 'supertest';
import app from '../../App';
import { Parcel } from './../../database/models/Parcel';
import { Parcels } from '../../api/controllers/parcels';
import { USER_PASSWORD } from '../../database/config';
import { parcelValidationError } from '../../../__mocks__';
import { Status } from '../../interfaces/models.interface';

const parcelsTests = () => {
  const agent = request(app);
  let token: string;
  let userId: string;
  let nonAuthUserToken: string;
  let parcelId: string;
  let updatedParcelId: string;

  beforeAll(async () => {
    const res = await agent
      .post('/api/v1/auth/signin')
      .send({
        email: 'loggedin_user@email.com',
        password: USER_PASSWORD,
      })
      .set('accept', 'application/json');
    token = `Bearer ${res.body.token}`;
    userId = res.body.data._id;
  });

  beforeAll(async () => {
    const res = await agent
      .post('/api/v1/auth/signin')
      .send({
        email: 'admin@email.com',
        password: USER_PASSWORD,
      })
      .set('accept', 'application/json');
    nonAuthUserToken = `Bearer ${res.body.token}`;
  });

  beforeAll(async () => {
    const res = await agent
      .post('/api/v1/parcels')
      .set('Authorization', token)
      .send({
        parcelName: faker.commerce.productName(),
        description: faker.lorem.paragraphs(4),
        pickupLocation: faker.address.country(),
        destination: faker.address.country(),
        weight: parseFloat(faker.finance.amount(10, 90, 2)),
      })
      .set('accept', 'application/json');
    const { _id } = res.body.data;
    updatedParcelId = _id;

    // update the parcel status to in delivered
    await Parcel.updateOne({ _id }, { status: Status.DELIVERED });
  });

  describe(Parcels.prototype.getAllPrivate, () => {
    it('should successfully get all private parcels', async () => {
      const res = await agent
        .get(`/api/v1/parcels/private/${userId}`)
        .set('Authorization', token)
        .set('accept', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });

    it('should throw not logged in user error', async () => {
      const res = await agent
        .get(`/api/v1/parcels/private/${userId}`)
        .set('Authorization', nonAuthUserToken)
        .set('accept', 'application/json');
      expect(res.status).toBe(403);
      expect(res.body.message).toEqual('Access forbidden: only authenticated user is authorized');
    });

    it('should throw query params invalid error', async () => {
      const res = await agent
        .get('/api/v1/parcels/private/wrong_id')
        .set('Authorization', token)
        .set('accept', 'application/json');
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('The query params is invalid');
    });

    it('should throw parcels are private error', async () => {
      const res = await agent
        .get('/api/v1/parcels/private/5c0a7922c9d89830f4911426')
        .set('Authorization', token)
        .set('accept', 'application/json');
      expect(res.status).toBe(403);
      expect(res.body.message).toEqual('Access forbidden: parcels are private');
    });
  });

  describe(Parcels.prototype.create, () => {
    it('should successfully create a new parcel', async () => {
      const res = await agent
        .post('/api/v1/parcels')
        .set('Authorization', token)
        .send({
          parcelName: faker.commerce.productName(),
          description: faker.lorem.paragraphs(4),
          pickupLocation: faker.address.country(),
          destination: faker.address.country(),
          weight: parseFloat(faker.finance.amount(10, 90, 2)),
        })
        .set('accept', 'application/json');
      expect(res.status).toBe(201);
      expect(res.body.data.pickupLocation).toEqual(res.body.data.presentLocation);
      expect(res.body.message).toEqual('Parcel was successfully created');
      expect(res.body.data.status).toEqual('pending');
      parcelId = res.body.data._id;
    });

    it('should throw validation errors', async () => {
      const res = await agent
        .post('/api/v1/parcels')
        .set('Authorization', token)
        .set('accept', 'application/json')
        .send({
          parcelName: '',
          pickupLocation: '',
          destination: '',
          weight: 'string',
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual(parcelValidationError);
    });
  });

  describe(Parcels.prototype.update, () => {
    it('should successfully update the parcel', async () => {
      const parcelName = 'Just a normal food';
      const pickupLocation = 'DR Congo';
      const res = await agent
        .put(`/api/v1/parcels/${parcelId}`)
        .set('Authorization', token)
        .set('accept', 'application/json')
        .send({
          parcelName,
          pickupLocation,
          weight: 12.9,
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toEqual('Parcel successfully updated');
      expect(res.body.data.parcelName).toEqual(parcelName);
      expect(res.body.data.pickupLocation).toEqual(pickupLocation);
      expect(res.body.data.presentLocation).toEqual(pickupLocation);
    });

    it('should throw request body cannot be empty error', async () => {
      const res = await agent
        .put(`/api/v1/parcels/${parcelId}`)
        .set('Authorization', token)
        .set('accept', 'application/json')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('The request body cannot be empty');
    });

    it('should throw fail to update the parcel error', async () => {
      const res = await agent
        .put(`/api/v1/parcels/${parcelId}`)
        .set('Authorization', token)
        .set('accept', 'application/json')
        .send({
          badProperty: 'string',
          againBadProperty: 'string',
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('Fail to update the parcel');
    });

    it('should throw query params is invalid error', async () => {
      const res = await agent
        .put(`/api/v1/parcels/wrong-id`)
        .set('Authorization', token)
        .set('accept', 'application/json')
        .send({
          parcelName: 'Just food',
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('The query params is invalid');
    });

    it('should No pending parcel was found', async () => {
      const parcelName = 'Just a normal food';
      const res = await agent
        .put('/api/v1/parcels/5c0a7922c9d89830f4911426')
        .set('Authorization', token)
        .set('accept', 'application/json')
        .send({
          parcelName,
          weight: 12.9,
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toEqual('No pending parcel was found');
    });

    it('should throw No pending parcel was found error', async () => {
      const parcelName = 'Just a normal food';
      const res = await agent
        .put('/api/v1/parcels/5c0a7922c9d89830f4911426')
        .set('Authorization', token)
        .set('accept', 'application/json')
        .send({
          parcelName,
          weight: 12.9,
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toEqual('No pending parcel was found');
    });

    it('should throw validation errors', async () => {
      const res = await agent
        .put(`/api/v1/parcels/${parcelId}`)
        .set('Authorization', token)
        .set('accept', 'application/json')
        .send({
          parcelName: '',
          description: '',
          pickupLocation: '',
          destination: '',
          weight: 'string',
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual(parcelValidationError);
    });
  });

  describe(Parcels.prototype.getById, () => {
    it('should successfully get parcel by Id', async () => {
      const res = await agent
        .get(`/api/v1/parcels/${parcelId}`)
        .set('Authorization', token)
        .set('accept', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.data.userId).toEqual(userId);
      expect(res.body.data.parcelName).toEqual('Just a normal food');
      expect(res.body.data.pickupLocation).toEqual('DR Congo');
    });

    it('should throw query params invalid error', async () => {
      const res = await agent
        .get('/api/v1/parcels/wrong-parcel-id')
        .set('Authorization', token)
        .set('accept', 'application/json');
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('The query params is invalid');
    });

    it('should throw No parcel information was found', async () => {
      const res = await agent
        .get('/api/v1/parcels/5c0a7922c9d89830f4911426')
        .set('Authorization', token)
        .set('accept', 'application/json');
      expect(res.status).toBe(404);
      expect(res.body.message).toEqual('No parcel information was found');
    });
  });

  describe(Parcels.prototype.cancel, () => {
    it('should successfully cancel a pending parcel', async () => {
      const res = await agent
        .put(`/api/v1/parcels/cancel/${parcelId}`)
        .set('Authorization', token)
        .set('accept', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.message).toEqual('Parcel successfully cancelled');
    });

    it('should throw query params invalid error', async () => {
      const res = await agent
        .put('/api/v1/parcels/cancel/wrong-parcel-id')
        .set('Authorization', token)
        .set('accept', 'application/json');
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('The query params is invalid');
    });

    it('should throw only cancel pending parcels error', async () => {
      const res = await agent
        .put(`/api/v1/parcels/cancel/${parcelId}`)
        .set('Authorization', token)
        .set('accept', 'application/json');
      expect(res.status).toBe(404);
      expect(res.body.message).toEqual('can only cancel pending parcels');
    });
  });

  describe(Parcels.prototype.delete, () => {
    it('should successfully delete  the parcel', async () => {
      const res = await agent
        .delete(`/api/v1/parcels/${parcelId}`)
        .set('Authorization', token)
        .set('accept', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.message).toEqual('Parcel successfully deleted');
    });

    it('should throw query params invalid error', async () => {
      const res = await agent
        .delete('/api/v1/parcels/wrong-parcel-id')
        .set('Authorization', token)
        .set('accept', 'application/json');
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('The query params is invalid');
    });

    it('should throw No parcel was found error', async () => {
      const res = await agent
        .delete(`/api/v1/parcels/${parcelId}`)
        .set('Authorization', token)
        .set('accept', 'application/json');
      expect(res.status).toBe(404);
      expect(res.body.message).toEqual('No parcel was found');
    });

    it('should throw Cannot delete parcel error', async () => {
      const res = await agent
        .delete(`/api/v1/parcels/${updatedParcelId}`)
        .set('Authorization', token)
        .set('accept', 'application/json');
      expect(res.status).toBe(403);
      expect(res.body.message).toEqual('Cannot delete parcel if it is in transit or delivered');
    });
  });
};

export default parcelsTests;
