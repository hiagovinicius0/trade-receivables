import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const options = {
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('DB_TEST_HOST'),
    port: +config.get('DB_TEST_PORT'),
    username: config.get('DB_TEST_USERNAME'),
    password: config.get('DB_TEST_PASSWORD'),
    database: config.get('DB_TEST_NAME'),
    entities: ['./**/*.entity.ts'],
    synchronize: true,
  }),
  inject: [ConfigService],
} as TypeOrmModuleAsyncOptions;
