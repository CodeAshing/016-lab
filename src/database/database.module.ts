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
  ): TypeOrmModuleOptions {
    const databaseURI = config.get()[databaseName];
    const type = config.get().databaseType;

    if (!databaseURI) {
      throw new DbConfigError('Database config is missing');
    }
    return {
      uri: databaseURI,
      type
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
              databaseURIEnum.O16_LABS_DATABASE_URI,
            ),
          autoLoadEntities: true,
          synchronize: true
        }),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
