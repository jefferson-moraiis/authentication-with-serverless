/* eslint-disable require-jsdoc */
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult} from 'aws-lambda'
import { registerNewUser } from '../usecases/register-new-user'
import { login } from '../usecases/login'
import { autorizationService } from '../services/autorization.services'

/**
 * 
 * @param message 
 * @returns 
 */
const buildMessageBody = (message: string) => ({ message })

/**
  * 
  * @param statusCode 
  * @param body 
  * @returns 
  */
const buildResponse = (statusCode: number, body: any) => ({
    statusCode,
    headers: {
        'Access-Control-Allow-Origin': `${process.env.ACCESS_CONTROL_ALLOW_ORIGIN}`,
        'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
})


export const verifyToken = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
    const token = event.authorizationToken
    const methodArn = event.methodArn

    if (!token || !methodArn) { return autorizationService.generateAuthResponse('0', 'Deny', methodArn)} 

    const decoded = await autorizationService.getUserFromToken(token)

    if (decoded && decoded.id) {

        return autorizationService.generateAuthResponse(decoded.id, 'Allow', methodArn)

    }

    return autorizationService.generateAuthResponse(decoded.id, 'Deny', methodArn)

};

export const signin = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const {email, password} = JSON.parse(event.body);

    try {
        if (!email) {
            return buildResponse(400, buildMessageBody('email cannot be empty'))
        }
        if (!password) {
            return buildResponse(400, buildMessageBody('password cannot be empty'))
        }

        const response = await login.login({ email, password })

        return buildResponse(200, buildMessageBody(JSON.parse(JSON.stringify(response))))
    } catch (error) {
        return buildResponse(error.code, buildMessageBody(JSON.parse(JSON.stringify(error.message))))
    }

}

export const registerUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const {name, email, password, role } = JSON.parse(event.body);

    try {
        
        if (!name) {
            return buildResponse(400, buildMessageBody('name cannot be empty'))
        }
        if (!email) {
            return buildResponse(400, buildMessageBody('email cannot be empty'))
        }
        if (!password) {
            return buildResponse(400, buildMessageBody('password cannot be empty'))
        }

        if (! /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/.test(password)) {
            return buildResponse(400, buildMessageBody('password is not strong'))
        }

        await registerNewUser.registerUser({name, email, password, role})

        return buildResponse(200, buildMessageBody('user created successfully'))

    } catch (error) {
        return buildResponse(error.code, buildMessageBody(JSON.parse(JSON.stringify(error.message))))
    }

}
