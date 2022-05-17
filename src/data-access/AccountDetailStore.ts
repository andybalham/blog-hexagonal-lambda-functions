/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import https from 'https';
import { AccountDetail } from '../domain-contracts/models';
import { IAccountDetailStore } from '../domain-contracts/services';

const agent = new https.Agent({
  keepAlive: true,
});

const documentClient = new DocumentClient({
  httpOptions: {
    agent,
  },
});

export default class AccountDetailStore implements IAccountDetailStore {
  constructor(private tableName?: string) {}

  async listAccountDetailsByCustomerIdAsync(customerId: string): Promise<AccountDetail[]> {
    //
    if (this.tableName === undefined) throw new Error('this.tableName === undefined');

    const scanResult = await documentClient
      .scan({
        TableName: this.tableName,
        FilterExpression: 'customerId = :customerId',
        ExpressionAttributeValues: {
          ':customerId': customerId,
        },
      })
      .promise();

    return (scanResult.Items || []).map((i) => i as AccountDetail);
  }

  async updateAccountDetailAsync(accountDetail: AccountDetail): Promise<void> {
    //
    if (this.tableName === undefined) throw new Error('this.tableName === undefined');

    await documentClient
      .put({
        TableName: this.tableName,
        Item: accountDetail,
      })
      .promise();
  }
}
