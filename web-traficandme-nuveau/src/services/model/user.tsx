export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string
    password: string
    role: string
}

export interface UserRegisterRequest{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UserLoginRequest{
    email: string;
    password: string;
}