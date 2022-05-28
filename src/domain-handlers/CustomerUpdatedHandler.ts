import {
  CustomerUpdatedEvent,
  IAccountDetailStore,
  ICustomerStore,
} from '../domain-contracts';

export default class CustomerUpdatedHandler {
  constructor(
    private customerStore: ICustomerStore,
    private accountDetailsStore: IAccountDetailStore
  ) {}

  async handleAsync(event: CustomerUpdatedEvent): Promise<void> {
    //
    const customer = await this.customerStore.retrieveCustomerAsync(
      event.customerId
    );

    if (!customer) {
      throw new Error(`No customer found for id: ${event.customerId}`);
    }

    const accountDetails =
      await this.accountDetailsStore.listAccountDetailsByCustomerIdAsync(
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

      return this.accountDetailsStore.upsertAccountDetailAsync(
        updatedAccountDetail
      );
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
}
