import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { postSpaces } from './PostSpaces';
import { getSpaces } from './GetSpaces';
import { updateSpaces } from './UpdateSpaces';
import { deleteSpace } from './DeleteSpace';
import { JSONError, MissingFieldError } from '../shared/Validator';
import { addCorsHeader } from '../shared/Utils';

const ddbClient = new DynamoDBClient({});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let response: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case 'GET':
        response = await getSpaces(event, ddbClient);
        break;
      case 'POST':
        response = await postSpaces(event, ddbClient);
        break;
      case 'PUT':
        response = await updateSpaces(event, ddbClient);
        break;

      case 'DELETE':
        response = await deleteSpace(event, ddbClient);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error.message);
    if (error instanceof MissingFieldError || error instanceof JSONError) {
      return {
        statusCode: 400,
        body: error.message,
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }

  addCorsHeader(response);
  return response;
}

export { handler };
