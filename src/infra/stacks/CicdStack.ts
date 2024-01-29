import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './PipelineStage';

export class CicdStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'AwesomePipeline', {
      pipelineName: 'AwesomePipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('zkula/AWS-CDK-Course', 'main'),
        commands: ['npm ci', 'npx cdk synth'],
      }),
    });

    const testStage = pipeline.addStage(
      new PipelineStage(this, 'PipelineTestStage', {
        stageName: 'test',
      })
    );

    testStage.addPre(
      new CodeBuildStep('unit-tests', {
        commands: ['npm ci', 'npm test'],
      })
    );
  }
}
