
require('dotenv').config();

export interface IConfig {
    is_production: boolean;
    url_base: string;
    mongodb_uri: string;
}

export const config: IConfig = {
    is_production: true, // TODO:  process.env.NODE_ENV=="production";
    url_base: 'x',
    mongodb_uri: process.env.MONGODB_URI
};


if (config.is_production) {
    if (config.mongodb_uri == null) {
        throw new Error('no mongdb_uri!');
    }
}


