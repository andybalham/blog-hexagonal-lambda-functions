export interface Address {
  lines: string[];
  postalCode: string;
}

export interface Customer {
  customerId: string;
  name: string;
  address: Address;
}

export interface AccountDetail {
  accountDetailId: string;
  customerId: string;
  correspondenceAddress: Address;
  billingAddress: Address;
}
