
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
    async createUser(login: string, password: string, sudo: boolean, roles: string[]): Promise<IUser> {
        return this.store.userModel.create({
            login,
            password: encryptPassword(password),
            sudo,
            roles
        });
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
            user: { login, roles: user.roles, sudo: user.sudo},
        };
        const stoken = jwt.sign(token, JWT_SECRET, {expiresIn: JWT_EXPIRE});
        return {ok: true, token: stoken, user: token.user};
    }
}