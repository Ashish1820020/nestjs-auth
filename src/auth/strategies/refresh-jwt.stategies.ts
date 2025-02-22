import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthJwtPayload } from "../types/auth.jwtPayload";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { AuthService } from "../auth.service";
import refreshJwtConfig from "../config/refresh-jwt.config";
import { Request } from "express";


@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
    constructor (@Inject(refreshJwtConfig.KEY) 
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    private authService: AuthService) {
    // constructor () {
        console.log("RefreshJwtStrategy");
        console.log("refreshJwtConfiguration", refreshJwtConfiguration);
        
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: refreshJwtConfiguration.secret,
            passReqToCallback: true
        })
    }
    
    validate(req: Request, payload: AuthJwtPayload) {
        console.log("JwtStrategy validate", payload);
        const refreshToken: string = req.get("authorization")?.replace("Bearer", "")?.trim() ?? "";
        return this.authService.validateRefreshToken(payload.sub.id, refreshToken)
    }
    
}