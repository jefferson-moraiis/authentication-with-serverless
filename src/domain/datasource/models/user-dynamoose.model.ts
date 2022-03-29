import { Document } from 'dynamoose/dist/Document';
import { DynamoDatabase } from '../../../data/lib-aws/datasource/dynamoose.database';
import { IUser } from '../../entities/modelUser';

const tableName = process.env.DB_USER_TABLE || 'env DB_USER_TABLE not found';

export const IUserDynamooseModel = DynamoDatabase.model<IUser & Document>(tableName, new DynamoDatabase.Schema({

    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        hashKey: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
}))
