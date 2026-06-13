import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { UserService } from "../../../modules/user/user.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService, private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (req: Request) => req?.cookies?.access_token,
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET', 'default_secret'),
        });
    }

    async validate(payload: any): Promise<any> {

        const user = await this.userService.findUserByName(payload.name);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}