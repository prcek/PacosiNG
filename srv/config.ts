
require('dotenv').config();

export interface IConfig {
    is_production: boolean;
    app_url_base: string;
    mongodb_uri: string;
    aws_region: string;
    aws_access_key_id: string;
    aws_secret_access_key: string;
    audit_log_name: string;
}

export const config: IConfig = {
    is_production: process.env.NODE_ENV === 'production',
    app_url_base: process.env.APP_URL_BASE || 'http://localhost:4000',
    mongodb_uri: process.env.MONGODB_URI,
    aws_region: process.env.AWS_REGION,
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    audit_log_name: process.env.AUDIT_LOG_NAME || 'dev',
};


if (config.is_production) {
    if (config.mongodb_uri == null) {
        throw new Error('no mongdb_uri!');
    }
    if (config.aws_region == null) {
        throw new Error('no AWS_REGION!');
    }
    if (config.aws_access_key_id == null) {
        throw new Error('no AWS_ACCESS_KEY_ID!');
    }
    if (config.aws_secret_access_key == null) {
        throw new Error('no AWS_SECRET_ACCESS_KEY!');
    }

}


