import request from 'supertest';
import app from '../../App';

const errorTests = () => {
  it('should respond Requested Resource Not Found', async () => {
    const res = await request(app)
      .get('/api/v1/wrong-url')
      .set('accept', 'application/json');
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ message: 'Requested Resource Not Found' });
  });
};

export default errorTests;
