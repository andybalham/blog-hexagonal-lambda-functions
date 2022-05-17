/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import https from 'https';
import { Customer, ICustomerStore } from 'src/domain-contracts';

const agent = new https.Agent({
  keepAlive: true,
});

const documentClient = new DocumentClient({
  httpOptions: {
    agent,
  },
});

export default class CustomerStore implements ICustomerStore {
  constructor(private tableName?: string) {}

  async retrieveCustomerAsync(customerId: string): Promise<Customer | undefined> {
    //
    if (this.tableName === undefined) throw new Error('this.tableName === undefined');

    const getItemInput = { TableName: this.tableName, Key: { customerId } };

    const getItemOutput = await documentClient.get(getItemInput).promise();

    return getItemOutput.Item === undefined ? undefined : (getItemOutput.Item as Customer);
  }
}
