import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './configs/configuration.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  await app.listen(appConfig().port);
}
bootstrap();
