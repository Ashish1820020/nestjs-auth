import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthJwtPayload } from "../types/auth.jwtPayload";
import { Inject, Injectable } from "@nestjs/common";
import jwtConfig from "../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { AuthService } from "../auth.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (@Inject(jwtConfig.KEY) 
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private authService: AuthService) {
    // constructor () {
        console.log("JwtStrategy");
        console.log("jwtConfigarations", jwtConfiguration);
        
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConfiguration.secret
        })
    }
    validate(payload: AuthJwtPayload) {
        console.log("JwtStrategy validate", payload);
        return this.authService.validateJwtUser(payload.sub.id)
    }
    
}