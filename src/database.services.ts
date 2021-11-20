import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('TYPEORM_HOST'),
      port: +this.configService.get('DB_PORT') || 5432,
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_DATABASE'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: !!this.configService.get('TYPEORM_DEV_DB'),
      useUTC: true,
      migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
      cli: {
        migrationsDir: __dirname + '/database/migrations',
      },
      autoLoadEntities: true,
    };
  }
}
