/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
import { Stack, StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import CustomerUpdatedHandler from '../application/CustomerUpdatedHandler';
import { AccountDetailTable, CustomerTable } from '../data-storage';

export type TestStackProps = StackProps;

export default class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: TestStackProps) {
    super(scope, id, props);

    const customerUpdatedTopic = new Topic(this, 'CustomerUpdatedTopic');

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
