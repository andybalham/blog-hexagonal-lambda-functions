/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
import { Stack, StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import CustomerUpdatedHandler from '../application/CustomerUpdatedHandler';
import { AccountDetailTable, CustomerTable } from '../data-storage';

export type ApplicationStackProps = StackProps

export default class ApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props?: ApplicationStackProps) {
    super(scope, id, props);

    const customerUpdatedTopic = new Topic(this, 'CustomerUpdatedTopic');

    const customerTableNameParameter = StringParameter.fromStringParameterName(
      this,
      'CustomerTableNameParameter',
      CustomerTable.TABLE_NAME_SSM_PARAMETER
    );

    const accountDetailTableNameParameter = StringParameter.fromStringParameterName(
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
