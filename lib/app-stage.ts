import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiStack } from './api-stack';
import { BackendStack } from './backend-stack';
import { FrontendStack } from './frontend-stack';

export class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const backend = new BackendStack(this, `Backend`);

    new ApiStack(this, `API`, {
      currentTable: backend.currentTable,
    });

    new FrontendStack(this, `Frontend`);
  }
}