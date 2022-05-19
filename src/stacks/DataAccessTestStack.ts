/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
import { IntegrationTestStack } from '@andybalham/cdk-cloud-test-kit';
import { StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AccountDetailTable, CustomerTable } from '../data-storage';

export type DataAccessStackProps = StackProps;

export default class DataAccessTestStack extends IntegrationTestStack {
  //
  static readonly Id = 'DataAccessTestStack';

  static readonly AccountDetailTableId = 'AccountDetailTable';

  static readonly CustomerTableId = 'CustomerTable';

  constructor(scope: Construct, id: string, props?: DataAccessStackProps) {
    super(scope, id, {
      testStackId: DataAccessTestStack.Id,
      ...props,
    });

    const customerTable = new CustomerTable(this, 'CustomerTable', {
      isTestResource: true,
    });
    this.addTestResourceTag(customerTable.table, DataAccessTestStack.CustomerTableId);

    const accountDetailTable = new AccountDetailTable(this, 'AccountDetailTable', {
      isTestResource: true,
    });
    this.addTestResourceTag(accountDetailTable.table, DataAccessTestStack.AccountDetailTableId);
  }
}
