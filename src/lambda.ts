import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverlessExpress from '@codegenie/serverless-express';
import { Handler, Context, Callback } from 'aws-lambda';
import { INestApplication } from '@nestjs/common';

let server: Handler;

async function bootstrap(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Enable CORS (mesma configuração do main.ts)
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.init();
  return app;
}

// Handler para AWS Lambda
export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  // Lazy initialization - cria o servidor apenas uma vez
  if (!server) {
    const app = await bootstrap();
    const expressApp = app.getHttpAdapter().getInstance();
    server = serverlessExpress({ app: expressApp });
  }

  return server(event, context, callback);
};
