import { Injectable } from '@nestjs/common';
import prisma from '../prisma';

@Injectable()
export class TestEntityService {
  getTestEntities() {
    return prisma.testEntity.findMany();
  }
}
