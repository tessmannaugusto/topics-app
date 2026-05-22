import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  ScanCommand, 
  GetCommand, 
  PutCommand, 
  DeleteCommand,
  QueryCommand
} from '@aws-sdk/lib-dynamodb';
import { success, error } from '../lib/lambda-utils';
import { validate } from '../middleware/lambda-validate';
import { topicSchema } from '../schemas/api-schemas';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TOPICS_TABLE_NAME || 'topics';

const baseHandler = async (event: APIGatewayProxyEvent, body: any): Promise<APIGatewayProxyResult> => {
  const method = event.httpMethod || (event as any).requestContext?.http?.method;
  const pathParameters = event.pathParameters || {};
  const id = pathParameters.id;

  try {
    switch (method) {
      case 'GET':
        if (id) {
          return await getTopic(id);
        } else {
          return await listTopics(event.queryStringParameters?.userId);
        }
      case 'POST':
        return await createTopic(body);
      case 'PUT':
        if (!id) return error(400, 'ID is required for update');
        return await updateTopic(id, body);
      case 'DELETE':
        if (!id) return error(400, 'ID is required for delete');
        return await deleteTopic(id);
      default:
        return error(405, `Method ${method} not allowed`);
    }
  } catch (err: any) {
    console.error('CRUD Error:', err);
    return error(500, err.message);
  }
};

export const handler = validate(topicSchema.partial())(baseHandler);

async function listTopics(userId?: string) {
  if (userId) {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'UserIndex',
      KeyConditionExpression: 'userId = :uid',
      ExpressionAttributeValues: { ':uid': userId }
    }));
    return success(result.Items);
  } else {
    const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    return success(result.Items);
  }
}

async function getTopic(id: string) {
  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { id }
  }));
  if (!result.Item) return error(404, 'Topic not found');
  return success(result.Item);
}

async function createTopic(data: any) {
  // Strict validation for POST
  const validated = topicSchema.parse(data);
  const item = {
    ...validated,
    id: validated.id || Math.random().toString(36).substring(2, 15),
    createdAt: Date.now()
  };
  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item
  }));
  return success(item);
}

async function updateTopic(id: string, data: any) {
  const item = { ...data, id, updatedAt: Date.now() };
  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item
  }));
  return success(item);
}

async function deleteTopic(id: string) {
  await docClient.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id }
  }));
  return success({ deleted: id });
}
