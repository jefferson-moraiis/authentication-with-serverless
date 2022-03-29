import { DynamoDB } from 'aws-sdk';

const options = {
    region: process.env.region
};

const offline = process.env.IS_OFFLINE;

if (offline) {
    options.region = 'localhost';
    options['endpoint'] = 'http://localhost:8000';
}


export default new DynamoDB.DocumentClient(options);
