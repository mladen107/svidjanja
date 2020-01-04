import {ConnectionOptions} from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
const environment = process.env.NODE_ENV || 'development';
const envData: any = dotenv.parse(fs.readFileSync(`${environment}.env`));

const {DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PASS} = envData;

const config: ConnectionOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  logging: true,
  logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/migrations',
  },
};
console.log(__dirname);
export = config;
