/* eslint-disable no-new */
import { App, Tags } from 'aws-cdk-lib';
import ApplicationStack from './stacks/ApplicationStack';
import DataAccessTestStack from './stacks/DataAccessTestStack';
import DataStorageStack from './stacks/DataStorageStack';
import FunctionTestStack from './stacks/FunctionTestStack';

const app = new App();
Tags.of(app).add('app', 'HexagonalLambdaLayersApp');

new DataStorageStack(app, 'DataStorageStack', {});
new ApplicationStack(app, 'ApplicationStack', {});
new FunctionTestStack(app, 'FunctionTestStack', {});
new DataAccessTestStack(app, 'DataAccessTestStack', {});
