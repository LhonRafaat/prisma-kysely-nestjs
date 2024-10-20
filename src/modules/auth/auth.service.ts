import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config.type';
import { TAuthResponse } from './types/auth.response';
import { IRequest } from '../../common/helper/common-types';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvConfig>,
    private readonly userService: UserService,
  ) {}

  async validateUser(payload: LoginDto): Promise<TAuthResponse> {
    const user = await this.userService.findByEmail(payload.email);
    if (user) {
      console.log(user);
      const isMatch = await bcrypt.compare(payload.password, user.password);
      if (isMatch) {
        const tokens = await this.getTokens({
          id: user.id,
          name: user.name,
        });

        await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
      }
    }
    throw new UnauthorizedException(
      'Could not authenticate. Please try again.',
    );
  }

  async register(payload: RegisterDto): Promise<TAuthResponse> {
    const user = await this.userService.create(payload);
    const tokens = await this.getTokens({
      id: user.id,
      name: user.name,
    });

    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async handleGoogleCallback(req: IRequest): Promise<TAuthResponse> {
    let user = await this.userService.findByEmail(req.user.email);

    if (!user) {
      const result = await this.userService.createWithProvider(
        req.user as Omit<RegisterDto, 'password' | 'isAdmin'> & {
          oauthProvider: string;
          oauthProviderId: string;
          roles: string[];
        },
      );
      user = await this.userService.findOne(
        result.insertId as unknown as number,
      );
    }

    const tokens = await this.getTokens({
      id: user.id,
      name: user.name,
    });

    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async getTokens(payload: { id: number; name: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('ACCESS_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('REFRESH_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.refresh_token)
      throw new UnauthorizedException('Access Denied');

    const tokens = await this.getTokens({
      id: user.id,
      name: user.name,
    });
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    return await this.userService.updateRefreshToken(userId, null);
  }
}
