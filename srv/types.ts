
export interface IUser {
    login: string;
    name: string;
    sudo: boolean;
    roles: string[];
}
export interface IToken  {
    version: number;
    user: IUser;
}

export interface ILoginResponse {
    ok: boolean;
    token: string;
    user: IUser;
}

export interface IContextBase {
    user: IUser;
    global_counter: number;
    big: any;
}


