export class Address {
  readonly lines: string[];
  readonly postalCode: string;
}

export class Customer {
  customerId: string;
  name: string;
  address: Address;
}

export class AccountDetail {
  accountDetailId: string;
  customerId: string;
  correspondenceAddress: Address;
  billingAddress: Address;
}
