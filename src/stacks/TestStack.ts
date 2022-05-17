/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import CustomerUpdatedHandler from '../application/CustomerUpdatedHandler';
import { AccountDetailTable, CustomerTable } from '../data-storage';

export type TestStackProps = cdk.StackProps;

export default class TestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: TestStackProps) {
    super(scope, id, props);

    const customerUpdatedTopic = new sns.Topic(this, 'CustomerUpdatedTopic');

    const customerTable = new CustomerTable(this, 'CustomerTable', {
      isTestResource: true,
    });

    const accountDetailTable = new AccountDetailTable(this, 'AccountDetailTable', {
      isTestResource: true,
    });

    new CustomerUpdatedHandler(this, 'CustomerUpdatedHandler', {
      customerUpdatedTopic,
      customerTableName: customerTable.table.tableName,
      accountDetailTableName: accountDetailTable.table.tableName,
    });
  }
}
