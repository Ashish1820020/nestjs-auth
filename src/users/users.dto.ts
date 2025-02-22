/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */

import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString, ValidateNested } from "class-validator";


export class Address {
    @IsString()
    street: string;
    @IsString()
    city: string;
    @IsString()
    state: string;
    @IsString()
    zip: string;
  };

export class CreateUser {
    
    @IsString()
    name: string;
    @IsString()
    email: string;
    @IsNumber()
    age: number;
    @IsBoolean()
    isActive: boolean;
    
    @ValidateNested() // Validates nested object properties
    @Type(() => Address)
    address: Address;
}