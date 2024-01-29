import { App } from 'aws-cdk-lib';
import { DataStack } from './stacks/DataStack';
import { LambdaStack } from './stacks/LambdaStack';
import { ApiStack } from './stacks/ApiStack';
import { AuthStack } from './stacks/AuthStack';
import { UiDeploymentStack } from './stacks/UiDeploymentStack';
import { MonitorStack } from './stacks/MonitorStack';
import { CicdStack } from './stacks/CicdStack';

const app = new App();
new CicdStack(app, 'CicdStack');

app.synth();
