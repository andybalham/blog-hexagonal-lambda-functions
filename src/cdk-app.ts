/* eslint-disable no-new */
import { App, Tags } from 'aws-cdk-lib';
import ApplicationStack from './stacks/ApplicationStack';
import DataStorageStack from './stacks/DataStorageStack';
import TestStack from './stacks/TestStack';

const app = new App();
Tags.of(app).add('app', 'HexagonalLambdaLayersApp');

new DataStorageStack(app, 'DataStorageStack', {});
new ApplicationStack(app, 'ApplicationStack', {});
new TestStack(app, 'TestStack', {});
