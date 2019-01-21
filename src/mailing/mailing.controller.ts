import { Controller, Post } from '@nestjs/common';
import { MailingService } from './mailing.service';

@Controller('api/mailing')
export class MailingController {
  constructor(private mailingService: MailingService) {}

  @Post('send-mails')
  sendMails() {
    return this.mailingService.sendMails();
  }
}
