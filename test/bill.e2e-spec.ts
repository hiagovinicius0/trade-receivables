import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { BillsModule } from 'src/bills/bills.module';
import { AddBillDto } from 'src/bills/dto/interfaces/add-bill.dto';
import { BillEntity } from 'src/bills/entities/bill.entity';
import { options } from 'src/test/constants';
import { Bill } from 'src/bills/models/Bill';

jest.setTimeout(30000);
describe('Bill (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<BillEntity>;
  let bill: Bill;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync(options),
        BillsModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    repository = moduleFixture.get('BillEntityRepository');
  });

  it('dependencies should be defined', () => {
    expect(app).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('/bills (POST)', () => {
    const billData: AddBillDto = {
      name: 'Teste Account',
      originalAmount: 100,
      paymentDate: '2021-11-28',
      dueDate: '2021-11-18',
    };
    it('should return account', async () => {
      const { body: response } = await request(app.getHttpServer())
        .post('/bills')
        .send(billData)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
      expect(response).toEqual({
        ...billData,
        correctedAmount: 108,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null,
        daysOfLate: 10,
        id: expect.any(String),
      });
      bill = response;
    });
  });

  describe('/bills (PATCH)', () => {
    const billUpdateData = {
      dueDate: '2021-11-20',
    };
    it('should return account', async () => {
      const { body: response } = await request(app.getHttpServer())
        .patch(`/bills/${bill.id}`)
        .send(billUpdateData)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response).toEqual({
        ...bill,
        ...billUpdateData,
        correctedAmount: 107.4,
        daysOfLate: 8,
        updatedAt: expect.any(String),
      });
    });
  });

  describe('/bills (DELETE)', () => {
    it('should return bill Id', async () => {
      const { body: response } = await request(app.getHttpServer())
        .delete(`/bills/${bill.id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response).toEqual({
        billId: bill.id,
      });
    });
  });

  afterAll(async () => {
    await repository.query(`TRUNCATE "bill" CASCADE;`);
    await app.close();
  });
});
