import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  @Inject(ConfigService)
  public config: ConfigService;

  getHello(): string {

    console.log("MODE =", this.config.get('MODE'));
    console.log("DB_HOST =", this.config.get('DB_HOST'));
    console.log("DB_PORT =", this.config.get('DB_PORT'));
    console.log("DB_USER =", this.config.get('DB_USER'));
    console.log("DB_DATABASE =", this.config.get('DB_DATABASE'));
    return 'Hello World!';
  }
}
