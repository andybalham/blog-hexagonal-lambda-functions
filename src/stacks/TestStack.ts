/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
import { IntegrationTestStack } from '@andybalham/cdk-cloud-test-kit';
import { StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import CustomerUpdatedHandler from '../application/CustomerUpdatedHandler';
import { AccountDetailTable, CustomerTable } from '../data-storage';

export type TestStackProps = StackProps;

export default class TestStack extends IntegrationTestStack {
  //
  static readonly Id = 'TestStack';

  static readonly CustomerUpdatedTopicId = 'CustomerUpdatedTopic';

  static readonly AccountDetailTableId = 'AccountDetailTable';

  static readonly CustomerTableId = 'CustomerTable';

  constructor(scope: Construct, id: string, props?: TestStackProps) {
    super(scope, id, {
      testStackId: TestStack.Id,
      ...props,
    });

    const customerUpdatedTopic = new Topic(this, 'CustomerUpdatedTopic');
    this.addTestResourceTag(customerUpdatedTopic, TestStack.CustomerUpdatedTopicId);

    const customerTable = new CustomerTable(this, 'CustomerTable', {
      isTestResource: true,
    });
    this.addTestResourceTag(customerTable.table, TestStack.CustomerTableId);

    const accountDetailTable = new AccountDetailTable(this, 'AccountDetailTable', {
      isTestResource: true,
    });
    this.addTestResourceTag(accountDetailTable.table, TestStack.AccountDetailTableId);

    new CustomerUpdatedHandler(this, 'CustomerUpdatedHandler', {
      customerUpdatedTopic,
      customerTableName: customerTable.table.tableName,
      accountDetailTableName: accountDetailTable.table.tableName,
    });
  }
}
