/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as ssm from '@aws-cdk/aws-ssm';

export interface AccountDetailTableProps {
  isTestResource?: boolean;
}

export default class AccountDetailTable extends cdk.Construct {
  //
  static readonly TABLE_NAME_SSM_PARAMETER = '/data-storage/account-detail-table-name';

  readonly table: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props?: AccountDetailTableProps) {
    super(scope, id);

    this.table = new dynamodb.Table(this, 'AccountDetailTable', {
      partitionKey: { name: 'accountDetailId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: props?.isTestResource ? cdk.RemovalPolicy.DESTROY : cdk.RemovalPolicy.RETAIN,
    });

    if (!props?.isTestResource) {
      new ssm.StringParameter(this, 'AccountDetailTableNameSsmParameter', {
        parameterName: AccountDetailTable.TABLE_NAME_SSM_PARAMETER,
        stringValue: this.table.tableName,
        description: 'The name of the Account Detail table',
        type: ssm.ParameterType.STRING,
        tier: ssm.ParameterTier.STANDARD,
      });
    }
  }
}
