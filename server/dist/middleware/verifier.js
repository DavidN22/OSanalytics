"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_jwt_verify_1 = require("aws-jwt-verify");
//verifies the jwt id part of the token
const createCognitoVerifier = () => {
    const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
    const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
    return aws_jwt_verify_1.CognitoJwtVerifier.create({
        userPoolId: COGNITO_USER_POOL_ID,
        tokenUse: "id",
        clientId: COGNITO_CLIENT_ID,
    });
};
exports.default = createCognitoVerifier;
