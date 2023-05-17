import { ConfigService } from 'src/config/config.service';
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { DbConfigError, DbError } from './db.error';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseURIEnum } from 'src/app/common/enum';

@Module({})
export class DatabaseModule {
  public static getNoSqlConnectionOptions(
    config: ConfigService,
    databaseName: string,
  ): any {

    const database = config.get()[databaseName];
    const type = config.get()[databaseName + 'Type'];
    const host = config.get()[databaseName + 'Host'];
    const port = config.get()[databaseName + 'Port'];
    const username = config.get()[databaseName + 'Username'];
    const password = config.get()[databaseName + 'Password'];

    return {
      type,
      host,
      port,
      username,
      password,
      database,
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
      logging: true, // Set to false in production   
    };

  }
  public static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) =>
            DatabaseModule.getNoSqlConnectionOptions(
              configService,
              databaseURIEnum.O16_LABS_DATABASE,
            ),
          inject: [ConfigService],
        }),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
