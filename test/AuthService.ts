import { type CognitoUser } from '@aws-amplify/auth';
import { Amplify, Auth } from 'aws-amplify';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const awsRegion = 'ca-central-1';
const userPoolId = 'ca-central-1_HfziJmz56';
const userPoolWebClientId = '2donu2gtmp885i1fhikj5pbicr';
const identityPoolId = 'ca-central-1:7015252a-e72d-4d16-9c73-dcc4bc7f8121';

Amplify.configure({
  Auth: {
    region: awsRegion,
    userPoolId: userPoolId,
    userPoolWebClientId: userPoolWebClientId,
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    identityPoolId: identityPoolId,
  },
});

export class AuthService {
  public async login(userName: string, password: string) {
    const result = (await Auth.signIn(userName, password)) as CognitoUser;
    return result;
  }

  public async generateTemporaryCredentials(user: CognitoUser) {
    const jwtToken = user.getSignInUserSession().getIdToken().getJwtToken();
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${userPoolId}`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: identityPoolId,
        logins: {
          [cognitoIdentityPool]: jwtToken,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}
