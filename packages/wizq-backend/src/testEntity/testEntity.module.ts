import { Module } from '@nestjs/common';
import { TestEntityController } from './testEntity.controller';
import { TestEntityService } from './testEntity.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [TestEntityService, AuthService, UserService],
  controllers: [TestEntityController],
  imports: [HttpModule],
})
export class TestEntityModule {}
