/* eslint-disable prettier/prettier */

export type TResponse =  {"msg": string, "msg_id": number}
export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  age: number;
  address: Address;
  isActive: boolean;
  createdAt: string; // ISO date string
};



