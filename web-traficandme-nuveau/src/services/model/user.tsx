export interface User {
    name: string
    email: string
    password: string
}

export interface UserRegisterRequest{
    name: string
    email: string
    password: string
    password_confirmation: string
}

export interface UserLoginRequest{
    email: string
    password: string
}