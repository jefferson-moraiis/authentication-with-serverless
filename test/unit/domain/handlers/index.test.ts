import { verifyToken } from '../../../../src/domain/handlers';
/* eslint-disable max-len */
import { registerUser, signin } from '../../../../src/domain/handlers'
import { APIGatewayProxyEvent } from 'aws-lambda';
import bcrypt from 'bcrypt'
import { userDatasource } from '../../../../src/domain/datasource/user.datasource'
import { autorization } from '../../../../src/data/lib-jwt/autorization';
import { autorizationService } from '../../../../src/domain/services/autorization.services';

const bcryptHash = jest.fn().mockResolvedValue('dsffgdsfgdgfdgfdgfd');

process.env.TOKEN_SECRET_ID = 'token'
const mockMethodName = 'testMethod'

beforeAll(() => {

    // Mock Bcrypt Hash 

    (bcrypt.hash as jest.Mock) = bcryptHash;

    // Mock Authorization 

    autorization.signToken = jest.fn().mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')


    // Mock Datasource 

    userDatasource.getUser = jest.fn().mockReturnValue([{
        'id': '3c56801a-6472-4b66-9dcc-bed4a27995e',
        'name': 'name',
        'email': 'email@email.com.br',
        'password': 'Teste@123456',
        'role': 'admin'
    }])

    userDatasource.createUser = jest.fn().mockReturnValue({
        'id': '3c56801a-6472-4b66-9dcc-bed4a27995e',
        'name': 'name',
        'email': 'email@email.com.br',
        'password': 'Teste@123456',
        'role': 'admin'
    })
});

describe('should handlers.verifyToken', () => {

    it('verifyToken -  should fail when token is null', async () => {
        const response = await verifyToken({
            type: 'TOKEN',
            methodArn: mockMethodName,
            authorizationToken: ''
        })

        expect(response.policyDocument.Statement[0].Effect).toBe('Deny')
    })

    it('verifyToken -  should fail when token is invalid', async () => {
        const response = await verifyToken({
            type: 'TOKEN',
            methodArn: mockMethodName,
            authorizationToken: 'Bearer testtoken'
        })

        expect(response.policyDocument.Statement[0].Effect).toBe('Deny')
    })

    it('verifyToken -  should fail when token is valid', async () => {
        
        autorizationService.getUserFromToken = jest.fn().mockReturnValue({id: 10, role: 'sender'})

        const response = await verifyToken({
            type: 'TOKEN',
            methodArn: mockMethodName,
            authorizationToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        })

        expect(response.policyDocument.Statement[0].Effect).toBe('Allow')
    })


})
describe('should handlers.login', () => {

    it('should return sucess', async () => {
        const bcryptCompare = jest.fn().mockResolvedValue(true);

        (bcrypt.compare as jest.Mock) = bcryptCompare;
        
        const event = {}

        event['body'] = JSON.stringify({
            'email': 'email@email.com.br',
            'password': 'Teste@123456',
        })
        const result = await signin(event as APIGatewayProxyEvent)

        expect(result.statusCode).toBe(200)
    })

    it('should validate with exception flow', async () => {
        (bcrypt.compare as jest.Mock) = jest.fn().mockRejectedValue(new Error('Random error'));
        const event = {}

        event['body'] = JSON.stringify({
            'email': 'email@email.com.br',
            'password': 'Teste@123456',
        })
        const result = await signin(event as APIGatewayProxyEvent)
        const esperado = '{"message":"Error: Random error"}'

        expect(result.body).toEqual(esperado)
    })

    it('should returns empty email error', async () => {
        const event = {}

        event['body'] = JSON.stringify({
            'password': '$2b$08$7YW9SeSyBC.hT1RHdQj2iOhQpojG71ebEeBZBw1Vty1XGd8QRq15y',
        })
        const result = await signin(event as APIGatewayProxyEvent)

        expect(result.statusCode).toBe(400)
    })

    it('should returns empty password error', async () => {
        const event = {}

        event['body'] = JSON.stringify({
            'email': 'email@email.com.br',
        })
        const result = await signin(event as APIGatewayProxyEvent)

        expect(result.statusCode).toBe(400)
    })

})
describe('should handlers.registerUser', () => {
    it('should return sucess', async () => {
        const event = {}

        event['body'] = JSON.stringify({
            'email': 'name@email.com.br',
            'name': 'name',
            'password': 'Teste@123456',
            'role': 'admin'
        })
        const result = await registerUser(event as APIGatewayProxyEvent)

        expect(result.statusCode).toEqual(200)
    })

    it('should returns empty name error', async () => {
        const event = {}

        event['body'] = JSON.stringify({
            'email': 'email@email.com.br',
            'password': '123456',
            'role': 'admin'
        })
        const result = await registerUser(event as APIGatewayProxyEvent)

        expect(JSON.parse(result.body)).toStrictEqual({ 'message': 'name cannot be empty' })
    })

    it('should returns empty email error', async () => {
        const event = {}

        event['body'] = JSON.stringify({
            'name': 'name',
            'password': '123456',
            'role': 'admin'
        })
        const result = await registerUser(event as APIGatewayProxyEvent)

        expect(JSON.parse(result.body)).toStrictEqual({ 'message': 'email cannot be empty' })
    })
    it('should returns empty password error', async () => {
        const event = {}

        event['body'] = JSON.stringify({
            'email': 'name@email.com.br',
            'name': 'name',
            'role': 'admin'
        })
        const result = await registerUser(event as APIGatewayProxyEvent)

        expect(JSON.parse(result.body)).toStrictEqual({ 'message': 'password cannot be empty' })
    })


    it('should return error password is not strong', async () => {
        const event = {}

        event['body'] = JSON.stringify({
            'email': 'name@email.com.br',
            'name': 'name',
            'password': '123456',
            'role': 'admin'
        })
        const result = await registerUser(event as APIGatewayProxyEvent)

        expect(JSON.parse(result.body)).toStrictEqual({ 'message': 'password is not strong' })
    })

})
