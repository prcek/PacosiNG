import { config } from './config';

import * as WINSTON from 'winston';
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

    wl.debug({logger: 'startup'});
}
