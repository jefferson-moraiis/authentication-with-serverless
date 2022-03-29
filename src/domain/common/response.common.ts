/* eslint-disable require-jsdoc */
export const buildMessageBody = (message: string) => ({ message })

export const buildResponse = (statusCode: number, body: any) => ({
    statusCode,
    headers: {
        'Access-Control-Allow-Origin': `${process.env.ACCESS_CONTROL_ALLOW_ORIGIN}`,
        'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
})
