/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as ssm from '@aws-cdk/aws-ssm';
import CustomerUpdatedHandler from '../application/CustomerUpdatedHandler';
import { AccountDetailTable, CustomerTable } from '../data-storage';

export type ApplicationStackProps = cdk.StackProps

export default class ApplicationStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: ApplicationStackProps) {
    super(scope, id, props);

    const customerUpdatedTopic = new sns.Topic(this, 'CustomerUpdatedTopic');

    const customerTableNameParameter = ssm.StringParameter.fromStringParameterName(
      this,
      'CustomerTableNameParameter',
      CustomerTable.TABLE_NAME_SSM_PARAMETER
    );

    const accountDetailTableNameParameter = ssm.StringParameter.fromStringParameterName(
      this,
      'AccountDetailTableNameParameter',
      AccountDetailTable.TABLE_NAME_SSM_PARAMETER
    );

    new CustomerUpdatedHandler(this, 'CustomerUpdatedHandler', {
      customerUpdatedTopic,
      customerTableName: customerTableNameParameter.stringValue,
      accountDetailTableName: accountDetailTableNameParameter.stringValue,
    });
  }
}
