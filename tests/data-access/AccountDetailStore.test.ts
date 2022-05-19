import { DynamoDBTestClient, IntegrationTestClient } from '@andybalham/cdk-cloud-test-kit';
import { nanoid } from 'nanoid';
import { AccountDetailStore } from '../../src/data-access';
import DataAccessTestStack from '../../src/stacks/DataAccessTestStack';

describe('AccountDetailStore Test Suite', () => {
  //
  const testClient = new IntegrationTestClient({
    testStackId: DataAccessTestStack.Id,
  });

  let accountDetailTable: DynamoDBTestClient;

  beforeAll(async () => {
    await testClient.initialiseClientAsync();
    accountDetailTable = testClient.getDynamoDBTestClient(DataAccessTestStack.AccountDetailTableId);
  });

  beforeEach(async () => {
    await testClient.initialiseTestAsync();
    await accountDetailTable.clearAllItemsAsync();
  });

  it('lists by customerId', async () => {
    // Arrange

    const accountDetailStore = new AccountDetailStore(accountDetailTable.tableName);

    const customerId = nanoid();

    await accountDetailStore.upsertAccountDetailAsync({
      accountDetailId: nanoid(),
      customerId,
      billingAddress: {
        lines: ['BL1'],
        postalCode: 'BPC1',
      },
      correspondenceAddress: {
        lines: ['CL1'],
        postalCode: 'CPC1',
      },
    });

    await accountDetailStore.upsertAccountDetailAsync({
      accountDetailId: nanoid(),
      customerId,
      billingAddress: {
        lines: ['BL2'],
        postalCode: 'BPC2',
      },
      correspondenceAddress: {
        lines: ['CL2'],
        postalCode: 'CPC2',
      },
    });

    // Act

    const accountDetails = await accountDetailStore.listAccountDetailsByCustomerIdAsync(customerId);

    // Assert

    expect(accountDetails.length).toEqual(2);
  });
});
