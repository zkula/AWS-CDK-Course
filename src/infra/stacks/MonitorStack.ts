import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';
import { Alarm, Metric, Unit } from 'aws-cdk-lib/aws-cloudwatch';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';

export class MonitorStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    const alarmTopic = new Topic(this, 'AlarmTopic', {
      displayName: 'AlarmTopic',
      topicName: 'AlarmTopic',
    });

    alarmTopic.addSubscription(new EmailSubscription('zachkula@hotmail.com'));

    const spacesApi400Alarm = new Alarm(this, 'spacesApi4xxAlarm', {
      metric: new Metric({
        metricName: '4XXError',
        namespace: 'AWS/ApiGateway',
        period: Duration.minutes(1),
        statistic: 'Sum',
        unit: Unit.COUNT,
        dimensionsMap: {
          ApiName: 'SpacesApi',
        },
      }),
      evaluationPeriods: 1,
      threshold: 5,
      alarmName: 'SpacesApi4xxAlarm',
    });

    const topicAction = new SnsAction(alarmTopic);
    spacesApi400Alarm.addAlarmAction(topicAction);
    // spacesApi400Alarm.addOkAction(topicAction);
  }
}
