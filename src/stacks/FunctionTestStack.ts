/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
import { IntegrationTestStack } from '@andybalham/cdk-cloud-test-kit';
import { StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import CustomerUpdatedHandler from '../application/CustomerUpdatedHandler';
import { AccountDetailTable, CustomerTable } from '../data-storage';

export type TestStackProps = StackProps;

export default class FunctionTestStack extends IntegrationTestStack {
  //
  static readonly Id = 'FunctionTestStack';

  static readonly CustomerUpdatedTopicId = 'CustomerUpdatedTopic';

  static readonly AccountDetailTableId = 'AccountDetailTable';

  static readonly CustomerTableId = 'CustomerTable';

  constructor(scope: Construct, id: string, props?: TestStackProps) {
    super(scope, id, {
      testStackId: FunctionTestStack.Id,
      ...props,
    });

    const customerUpdatedTopic = new Topic(this, 'CustomerUpdatedTopic');
    this.addTestResourceTag(customerUpdatedTopic, FunctionTestStack.CustomerUpdatedTopicId);

    const customerTable = new CustomerTable(this, 'CustomerTable', {
      isTestResource: true,
    });
    this.addTestResourceTag(customerTable.table, FunctionTestStack.CustomerTableId);

    const accountDetailTable = new AccountDetailTable(this, 'AccountDetailTable', {
      isTestResource: true,
    });
    this.addTestResourceTag(accountDetailTable.table, FunctionTestStack.AccountDetailTableId);

    new CustomerUpdatedHandler(this, 'CustomerUpdatedHandler', {
      customerUpdatedTopic,
      customerTableName: customerTable.table.tableName,
      accountDetailTableName: accountDetailTable.table.tableName,
    });
  }
}
