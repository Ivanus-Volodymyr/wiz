import { Body, Controller, Get, Post } from '@nestjs/common';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category-dto';
import { GeneralResponse } from '../types';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/')
  public async createCategory(
    @Body() category: CreateCategoryDto,
  ): Promise<GeneralResponse> {
    return this.categoryService.createCategory(category);
  }

  @Get('/')
  public async getAllCategories(): Promise<GeneralResponse> {
    return this.categoryService.getAllCategories();
  }
}
