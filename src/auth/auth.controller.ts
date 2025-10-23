import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  signin(@Body() signinDto: any) {
    const { username, password } = signinDto;
    return this.authService.signin(username, password);
  }
  @Post('/signup')
  signup(@Body() signupDto: any) {
    const { username, password } = signupDto;
    return this.authService.signup(username, password);
  }
}
