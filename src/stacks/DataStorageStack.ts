/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CustomerTable, AccountDetailTable } from '../data-storage';

export type DataStorageStackProps = StackProps

export default class DataStorageStack extends Stack {
  constructor(scope: Construct, id: string, props?: DataStorageStackProps) {
    super(scope, id, props);

    new CustomerTable(this, 'CustomerTable');
    new AccountDetailTable(this, 'AccountDetailTable');
  }
}
