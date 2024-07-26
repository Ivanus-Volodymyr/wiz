import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import prisma from './prisma';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use('/uploads', express.static('uploads'));

  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
    });
  } else {
    console.warn('SENTRY_DSN is not set, Sentry will not be initialized');
  }

  await app.listen(process.env.PORT);
}
void bootstrap();

// populate DB with test entities
void (async () => {
  const testEntitiesData = [
    {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '+1 (123) 456-7890',
    },
    {
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      phone: '+1 (234) 567-8901',
    },
    {
      name: 'Alex Johnson',
      email: 'alexjohnson@example.com',
      phone: '+1 (345) 678-9012',
    },
    {
      name: 'Sarah Wilson',
      email: 'sarahwilson@example.com',
      phone: '+1 (456) 789-0123',
    },
    {
      name: 'Michael Lee',
      email: 'michaellee@example.com',
      phone: '+1 (567) 890-1234',
    },
  ];

  if (!(await prisma.testEntity.count())) {
    await prisma.testEntity.createMany({
      data: testEntitiesData,
    });
  }
})();
