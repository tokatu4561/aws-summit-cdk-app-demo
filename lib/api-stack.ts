import * as cdk from 'aws-cdk-lib';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface ApiStackProps extends cdk.StackProps {
  currentTable: Table;
}


export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Lambda
    const getMetricsHandler = new NodejsFunction(this, 'GetMetricsHandler', {
        entry: 'lambda/metrics-handler.ts',
        handler: 'get',
        memorySize: 256,
        timeout: cdk.Duration.seconds(10),
        environment: {
            DDB_TABLE_NAME: props.currentTable.tableName,
        },
    });

    props.currentTable.grantReadData(getMetricsHandler);

    // API Gateway
    const api = new RestApi(this, 'RestAPI', {
        deployOptions: {
          tracingEnabled: true,
        },
        defaultCorsPreflightOptions: {
          allowOrigins: Cors.ALL_ORIGINS,
          allowMethods: Cors.ALL_METHODS,
        },
    });
    api.root.addResource('metrics').addMethod('Get', new LambdaIntegration(getMetricsHandler));
  }
}
