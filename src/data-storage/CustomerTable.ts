/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as ssm from '@aws-cdk/aws-ssm';

export interface CustomerTableProps {
  isTestResource?: boolean;
}

export default class CustomerTable extends cdk.Construct {
  //
  static readonly TABLE_NAME_SSM_PARAMETER = '/data-storage/customer-table-name';

  table: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props?: CustomerTableProps) {
    super(scope, id);

    this.table = new dynamodb.Table(this, 'CustomerTable', {
      partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: props?.isTestResource ? cdk.RemovalPolicy.DESTROY : cdk.RemovalPolicy.RETAIN,
    });

    if (!props?.isTestResource) {
      new ssm.StringParameter(this, 'CustomerTableNameSsmParameter', {
        parameterName: CustomerTable.TABLE_NAME_SSM_PARAMETER,
        stringValue: this.table.tableName,
        description: 'The name of the Customer table',
        type: ssm.ParameterType.STRING,
        tier: ssm.ParameterTier.STANDARD,
      });
    }
  }
}
