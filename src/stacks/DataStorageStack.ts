/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
import * as cdk from '@aws-cdk/core';
import { CustomerTable, AccountDetailTable } from '../data-storage';

export type DataStorageStackProps = cdk.StackProps

export default class DataStorageStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: DataStorageStackProps) {
    super(scope, id, props);

    new CustomerTable(this, 'CustomerTable');
    new AccountDetailTable(this, 'AccountDetailTable');
  }
}
