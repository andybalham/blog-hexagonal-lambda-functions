/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/extensions, import/no-absolute-path */
import { SNSEvent } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import https from 'https';
import {
  AccountDetail,
  Customer,
  CustomerUpdatedEvent,
} from '../domain-contracts';

const agent = new https.Agent({
  keepAlive: true,
});

const documentClient = new DocumentClient({
  httpOptions: {
    agent,
  },
});

export const ENV_VAR_CUSTOMER_TABLE_NAME = 'CUSTOMER_TABLE_NAME';
export const ENV_VAR_ACCOUNT_DETAIL_TABLE_NAME = 'ACCOUNT_DETAIL_TABLE_NAME';

const customerTableName = process.env[ENV_VAR_CUSTOMER_TABLE_NAME];
const accountDetailTableName = process.env[ENV_VAR_ACCOUNT_DETAIL_TABLE_NAME];

async function listAccountDetailsByCustomerIdAsync(
  customerId: string
): Promise<AccountDetail[]> {
  //
  if (accountDetailTableName === undefined)
    throw new Error('accountDetailTableName === undefined');

  const scanResult = await documentClient
    .scan({
      TableName: accountDetailTableName,
      FilterExpression: 'customerId = :customerId',
      ExpressionAttributeValues: {
        ':customerId': customerId,
      },
    })
    .promise();

  return (scanResult.Items || []).map((i) => i as AccountDetail);
}

async function upsertAccountDetailAsync(
  accountDetail: AccountDetail
): Promise<void> {
  //
  if (accountDetailTableName === undefined)
    throw new Error('accountDetailTableName === undefined');

  await documentClient
    .put({
      TableName: accountDetailTableName,
      Item: accountDetail,
    })
    .promise();
}

async function retrieveCustomerAsync(
  customerId: string
): Promise<Customer | undefined> {
  //
  if (customerTableName === undefined)
    throw new Error('this.customerTableName === undefined');

  const getItemInput = { TableName: customerTableName, Key: { customerId } };

  const getItemOutput = await documentClient.get(getItemInput).promise();

  return getItemOutput.Item === undefined
    ? undefined
    : (getItemOutput.Item as Customer);
}

async function updateAccountsAsync(event: CustomerUpdatedEvent): Promise<void> {
  //
  const customer = await retrieveCustomerAsync(event.customerId);

  if (!customer) {
    const errorMessage = `No customer found for event: ${JSON.stringify(
      event
    )}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const accountDetails = await listAccountDetailsByCustomerIdAsync(
    event.customerId
  );

  const updateAccountDetailPromises = accountDetails.map((ad) => {
    //
    const updatedAccountDetail = {
      ...ad,
      correspondenceAddress: customer.address,
    };

    if (event.billingUpdateRequested) {
      updatedAccountDetail.billingAddress = customer.address;
    }

    return upsertAccountDetailAsync(updatedAccountDetail);
  });

  const updateAccountDetailResults = await Promise.allSettled(
    updateAccountDetailPromises
  );

  const rejectedReasons = updateAccountDetailResults
    .filter((r) => r.status === 'rejected')
    .map((r) => (r as PromiseRejectedResult).reason as string);

  if (rejectedReasons.length > 0) {
    throw new Error(
      `One or more updates were not processed: ${rejectedReasons.join(', ')}`
    );
  }
}

export const handler = async (event: SNSEvent): Promise<void> => {
  //
  const accountUpdaterFunctionPromises = event.Records.map((r) => {
    const customerUpdatedEvent = JSON.parse(
      r.Sns.Message
    ) as CustomerUpdatedEvent;
    return updateAccountsAsync(customerUpdatedEvent);
  });

  const accountUpdaterFunctionResults = await Promise.allSettled(
    accountUpdaterFunctionPromises
  );

  const rejectedReasons = accountUpdaterFunctionResults
    .filter((r) => r.status === 'rejected')
    .map((r) => (r as PromiseRejectedResult).reason as string);

  if (rejectedReasons.length > 0) {
    throw new Error(
      `One or more updates were not processed: ${rejectedReasons.join(', ')}`
    );
  }
};
