import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      app: process.env.appName,
      // env: getEnv().env,
      // uptime: msToTime(DateTime.now().toMillis() - startedAt),
      // now: DateTime.now().toISO(),
      // memory: getMemoryUsage(),
    };
  }
}
