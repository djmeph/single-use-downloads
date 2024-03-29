import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { User, UserItem, UserItemKeys } from '@single-use-downloads/type-users';
import { ConfigService } from '@nestjs/config';
import * as uuid from 'uuid';

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

  public async put(item: User): Promise<UserItem> {
    const itemKey = UserItemKeys.BASE;
    const itemPayload = Object.assign(item, { itemKey });
    const command = new PutCommand({
      TableName: this.usersTable,
      Item: itemPayload,
    });
    const response = await this.documentClient.send(command);
    return itemPayload;
  }

  public async update(
    email: string,
    payload: Record<string, any>
  ): Promise<UpdateCommandOutput> {
    const command = new UpdateCommand({
      TableName: this.usersTable,
      Key: {
        email,
        itemKey: UserItemKeys.BASE,
      },
      UpdateExpression: `SET ${Object.keys(payload)
        .map((key) => `${key} = :${key}`)
        .join(', ')}`,
      ExpressionAttributeValues: Object.keys(payload).reduce(
        (values: Record<string, any>, key: string) => {
          values[`:${key}`] = payload[key];
          return values;
        },
        {}
      ),
    });
    const response = await this.documentClient.send(command);
    return response;
  }

  public async getOneByEmail(email: string): Promise<UserItem | undefined> {
    const command = new GetCommand({
      TableName: this.usersTable,
      Key: { email, itemKey: UserItemKeys.BASE },
    });
    const response = await this.documentClient.send(command);
    if (response.Item) return response.Item as UserItem;
    return undefined;
  }
}
