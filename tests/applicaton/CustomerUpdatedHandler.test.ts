import {
  DynamoDBTestClient,
  IntegrationTestClient,
  SNSTestClient,
} from '@andybalham/cdk-cloud-test-kit';
import { nanoid } from 'nanoid';
import { CustomerUpdatedEvent, IAccountDetailStore, ICustomerStore } from 'src/domain-contracts';
import { AccountDetailStore, CustomerStore } from '../../src/data-access';
import FunctionTestStack from '../../src/stacks/FunctionTestStack';

describe('CustomerUpdatedHandler Test Suite', () => {
  //
  const testClient = new IntegrationTestClient({
    testStackId: FunctionTestStack.Id,
  });

  let customerTable: DynamoDBTestClient;
  let customerStore: ICustomerStore;

  let accountDetailTable: DynamoDBTestClient;
  let accountDetailStore: IAccountDetailStore;

  let customerUpdatedTopic: SNSTestClient;

  beforeAll(async () => {
    await testClient.initialiseClientAsync();

    customerTable = testClient.getDynamoDBTestClient(FunctionTestStack.CustomerTableId);
    customerStore = new CustomerStore(customerTable.tableName);

    accountDetailTable = testClient.getDynamoDBTestClient(FunctionTestStack.AccountDetailTableId);
    accountDetailStore = new AccountDetailStore(accountDetailTable.tableName);

    customerUpdatedTopic = testClient.getSNSTestClient(FunctionTestStack.CustomerUpdatedTopicId);
  });

  beforeEach(async () => {
    await testClient.initialiseTestAsync();

    await customerTable.clearAllItemsAsync();
    await accountDetailTable.clearAllItemsAsync();
  });

  it('lists by customerId', async () => {
    // Arrange

    const customerId = nanoid();
    const postalCode = `PC-${nanoid()}`;

    await customerStore.upsertCustomerAsync({
      customerId,
      name: 'Trevor Potato',
      address: {
        lines: ['CAL1'],
        postalCode,
      },
    });

    await accountDetailStore.upsertAccountDetailAsync({
      accountDetailId: nanoid(),
      customerId,
      billingAddress: {
        lines: ['BAL1'],
        postalCode: 'BAPC1',
      },
      correspondenceAddress: {
        lines: ['CAL1'],
        postalCode: 'CAPC1',
      },
    });

    await accountDetailStore.upsertAccountDetailAsync({
      accountDetailId: nanoid(),
      customerId,
      billingAddress: {
        lines: ['BAL2'],
        postalCode: 'BAPC2',
      },
      correspondenceAddress: {
        lines: ['CAL2'],
        postalCode: 'CAPC2',
      },
    });

    const customerUpdatedEvent: CustomerUpdatedEvent = {
      customerId,
      billingUpdateRequested: false,
    };

    // Act

    await customerUpdatedTopic.publishEventAsync(customerUpdatedEvent);

    // Await

    const { timedOut } = await testClient.pollTestAsync({
      until: async () => {
        const accountDetails = await accountDetailStore.listAccountDetailsByCustomerIdAsync(
          customerId
        );

        return accountDetails.every(
          (ad) =>
            ad.correspondenceAddress.postalCode === postalCode &&
            ad.billingAddress.postalCode !== postalCode
        );
      },
    });

    // Assert

    expect(timedOut).toEqual(false);
  });
});
