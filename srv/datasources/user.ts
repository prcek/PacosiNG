
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { IStore , IUserModel} from './../store';
import { IContextBase, IUser, ILoginResponse, IToken } from './../types';


import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'iddqd';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';
const TOKEN_VERSION = 1;
export function encryptPassword(password: string): string {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt );
}

export function compareEncryptedPassword(password, encrypted_password): boolean {
    return bcrypt.compareSync( password, encrypted_password );
}

export function decodeAuthToken(token: string): IUser {
    try {
        const decoded = <IToken> jwt.verify(token, JWT_SECRET);
        if (decoded.version === TOKEN_VERSION) {
            return decoded.user;
        }
        return null;
    } catch ( err ) {}
    return null;
}


export class UserAPI implements DataSource {
    bigArray: string[];
    context: IContextBase;
    constructor(private store: IStore) {
        console.log('new UserAPI');
        this.bigArray = new Array(100000).fill('a');
    }
    initialize(config: DataSourceConfig<IContextBase>) {
        this.context = config.context;
        // console.log(this.store);
    }
    async getAllUsers(): Promise<IUser[]> {
        return this.store.userModel.find({});
    }
    async getMe(): Promise<IUser> {
        return this.context.user;
    }
    // tslint:disable-next-line:max-line-length
    async createUser(login: string, password: string, name: string, sudo: boolean, roles: string[], calendar_ids: string[]): Promise<IUser> {
        return this.store.userModel.create({
            login,
            password: encryptPassword(password),
            name,
            sudo,
            roles,
            calendar_ids
        });
    }
    // tslint:disable-next-line:max-line-length
    async updateUser(login: string, password: string, name: string, sudo: boolean, roles: string[], calendar_ids: string[]): Promise<IUser> {
        const user = await this.store.userModel.findOne({login});
        if (!user) {
            throw new Error('Something bad happened');
        }
        if (password) {
            console.log('updateUser with new password');
            user.set({name, password: encryptPassword(password), sudo, roles, calendar_ids});
        }  else {
            console.log('updateUser without password');
            user.set({name, sudo, roles, calendar_ids});
        }
        return user.save();
    }
    async login(login: string, password: string): Promise<ILoginResponse> {

        const user = await this.store.userModel.findOne({login});
        if (!user) {
          return { ok: false, token: null, user: null};
        }
        if (!bcrypt.compareSync( password, user.password )) {
          return { ok: false, token: null, user: null};
        }
        const token: IToken = {
            version: TOKEN_VERSION,
            user: { login, name: user.name, roles: user.roles, sudo: user.sudo, calendar_ids: user.calendar_ids},
        };
        const stoken = jwt.sign(token, JWT_SECRET, {expiresIn: JWT_EXPIRE});
        return {ok: true, token: stoken, user: token.user};
    }

    async relogin(): Promise<ILoginResponse> {
        if (this.context.user) {
            const login = this.context.user.login;
            const user = await this.store.userModel.findOne({login});
            if (!user) {
                return { ok: false, token: null, user: null};
            }
            const token: IToken = {
                version: TOKEN_VERSION,
                user: { login, name: user.name, roles: user.roles, sudo: user.sudo, calendar_ids: user.calendar_ids},
            };
            const stoken = jwt.sign(token, JWT_SECRET, {expiresIn: JWT_EXPIRE});
            return {ok: true, token: stoken, user: token.user};
        }
        return {ok: false, token: null, user: null};
    }
}
