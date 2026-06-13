import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'name',
        });
    }

    async validate(name: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(name, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}