import { Exclude, Expose } from "class-transformer";

export class User {
    @Expose()
    id: number;

    @Expose()
    email: string


    @Expose()
    token?: string

    @Expose()
    refreshToken?: string

    @Expose()
    accessToken?: string

    @Exclude()
    password?: string; 
}