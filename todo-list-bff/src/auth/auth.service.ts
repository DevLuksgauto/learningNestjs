import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@prisma/prisma.service';
import { User } from 'generated/prisma';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { email, name, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: User = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const token = this.jwtService.sign({ id: user.id });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token }> {
    const { email, password } = loginDto;

    const user: User | null = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user.id });

    return { token };
  }
}
