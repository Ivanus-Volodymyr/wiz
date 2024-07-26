import { Body, Controller, Get, Post } from '@nestjs/common';

import { SkillService } from './skill.service';
import { GeneralResponse } from '../types';
import { CreateSkillDto } from './dto/create-skill-dto';
import { SuggestSkillDto } from './dto/suggest-skill-dto';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post('/create')
  public async createSkill(
    @Body() skill: CreateSkillDto,
  ): Promise<GeneralResponse> {
    return this.skillService.createSkill(skill);
  }

  @Get('/')
  public async getAllSkills(): Promise<GeneralResponse> {
    return this.skillService.getAllSkills();
  }

  @Post('/suggest')
  public async suggestSkills(
    @Body() data: SuggestSkillDto,
  ): Promise<GeneralResponse> {
    return this.skillService.suggestSkills(data);
  }
}
