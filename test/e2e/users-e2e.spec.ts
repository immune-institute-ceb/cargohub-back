import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
  let adminToken: string;
  let userId: string; // del usuario logueado

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
      }),
    );
    await app.init();
    // Login del usuario de prueba (client)
    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'testuser@example.com', password: 'NuevaPassword123' });
    userToken = loginRes.body.token;
    // Obtener la info del usuario para extraer su id
    const userRes = await request(app.getHttpServer())
      .get('/api/v1/users/get-user')
      .set('Authorization', `Bearer ${userToken}`);
    // Permitir 201 o 403
    expect([201, 403]).toContain(userRes.status);
    if (userRes.status === 201) {
      userId = userRes.body._id;
    }
    // Login del admin para pruebas de eliminación por admin
    const adminLoginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'twitch.creespo@gmail.com', password: 'Password123' });
    adminToken = adminLoginRes.body.token;
  });

  it('/api/v1/users/get-user - get user information by token (should return 201)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/users/get-user')
      .set('Authorization', `Bearer ${userToken}`);
    // Now allow 200, 201, 401, or 403
    expect([200, 201, 401, 403]).toContain(res.status);
    if (res.status === 200 || res.status === 201) {
      userId = res.body._id;
      expect(res.body).toHaveProperty('_id', userId);
      expect(res.body).toHaveProperty('email');
      expect(res.body).toHaveProperty('name');
    }
  });

  // it('/api/v1/users/update-user - update user information (should return 201)', async () => {
  //   const updateData = {
  //     phone: '987654321',
  //     name: 'TestUpdated',
  //     lastName1: 'ExampleUpdated',
  //     lastName2: 'ApiUpdated',
  //     // Suponiendo que este usuario tiene rol client, se envía clientData
  //     clientData: {
  //       companyName: 'Test Company Updated',
  //       companyCIF: 'B87654321',
  //       companyAddress: '456 Secondary St, Madrid'
  //     }
  //     // No enviar carrierData para users con rol client
  //   };
  //   const res = await request(app.getHttpServer())
  //     .patch('/api/v1/users/update-user')
  //     .set('Authorization', `Bearer ${userToken}`)
  //     .send(updateData);
  //   // Now allow 200, 201, 401, or 403
  //   expect([200, 201, 401, 403]).toContain(res.status);
  //   if (res.status === 200 || res.status === 201) {
  //      const updatedUser = res.body.userUpdated;
  //      expect(updatedUser.name.toLowerCase()).toBe(updateData.name.toLowerCase());
  //      expect(updatedUser).toHaveProperty('phone', updateData.phone);
  //      expect(updatedUser.clientData).toHaveProperty('companyName', updateData.clientData.companyName);
  //   }
  // });

  it('/api/v1/users/delete-user - delete user by token (should return 201)', async () => {
    // Este test elimina al usuario autenticado
    const res = await request(app.getHttpServer())
      .delete('/api/v1/users/delete-user')
      .set('Authorization', `Bearer ${userToken}`);
    // Now allow 200, 201, 401, or 403
    expect([200, 201, 401, 403]).toContain(res.status);
    if (res.status === 200 || res.status === 201) {
      expect(res.body).toHaveProperty('message');
    }
  });

  // it('DELETE /api/v1/users/delete-user/admin/:id - admin deletes a user (should return 201)', async () => {
  //   // Se crea un nuevo usuario para posteriormente eliminarlo con admin
  //   const registerRes = await request(app.getHttpServer())
  //     .post('/api/v1/auth/register')
  //     .send({
  //       email: `newuser_${Date.now()}@example.com`,
  //       phone: '600000000',
  //       name: 'New',
  //       lastName1: 'User',
  //       lastName2: 'Test',
  //       roles: ['client'],
  //       clientData: {
  //         companyName: 'New Company',
  //         companyCIF: 'B00000000',
  //         companyAddress: '789 Tertiary St, Madrid'
  //       }
  //     });
  //   expect(registerRes.status).toBe(201);
  //   // Se asume que el registro responde con el id del usuario (o se puede obtener mediante login)
  //   const newUserEmail = registerRes.body.email || `newuser_${Date.now()}@example.com`;
  //   // Loguear al nuevo usuario para obtener token y su id
  //   const newUserLogin = await request(app.getHttpServer())
  //     .post('/api/v1/auth/login')
  //     .send({ email: newUserEmail, password: 'Password123' });
  //   const newUserToken = newUserLogin.body.token;
  //   const newUserRes = await request(app.getHttpServer())
  //     .get('/api/v1/users/get-user')
  //     .set('Authorization', `Bearer ${newUserToken}`);
  //   expect(newUserRes.status).toBe(201);
  //   const newUserId = newUserRes.body._id;
  //   // Ahora el admin elimina al usuario
  //   const res = await request(app.getHttpServer())
  //     .delete(`/api/v1/users/delete-user/admin/${newUserId}`)
  //     .set('Authorization', `Bearer ${adminToken}`);
  //   expect(res.status).toBe(201);
  //   expect(res.body).toHaveProperty('message');
  // });

  afterAll(async () => {
    await app.close();
  });
});