/* eslint-disable no-new */
import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, BillingMode, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ParameterTier, ParameterType, StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export interface AccountDetailTableProps {
  isTestResource?: boolean;
}

export default class AccountDetailTable extends Construct {
  //
  static readonly TABLE_NAME_SSM_PARAMETER = '/data-storage/account-detail-table-name';

  readonly table: ITable;

  constructor(scope: Construct, id: string, props?: AccountDetailTableProps) {
    super(scope, id);

    this.table = new Table(this, 'AccountDetailTable', {
      partitionKey: { name: 'accountDetailId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: props?.isTestResource ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    });

    if (!props?.isTestResource) {
      new StringParameter(this, 'AccountDetailTableNameSsmParameter', {
        parameterName: AccountDetailTable.TABLE_NAME_SSM_PARAMETER,
        stringValue: this.table.tableName,
        description: 'The name of the Account Detail table',
        type: ParameterType.STRING,
        tier: ParameterTier.STANDARD,
      });
    }
  }
}
