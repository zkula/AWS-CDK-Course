import { App } from 'aws-cdk-lib';
import { MonitorStack } from '../../src/infra/stacks/MonitorStack';
import { Capture, Match, Template } from 'aws-cdk-lib/assertions';

describe('Monitor Stack Tests', () => {
  let monitorStackTemplate: Template;
  beforeAll(() => {
    const testApp = new App({
      outdir: 'cdk.out',
    });

    const monitorStack = new MonitorStack(testApp, 'MonitorStack');
    monitorStackTemplate = Template.fromStack(monitorStack);
  });

  test('Email subscription properties', () => {
    monitorStackTemplate.hasResourceProperties('AWS::SNS::Subscription', {
      Endpoint: 'zachkula@hotmail.com',
      Protocol: 'email',
    });
  });

  test('Sns topic properties', () => {
    monitorStackTemplate.hasResourceProperties('AWS::SNS::Topic', {
      DisplayName: 'AlarmTopic',
      TopicName: 'AlarmTopic',
    });
  });

  test('Sns subscription properties - with matchers', () => {
    monitorStackTemplate.hasResourceProperties(
      'AWS::SNS::Subscription',
      Match.objectEquals({
        Endpoint: 'zachkula@hotmail.com',
        Protocol: 'email',
        TopicArn: {
          Ref: Match.stringLikeRegexp('AlarmTopic'),
        },
      })
    );
  });

  test('Alarm Actions', () => {
    const alarmActionsCapture = new Capture();
    monitorStackTemplate.hasResourceProperties('AWS::CloudWatch::Alarm', {
      AlarmActions: alarmActionsCapture,
    });

    expect(alarmActionsCapture.asArray()).toEqual([
      {
        Ref: expect.stringMatching(/^AlarmTopic/),
      },
    ]);
  });

  test('CloudWatch Alarm snapshot', () => {
    const alarm = monitorStackTemplate.findResources('AWS::CloudWatch::Alarm');
    expect(alarm).toMatchSnapshot();
  });

  test('SnsTopic snapshot', () => {
    const snsTopic = monitorStackTemplate.findResources('AWS::SNS::Topic');
    expect(snsTopic).toMatchSnapshot();
  });
});
