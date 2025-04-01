import { Controller, Get } from '@nestjs/common';
import { JetstreamService } from './jetstream/jetstream.service';

@Controller()
export class AppController {
  constructor(private readonly jetstreamService: JetstreamService) {}
  @Get()
  getHello() {
    this.jetstreamService.publishMessage('test.log', {
      message: 'Hello World!',
    });
  }
}
