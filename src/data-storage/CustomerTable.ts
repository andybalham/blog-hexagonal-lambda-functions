/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as ssm from '@aws-cdk/aws-ssm';

export default class CustomerTable extends cdk.Construct {
  //
  static readonly TABLE_NAME_SSM_PARAMETER = '/data-storage/customer-table-name';

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const customerTable = new dynamodb.Table(this, 'CustomerTable', {
      partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For non-test environments this should not be set
    });

    new ssm.StringParameter(this, 'CustomerTableNameSsmParameter', {
      parameterName: CustomerTable.TABLE_NAME_SSM_PARAMETER,
      stringValue: customerTable.tableName,
      description: 'The name of the Customer table',
      type: ssm.ParameterType.STRING,
      tier: ssm.ParameterTier.STANDARD,
    });
  }
}
