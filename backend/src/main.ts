import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // Next.js-Frontend
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000); // Backend auf 3000
}
void bootstrap();
