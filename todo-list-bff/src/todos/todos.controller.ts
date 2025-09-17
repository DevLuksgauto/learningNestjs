import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { AuthenticatedRequest } from 'src/common/types';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    if (!req.user || typeof req.user.id !== 'number') {
      throw new UnauthorizedException('Unauthenticated user or invalid ID.');
    }
    return this.todosService.create(req.user.id, createTodoDto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.todosService.findAll(req.user.id);
  }

  @Get()
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.todosService.findOne(req.user.id, +id);
  }

  @Patch()
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(req.user.id, +id, updateTodoDto);
  }

  @Delete()
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.todosService.remove(req.user.id, +id);
  }
}
