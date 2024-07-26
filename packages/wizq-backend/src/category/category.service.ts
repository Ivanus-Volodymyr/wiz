import { HttpStatus, Injectable } from '@nestjs/common';

import prisma from '../prisma';

import { CreateCategoryDto } from './dto/create-category-dto';
import { GeneralResponse } from '../types';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  public async createCategory(
    category: CreateCategoryDto,
  ): Promise<GeneralResponse> {
    try {
      const createCategory = await prisma.category.create({ data: category });
      if (!createCategory) throw new Error('error with creating category');
      return {
        status: HttpStatus.CREATED,
        message: 'created',
        details: { id: createCategory.id, name: createCategory.name },
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_IMPLEMENTED,
        message: 'created',
        details: null,
        error: e,
      };
    }
  }

  public async getAllCategories(): Promise<GeneralResponse> {
    try {
      const categories = await prisma.category.findMany();

      const details = categories.map((rs: Category) => {
        return {
          id: rs.id,
          name: rs.name,
        };
      });

      return {
        status: HttpStatus.OK,
        message: 'categories',
        details,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'error getting categories',
        details: null,
        error: e,
      };
    }
  }
}
