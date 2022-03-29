import { autorization } from '../../data/lib-jwt/autorization'

export interface IAutorizationRepository {
    signToken(user: string)
    getUserFromToken(token: string)
    generateAuthResponse(userId: string, effect: string, methodArn: any)
    generatePolicyDocument(effect: any, methodArn: any)
}

class AutorizationRepository implements IAutorizationRepository {

    public signToken = (user: string) => autorization.signToken(user);
    public getUserFromToken = (token: string) => autorization.getUserFromToken(token)
    public generateAuthResponse = (userId: string, effect: string, methodArn: any) =>
        autorization.generateAuthResponse(userId, effect, methodArn)

    public generatePolicyDocument = (effect: any, methodArn: any) =>
        autorization.generatePolicyDocument(effect, methodArn)

}

export const autorizationRepository: IAutorizationRepository = new AutorizationRepository();
