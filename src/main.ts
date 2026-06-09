import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS para permitir llamadas desde frontend en desarrollo y producción
  app.enableCors({
    origin: [
      'http://localhost:4200',                                   // Desarrollo local Angular
      'http://localhost:3000',                                   // Desarrollo local otros puertos
      'https://invitation-web-production-dcfe.up.railway.app',   // Frontend en producción
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 3600,
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();