import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LocalAuthGuard } from 'src/commons/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';

@Controller({
  path: 'auth',
  version: '1'
})
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) res) {
    const { access_token } = await this.authService.login(req.user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return {
      user: req.use,
      access_token
    };
  }


  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) res) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return {
      message: 'Logged out successfully',
    };
  }
}
