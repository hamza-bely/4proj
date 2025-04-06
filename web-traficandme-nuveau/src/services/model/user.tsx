export interface User {
    id: number
    username: string;
    email: string
    role: string
    status: string,
    createDate: string,
    updateDate: string
}
export interface UserComplete {
    id: number
    firstName: string,
    lastName: string,
    email: string
    role: string
}


export interface UserResponse {
    id: number;
    username: string;
    email: string;
    role: string;
}

export interface UserResponseFetchUsers {
    message: string;
    data: {
        id: number
        username: string;
        email: string;
        role: string;
        status: string,
        createDate: string;
        updateDate: string;
    }[];
}

export interface UserResponseFetchUser {
    message : string;
    data:{
        id: number;
        username: string;
        email: string;
        role: string;
        status: string;
        createDate: string;
        updateDate: string;
    }
}

export interface UserRegisterRequest{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UserCreateRequest{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role : string;
}


export interface UserLoginRequest{
    email: string;
    password: string;
}

export interface UserRegisterResponse{
    message : string;
    data:{
        token : string;
        user : {
            id: number;
            username: string;
            email: string;
            role: string;
        }
    }
}

export interface UserLoginResponse{
    message : string;
    data:{
        token : string;
        user : {
            id: number;
            username: string;
            email: string;
            role: string;
        }
    }
}


export interface UserCreateResponse{
    message : string;
    data:{
        id: number;
        username: string;
        email: string;
        role: string;
        status: string,
        createDate: string,
        updateDate: string
    }
}
export interface UserUpdaterRequest {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password: string;
    status: string;
}

export interface UserUpdateResponse{
    message : string;
    data:{
        id: number;
        username: string;
        email: string;
        role: string;
        status: string,
        createDate: string,
        updateDate: string
    }
}