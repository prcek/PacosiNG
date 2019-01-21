
export interface IUser {
    login: string;
    sudo: boolean;
    roles: string[];
}

export interface IContextBase {
    user: IUser;
    big: any;
}


