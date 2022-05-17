/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-new */
import * as cdk from '@aws-cdk/core';
import ApplicationStack from './stacks/ApplicationStack';
import DataStorageStack from './stacks/DataStorageStack';

const app = new cdk.App();
cdk.Tags.of(app).add('app', 'HexagonalLambdaLayersApp');

new DataStorageStack(app, 'DataStorageStack', {});
new ApplicationStack(app, 'ApplicationStack', {});
