import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createTodoDto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        ...createTodoDto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.todo.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(userId: number, id: number) {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!todo || todo.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return todo;
  }

  async update(userId: number, id: number, updateTodoDto: UpdateTodoDto) {
    await this.findOne(userId, id);

    return this.prisma.todo.update({
      where: {
        id,
      },
      data: updateTodoDto,
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);

    return this.prisma.todo.delete({
      where: {
        id,
      },
    });
  }
}
