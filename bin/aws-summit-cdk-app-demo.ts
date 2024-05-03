#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from '../lib/backend-stack';
import { ApiStack } from '../lib/api-stack';


const app = new cdk.App();
const prefix = 'AwsSummitCdkAppDemo';

const backend = new BackendStack(app, `${prefix}Backend`);
new ApiStack(app, `${prefix}API`, {
  currentTable: backend.currentTable,
});