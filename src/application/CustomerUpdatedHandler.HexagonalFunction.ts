/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/extensions, import/no-absolute-path */
import { SNSEvent } from 'aws-lambda';
import { AccountDetailStore, CustomerStore } from '../data-access';
import AccountUpdater from '../domain-services/AccountUpdater';
import { CustomerUpdatedEvent } from '../domain-contracts';

export const ENV_VAR_CUSTOMER_TABLE_NAME = 'CUSTOMER_TABLE_NAME';
export const ENV_VAR_ACCOUNT_DETAIL_TABLE_NAME = 'ACCOUNT_DETAIL_TABLE_NAME';

const accountUpdaterFunction = new AccountUpdater(
  new CustomerStore(process.env[ENV_VAR_CUSTOMER_TABLE_NAME]),
  new AccountDetailStore(process.env[ENV_VAR_ACCOUNT_DETAIL_TABLE_NAME])
);

export const handler = async (event: SNSEvent): Promise<void> => {
  //
  const accountUpdaterFunctionPromises = event.Records.map((r) => {
    const customerUpdatedEvent = JSON.parse(r.Sns.Message) as CustomerUpdatedEvent;
    return accountUpdaterFunction.updateAccountsAsync(customerUpdatedEvent);
  });

  const accountUpdaterFunctionResults = await Promise.allSettled(accountUpdaterFunctionPromises);

  const rejectedReasons = accountUpdaterFunctionResults
    .filter((r) => r.status === 'rejected')
    .map((r) => (r as PromiseRejectedResult).reason);

  if (rejectedReasons.length > 0) {
    throw new Error(
      `One or more records were not successfully processed: ${JSON.stringify({
        rejectedReasons,
      })}`
    );
  }
};
