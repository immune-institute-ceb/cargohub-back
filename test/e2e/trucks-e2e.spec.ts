import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('TrucksController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let truckId: string;
  const newTruck = {
    licensePlate: 'XYZ-9876',
    carModel: 'Volvo VNL',
    capacity: 10,
    fuelType: 'diesel',
    status: 'available'
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    await app.init();
    // Login usando credenciales admin
    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'twitch.creespo@gmail.com', password: 'Password123' });
    token = loginRes.body.token;
  });

  it('POST /api/v1/trucks - create a new truck (should return 201)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/trucks')
      .set('Authorization', `Bearer ${token}`)
      .send(newTruck);
    expect(res.status).toBe(201);
    // Se espera que la respuesta tenga la propiedad "truck" con el camión creado
    expect(res.body).toHaveProperty('truck');
    expect(res.body.truck).toHaveProperty('_id');
    expect(res.body.truck.licensePlate).toEqual(newTruck.licensePlate);
    truckId = res.body.truck._id;
  });

  it('GET /api/v1/trucks - get all trucks (should return 200)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/trucks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find((truck) => truck._id === truckId);
    expect(found).toBeDefined();
  });

  it('GET /api/v1/trucks/:id - get a truck by ID (should return 200)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/trucks/${truckId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', truckId);
  });

  it('PATCH /api/v1/trucks/:id - update a truck (should return 200)', async () => {
    const updateData = { carModel: 'Scania R450' };
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/trucks/${truckId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('carModel', updateData.carModel);
  });

  it('PATCH /api/v1/trucks/status/:id - update truck status to maintenance (should return 200)', async () => {
    // El camión se creó con status "available", por lo que se puede pasar a "maintenance"
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/trucks/status/${truckId}`)
      .query({ status: 'maintenance' })
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    // En este endpoint la respuesta envuelve el camión en la propiedad "truck"
    expect(res.body).toHaveProperty('truck');
    expect(res.body.truck.status).toBe('maintenance');
  });

  it('DELETE /api/v1/trucks/:id - delete a truck (should return 200)', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/trucks/${truckId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  afterAll(async () => {
    await app.close();
  });
});