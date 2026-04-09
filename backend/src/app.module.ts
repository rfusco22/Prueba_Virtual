// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesModule } from './notes/notes.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Esto hace que el .env esté disponible en todo el app
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', '127.0.0.1'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USER', 'root'),
        // Aquí está el cambio clave: permite que sea vacío sin usar un default molesto
        password: configService.get<string>('DB_PASSWORD', ''), 
        database: configService.get<string>('DB_NAME', 'notes_app'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Ideal para desarrollo, crea las tablas automáticamente
        logging: true,
      }),
    }),
    AuthModule,
    CategoriesModule,
    NotesModule,
  ],
})
export class AppModule {}
