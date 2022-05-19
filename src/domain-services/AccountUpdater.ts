/* eslint-disable no-console */
/* eslint-disable import/extensions, import/no-absolute-path */
import { CustomerUpdatedEvent, IAccountDetailStore, ICustomerStore } from '../domain-contracts';

export default class AccountUpdater {
  constructor(
    private customerStore: ICustomerStore,
    private accountDetailsStore: IAccountDetailStore
  ) {}

  async updateAccountsAsync(event: CustomerUpdatedEvent): Promise<void> {
    //
    const customer = await this.customerStore.retrieveCustomerAsync(event.customerId);

    if (!customer) {
      const errorMessage = `No customer found for event: ${JSON.stringify(event)}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const accountDetails = await this.accountDetailsStore.listAccountDetailsByCustomerIdAsync(
      event.customerId
    );

    const updateAccountDetailPromises = accountDetails.map((ad) => {
      //
      const updatedAccountDetail = { ...ad, correspondenceAddress: customer.address };

      if (event.billingUpdateRequested) {
        updatedAccountDetail.billingAddress = customer.address;
      }

      return this.accountDetailsStore.upsertAccountDetailAsync(updatedAccountDetail);
    });

    const updateAccountDetailResults = await Promise.allSettled(updateAccountDetailPromises);

    const rejectedReasons = updateAccountDetailResults
      .filter((r) => r.status === 'rejected')
      .map((r) => (r as PromiseRejectedResult).reason);

    if (rejectedReasons.length > 0) {
      throw new Error(
        `One or more account detail updates were not processed successfully: ${JSON.stringify({
          rejectedReasons,
        })}`
      );
    }
  }
}
