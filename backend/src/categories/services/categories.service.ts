import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoriesRepository.find({
      order: { order: 'ASC' },
    });
  }

  async getCategoryById(id: string): Promise<Category> {
    return await this.categoriesRepository.findOne({
      where: { id },
      relations: ['notes'],
    });
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this.categoriesRepository.update(id, updateCategoryDto);
    return await this.getCategoryById(id);
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    await this.categoriesRepository.delete(id);
    return { message: 'Category deleted successfully' };
  }
}
