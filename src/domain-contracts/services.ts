import { AccountDetail, Customer } from './models';

export interface ICustomerStore {
  retrieveCustomerAsync(customerId: string): Promise<Customer | undefined>;
  upsertCustomerAsync(customer: Customer): Promise<void>;
}

export interface IAccountDetailStore {
  listAccountDetailsByCustomerIdAsync(customerId: string): Promise<AccountDetail[]>;
  upsertAccountDetailAsync(accountDetail: AccountDetail): Promise<void>;
}
