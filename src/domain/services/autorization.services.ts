import { autorizationRepository } from '../repositories/autorization.repository';


class AutorizationService {

    public signToken = async (user: string) => {
        const autorizationToken = await autorizationRepository.signToken(user)

        return autorizationToken
    }

    public getUserFromToken = async (token: string) => {
        const userAuthorized = await autorizationRepository.getUserFromToken(token)

        return userAuthorized
    }

    public generateAuthResponse = async (userId: string, effect: string, methodArn: any) => {
        const policyDocument = await autorizationRepository.generateAuthResponse(userId, effect, methodArn)

        return policyDocument
    }

}


export const autorizationService = new AutorizationService


