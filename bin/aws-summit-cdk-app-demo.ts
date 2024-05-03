#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();
const prefix = 'AwsSummitCdkAppDemo';

const repo = app.node.tryGetContext('source-repository');
const branch = app.node.tryGetContext('source-branch');
const connectionArn = app.node.tryGetContext('source-connection-arn');

new PipelineStack(app, `${prefix}Pipeline`, {
  prefix,
  repo,
  branch,
  connectionArn,
});

// const backend = new BackendStack(app, `${prefix}Backend`);
// new ApiStack(app, `${prefix}API`, {
//   currentTable: backend.currentTable,
// });
// new FrontendStack(app, `${prefix}Frontend`);