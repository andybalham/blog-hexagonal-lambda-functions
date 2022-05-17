import { AccountDetail, Customer } from './models';

export interface ICustomerStore {
  retrieveCustomerAsync(customerId: string): Promise<Customer | undefined>;
}

export interface IAccountDetailStore {
  listAccountDetailsByCustomerIdAsync(customerId: string): Promise<AccountDetail[]>;
  updateAccountDetailAsync(accountDetail: AccountDetail): Promise<void>;
}
