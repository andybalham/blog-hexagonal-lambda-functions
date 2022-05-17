/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import * as cdk from '@aws-cdk/core';
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as sns from '@aws-cdk/aws-sns';
import * as snsSubs from '@aws-cdk/aws-sns-subscriptions';
import {
  ENV_VAR_ACCOUNT_DETAIL_TABLE_NAME,
  ENV_VAR_CUSTOMER_TABLE_NAME,
} from './CustomerUpdatedHandler.HexagonalFunction';

export interface CustomerUpdatedProps {
  customerUpdatedTopic: sns.ITopic;
  customerTableName: string;
  accountDetailTableName: string;
}

const functionType: 'InlineFunction' | 'HexagonalFunction' = 'InlineFunction';

export default class CustomerUpdatedHandler extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: CustomerUpdatedProps) {
    super(scope, id);

    const customerTable = dynamodb.Table.fromTableName(
      this,
      'CustomerTable',
      props.customerTableName
    );

    const accountDetailTable = dynamodb.Table.fromTableName(
      this,
      'AccountDetailTable',
      props.accountDetailTableName
    );

    const accountUpdaterFunction = new lambdaNodejs.NodejsFunction(scope, functionType, {
      environment: {
        [ENV_VAR_CUSTOMER_TABLE_NAME]: props.customerTableName,
        [ENV_VAR_ACCOUNT_DETAIL_TABLE_NAME]: props.accountDetailTableName,
      },
    });

    props.customerUpdatedTopic.addSubscription(
      new snsSubs.LambdaSubscription(accountUpdaterFunction)
    );

    customerTable.grantReadData(accountUpdaterFunction);
    accountDetailTable.grantReadWriteData(accountUpdaterFunction);
  }
}
