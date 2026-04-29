import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//import { Reflector } from '@nestjs/core';
const cookieSession = require('cookie-session')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // accepter requêtes frontend
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, //cookies session
  });

  app.use(cookieSession({
    keys : ['mysecretkey']
  }));
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }
  ));

  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();