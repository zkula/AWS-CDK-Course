import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { validateAsSpaceEntry } from '../shared/Validator';
import { createRandomId, parseJSON } from '../shared/Utils';

export async function postSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const id = createRandomId();
  const item = parseJSON(event.body);
  item.id = id;
  validateAsSpaceEntry(item);

  const result = await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: marshall(item),
    })
  );

  console.log(result);

  return {
    statusCode: 201,
    body: JSON.stringify({ id: id }),
  };
}
