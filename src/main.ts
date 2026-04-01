import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
<<<<<<< HEAD
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
//import { Reflector } from '@nestjs/core';

const cookieSession = require('cookie-session');
=======
import { ClassSerializerInterceptor ,ValidationPipe } from '@nestjs/common';
//import { Reflector } from '@nestjs/core';
const cookieSession = require('cookie-session')
>>>>>>> origin/master

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys : ['mysecretkey']
  }));
<<<<<<< HEAD
=======

>>>>>>> origin/master
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,
<<<<<<< HEAD
        transform: true
    }
  ));
  //app.useGlobalInterceptors(
    //new ClassSerializerInterceptor(app.get(Reflector))
 // )
=======
      transform: true
    }
  ));
 // app.useGlobalInterceptors(
//    new ClassSerializerInterceptor(app.get(Reflector))
//  )
>>>>>>> origin/master
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();