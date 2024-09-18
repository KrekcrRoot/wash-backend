import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle(`MAI WashBot Backend`)
    .setDescription(`MAI WashBot description`)
    .setVersion(`0.0`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`docs`, app, document);


  app.enableCors({ credentials: true, origin: true });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  await app.listen(3000);
}

bootstrap();
