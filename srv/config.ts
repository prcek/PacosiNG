
require('dotenv').config();

export interface IConfig {
    is_production: boolean;
    app_url_base: string;
    mongodb_uri: string;
}

export const config: IConfig = {
    is_production: process.env.NODE_ENV === 'production',
    app_url_base: process.env.APP_URL_BASE || 'http://localhost:4000',
    mongodb_uri: process.env.MONGODB_URI
};


if (config.is_production) {
    if (config.mongodb_uri == null) {
        throw new Error('no mongdb_uri!');
    }
}


