import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { UserItem } from '@single-use-downloads/type-users';
import { ConfigService } from '@nestjs/config';

const dynamodbClient = new DynamoDBClient({});

@Injectable()
export class UsersModel {
  private documentClient = DynamoDBDocumentClient.from(dynamodbClient);
  private usersTable: string;

  constructor(private configService: ConfigService) {
    const usersTable = this.configService.get('DYNAMODB_TABLE_USERS');
    if (usersTable) this.usersTable = usersTable;
    else throw Error('Users Table not defined');
  }

  public async put(item: UserItem): Promise<PutCommandOutput> {
    const command = new PutCommand({
      TableName: this.usersTable,
      Item: item,
    });
    const response = await this.documentClient.send(command);
    return response;
  }
}
