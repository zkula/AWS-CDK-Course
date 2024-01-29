import { handler } from '../src/services/spaces/handler';

handler(
  {
    httpMethod: 'POST',
    // queryStringParameters: {
    //   id: '57c5380a-42fc-431e-ac50-2f876eb7d46e',
    // },
    body: JSON.stringify({
      location: 'Dublin Updated',
    }),
  } as any,
  {} as any
).then((result) => console.log(result));
