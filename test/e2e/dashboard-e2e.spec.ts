import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('DashboardController (e2e)', () => {
  let app: INestApplication;
  let token: string; // admin token

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true })
    );
    await app.init();
    // Login como admin para obtener token
    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'twitch.creespo@gmail.com', password: 'Password123' });
    token = loginRes.body.token;
  });

  it('GET /api/v1/dashboard/summary - should return a dashboard summary', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/dashboard/summary')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    // Ahora se valida que la respuesta tenga la estructura real:
    // 'kpis', 'monthlyRequests' y 'requestsStatus'
    expect(res.body).toHaveProperty('kpis');
    expect(res.body.kpis).toHaveProperty('activeClients');
    expect(res.body.kpis).toHaveProperty('carriers');
    expect(res.body.kpis).toHaveProperty('activeRoutes');
    // Si deseas tambien validar otros KPIs, por ejemplo monthlyRevenue:
    expect(res.body.kpis).toHaveProperty('monthlyRevenue');
    
    expect(res.body).toHaveProperty('monthlyRequests');
    expect(res.body.monthlyRequests).toHaveProperty('completed');
    expect(res.body.monthlyRequests).toHaveProperty('pending');
    
    expect(res.body).toHaveProperty('requestsStatus');
    // Por ejemplo, validar que contiene alguna propiedad
    expect(res.body.requestsStatus).toHaveProperty('pending');
    expect(res.body.requestsStatus).toHaveProperty('completed');
    expect(res.body.requestsStatus).toHaveProperty('cancelled');
    expect(res.body.requestsStatus).toHaveProperty('done');
  });

  afterAll(async () => {
    await app.close();
  });
});