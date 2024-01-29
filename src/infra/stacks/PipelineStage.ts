import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaStack } from './LambdaStack';
import { DataStack } from './DataStack';
import { AuthStack } from './AuthStack';
import { ApiStack } from './ApiStack';
import { UiDeploymentStack } from './UiDeploymentStack';
import { MonitorStack } from './MonitorStack';

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    const dataStack = new DataStack(this, 'DataStack', {
      stageName: props.stageName,
    });

    const lambdaStack = new LambdaStack(this, 'LambdaStack', {
      spacesTable: dataStack.spacesTable,
      stageName: props.stageName,
    });

    const authStack = new AuthStack(this, 'AuthStack', {
      photosBucket: dataStack.photosBucket,
      stageName: props.stageName,
    });

    new ApiStack(this, 'ApiStack', {
      spacesLambdaIntegration: lambdaStack.spacesLambdaIntegration,
      userPool: authStack.userPool,
      stageName: props.stageName,
    });

    new UiDeploymentStack(this, 'UiDeploymentStack', {
      stageName: props.stageName,
    });

    new MonitorStack(this, 'MonitorStack', {
      stageName: props.stageName,
    });
  }
}
