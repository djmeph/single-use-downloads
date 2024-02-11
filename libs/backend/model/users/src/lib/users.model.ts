import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { UserItem } from './users.interface';
const dynamodbClient = new DynamoDBClient({});

@Injectable()
export class UsersModel {
  private documentClient = DynamoDBDocumentClient.from(dynamodbClient);

  public async put(item: UserItem): Promise<PutCommandOutput> {
    const command = new PutCommand({
      TableName: 'name',
      Item: item,
    });
    const response = await this.documentClient.send(command);
    return response;
  }
}
