import * as cdk from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Cluster, ContainerImage, CpuArchitecture, FargateService, FargateTaskDefinition, LogDriver, OperatingSystemFamily } from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // dynamodb
    const currentTable = new Table(this, 'CurrentTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      sortKey: { name: 'timestamp', type: AttributeType.NUMBER },
      billingMode: BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'expiredAt',
    });

    // ecs
    const cluster = new Cluster(this, 'BackendCluster', {
      containerInsights: true,
    });

    const taskDefinition = new FargateTaskDefinition(this, 'BackendTaskDefinition', {
      memoryLimitMiB: 512,
      cpu: 256,
      runtimePlatform:{
        cpuArchitecture: CpuArchitecture.ARM64,
        operatingSystemFamily: OperatingSystemFamily.LINUX
      }
    });
    taskDefinition.addContainer('Recorder', {
      logging: LogDriver.awsLogs({ streamPrefix: 'Recorder' }),
      image: ContainerImage.fromAsset('./container/recorder'), // ローカルのDockerfileからイメージをビルドして
      environment: {
        DDB_TABLE_NAME: currentTable.tableName,
      },
    })

    const service = new FargateService(this, 'BackendService', {
      cluster,
      taskDefinition,
    });
    currentTable.grantReadWriteData(service.taskDefinition.taskRole);
  }
}
