import { config } from './config';

import * as WINSTON from 'winston';
import { IContextBase, IUser } from './types';
/*
import * as AWS from 'aws-sdk';

const aws_cfg = new AWS.Config({
    accessKeyId: config.aws_access_key_id,
    secretAccessKey: config.aws_secret_access_key,
    region: config.aws_region
});
const aws_cwl = new AWS.CloudWatchLogs(aws_cfg);
*/
const WinstonCloudWatch = require('winston-cloudwatch');

let wl = null;

export function enableAuditLogs() {
    console.log('enableAuditLogs');
    if (wl) { return; }
    wl  = WINSTON.createLogger({
        transports: [
            new WinstonCloudWatch({
                level: 'debug',
                awsRegion: config.aws_region,
                awsAccessKeyId: config.aws_access_key_id,
                awsSecretKey: config.aws_secret_access_key,
                logGroupName: 'dd_audit',
                logStreamName: config.audit_log_name,
                jsonMessage: true
            })
        ]
    });

    wl.info({logger: 'startup'});
}

export function A_gql_log(request_id: string | null, ctx_user: IUser | null, method: string, ...args: any): void  {
    const ld = {type: 'gql', request_id: request_id, user: ctx_user ? ctx_user.login : null , method, args: args};
    console.log('AUDIT INFO:', ld);
    if (wl) {
        wl.info(ld);
    }
}

export function A_ds_log(context: IContextBase, method: string, ...args: any): void  {
    const ld = {type: 'ds', request_id: context.request_id, user: context.user ? context.user.login : null , method, args: args};
    console.log('AUDIT INFO:', ld);
    if (wl) {
        wl.info(ld);
    }
}

// A_dbg:adbg,
// A_err:aerr,
