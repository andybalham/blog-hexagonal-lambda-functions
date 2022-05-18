/* eslint-disable no-console */
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ITopic } from 'aws-cdk-lib/aws-sns';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';
import {
  ENV_VAR_ACCOUNT_DETAIL_TABLE_NAME,
  ENV_VAR_CUSTOMER_TABLE_NAME,
} from './CustomerUpdatedHandler.HexagonalFunction';

export interface CustomerUpdatedProps {
  customerUpdatedTopic: ITopic;
  customerTableName: string;
  accountDetailTableName: string;
}

const functionType: 'InlineFunction' | 'HexagonalFunction' = 'InlineFunction';

export default class CustomerUpdatedHandler extends Construct {
  constructor(scope: Construct, id: string, props: CustomerUpdatedProps) {
    super(scope, id);

    const customerTable = Table.fromTableName(
      this,
      'CustomerTable',
      props.customerTableName
    );

    const accountDetailTable = Table.fromTableName(
      this,
      'AccountDetailTable',
      props.accountDetailTableName
    );

    const accountUpdaterFunction = new NodejsFunction(scope, functionType, {
      environment: {
        [ENV_VAR_CUSTOMER_TABLE_NAME]: props.customerTableName,
        [ENV_VAR_ACCOUNT_DETAIL_TABLE_NAME]: props.accountDetailTableName,
      },
    });

    props.customerUpdatedTopic.addSubscription(
      new LambdaSubscription(accountUpdaterFunction)
    );

    customerTable.grantReadData(accountUpdaterFunction);
    accountDetailTable.grantReadWriteData(accountUpdaterFunction);
  }
}
