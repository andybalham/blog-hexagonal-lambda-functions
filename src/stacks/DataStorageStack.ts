/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
import * as cdk from '@aws-cdk/core';
import { CustomerTable, AccountDetailTable } from '../data-storage';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DataStorageStackProps {
  // TODO 08Apr22: Do we need to pass anything in here?
}

export default class DataStorageStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: DataStorageStackProps) {
    super(scope, id);

    new CustomerTable(this, 'CustomerTable');
    new AccountDetailTable(this, 'AccountDetailTable');
  }
}
