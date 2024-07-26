import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import prisma from '../prisma';
import { WordTokenizer, LancasterStemmer, TfIdf } from 'natural';

import { CreateSkillDto } from './dto/create-skill-dto';
import { GeneralResponse } from '../types';
import { SuggestSkillDto } from './dto/suggest-skill-dto';
import { nlp } from '../utils/nlp';

@Injectable()
export class SkillService {
  public async createSkill(skill: CreateSkillDto): Promise<GeneralResponse> {
    try {
      const createdSkill = await prisma.skill.create({ data: skill });
      if (!createdSkill)
        throw new HttpException(
          'skill was not created',
          HttpStatus.NOT_IMPLEMENTED,
        );
      return {
        status: HttpStatus.CREATED,
        message: 'skill created',
        details: createdSkill,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_IMPLEMENTED,
        message: 'error creating skill',
        details: null,
        error: e,
      };
    }
  }

  public async getAllSkills(): Promise<GeneralResponse> {
    try {
      const skills = await prisma.skill.findMany();
      return {
        status: HttpStatus.OK,
        message: 'skills',
        details: skills,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error getting skills',
        details: null,
        error: e,
      };
    }
  }

  public async suggestSkills(data: SuggestSkillDto): Promise<GeneralResponse> {
    try {
      const skills = await prisma.skill.findMany();
      const { description } = data;

      const suggestedSkills = nlp(skills, description, 'partial');
      const preselectedSkills = nlp(skills, description, 'exact');

      const response = {
        suggestedSkills,
        preselectedSkills,
      };

      return {
        status: HttpStatus.OK,
        message: 'suggested skills',
        details: response,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error getting skills',
        details: null,
        error: e,
      };
    }
  }
}
