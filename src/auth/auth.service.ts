import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { GetUserDto } from '../user/dto/get-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async signin(username: string, password: string) {
    const res = await this.userService.findAll({ username } as GetUserDto);
    return '这是登录接口';
  }
  signup(username: string, password: string) {
    return '这是注册接口';
  }
}
