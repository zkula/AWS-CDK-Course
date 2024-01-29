import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';
import { join } from 'path';
import { existsSync } from 'fs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';

interface UiDeploymentStackProps extends StackProps {
  stageName: string;
}
export class UiDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props: UiDeploymentStackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    //Create new Bucket named `space-finder-frontend-${suffix}`
    const deploymentBucket = new Bucket(this, 'uiDeploymentBucket', {
      bucketName: `space-finder-frontend-${suffix}`,
    });

    const uiDir = join(__dirname, '..', '..', '..', '..', 'space-finder-frontend', 'dist');

    if (!existsSync(uiDir)) {
      console.warn('Ui dir not found: ' + uiDir);
      return;
    }

    //Deploy specified contents to bucket
    new BucketDeployment(this, 'SpacesFinderDeployment', {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)],
    });

    const originIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    deploymentBucket.grantRead(originIdentity);

    const distribution = new Distribution(this, 'SpacesFinderDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          originAccessIdentity: originIdentity,
        }),
      },
    });

    new CfnOutput(this, 'SpaceFinderUrl', {
      value: distribution.distributionDomainName,
    });
  }
}
