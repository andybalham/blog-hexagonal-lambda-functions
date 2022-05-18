/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, BillingMode, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ParameterTier, ParameterType, StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export interface CustomerTableProps {
  isTestResource?: boolean;
}

export default class CustomerTable extends Construct {
  //
  static readonly TABLE_NAME_SSM_PARAMETER = '/data-storage/customer-table-name';

  table: ITable;

  constructor(scope: Construct, id: string, props?: CustomerTableProps) {
    super(scope, id);

    this.table = new Table(this, 'CustomerTable', {
      partitionKey: { name: 'customerId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: props?.isTestResource ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    });

    if (!props?.isTestResource) {
      new StringParameter(this, 'CustomerTableNameSsmParameter', {
        parameterName: CustomerTable.TABLE_NAME_SSM_PARAMETER,
        stringValue: this.table.tableName,
        description: 'The name of the Customer table',
        type: ParameterType.STRING,
        tier: ParameterTier.STANDARD,
      });
    }
  }
}
