import jwt from 'jsonwebtoken'


class Autorization {

    public signToken = async user => {

        const secret = Buffer.from(process.env.TOKEN_SECRET_ID, 'base64');

        return jwt.sign({ email: user.email, id: user.id, role: user.role }, secret, {
            expiresIn: 300000
        });
    }

    public getUserFromToken = async (token: string) => {

        try {
            if (!token) return 'undefined token'

            const secret = Buffer.from(process.env.TOKEN_SECRET_ID, 'base64');

            return jwt.verify(token.replace('Bearer $', '').replace('Bearer ', ''), secret);

        } catch (error) {
            return JSON.stringify(`Error:${error}`)
        }

    }

    public generateAuthResponse = async (userId: string, effect: string, methodArn: any) => {
        const policyDocument = await this.generatePolicyDocument(effect, methodArn);

        return {
            principalId: userId,
            policyDocument: policyDocument
        };
    }

    public generatePolicyDocument = async (effect: string, methodArn: string) => {
        if (!effect || !methodArn) return null;

        return {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: '*'
                }
            ]
        };

    }

}

export const autorization = new Autorization
