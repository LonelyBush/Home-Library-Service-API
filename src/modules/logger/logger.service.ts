import {
  ConsoleLogger,
  Injectable,
  LoggerService,
  Scope,
} from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger implements LoggerService {
  logout(message: string) {
    //this.writeToFile(message);
    this.log(message);
  }
  log(message: string) {
    super.log(message);
    process.stdout.write(message, (err) => {
      if (err) console.error(err);
    });
  }
  // writeToFile(message: string) {
  //   //console.log(`Write to file as: ${message}`);
  // }
}
