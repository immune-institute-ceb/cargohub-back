import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('ClientsController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let clientId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      })
    );
    await app.init();
    // Usar credenciales de administrador para obtener un token con permisos para ver clientes
    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'twitch.creespo@gmail.com', password: 'Password123' });
    token = loginRes.body.token;
  });

  it('/api/v1/clients (GET) - obtener todos los clientes', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/clients')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      clientId = res.body[0]._id;
      // Verificar propiedades requeridas según Swagger
      expect(res.body[0]).toHaveProperty('companyName');
      expect(res.body[0]).toHaveProperty('companyCIF');
      expect(res.body[0]).toHaveProperty('companyAddress');
      expect(res.body[0]).toHaveProperty('status');
    }
    console.log("Estos son todos los clientes:", res.body[0])
  });

  it('/api/v1/clients/:id (GET) - obtener cliente por ID', async () => {
    if (clientId) {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/clients/${clientId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', clientId);
      expect(res.body).toHaveProperty('companyName');
      expect(res.body).toHaveProperty('companyCIF');
      expect(res.body).toHaveProperty('companyAddress');
      expect(res.body).toHaveProperty('status');
    } else {
      // Si no hay clientes, no se prueba este endpoint
      expect(true).toBe(true);
    }
  });

  it('PATCH /api/v1/clients/{id}/status - update client status to inactive', async () => {
    if (clientId) {
      // Establecer primero el estado a "active" para asegurar que se pueda cambiar a "inactive"
      await request(app.getHttpServer())
        .patch(`/api/v1/clients/${clientId}/status`)
        .query({ status: 'active' })
        .set('Authorization', `Bearer ${token}`);
      // Ahora se actualiza a "inactive"
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/clients/${clientId}/status`)
        .query({ status: 'inactive' })
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('updatedClient.status', 'inactive');
      expect(res.body).toHaveProperty('updatedClient.companyName');
    } else {
      expect(true).toBe(true);
    }
  });

  afterAll(async () => {
    await app.close();
  });
});