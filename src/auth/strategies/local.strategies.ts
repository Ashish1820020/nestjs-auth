import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        console.log("LocalStrategy");
        super({ usernameField: "email" })
    }

    validate(email: string, password: string) {
        console.log("LocalStrategy validate", email, password);
        return this.authService.validateLogin({email, password})
    }
}