import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY') ?? '';
    this.resend = new Resend(apiKey);
  }

  sendNotification(
    user: Record<string, any>,
  ): Observable<void> {
    const email = this.configService.get<string>('EMAIL_SEND') ?? '';
    return from(
      (async () => {
        try {
          const htmlContent = this.generateEmailHTML(user);
          const from = this.configService.get<string>('EMAIL_FROM') ?? 'onboarding@resend.dev';
          const { error } = await this.resend.emails.send({
            from,
            to: email,
            subject: 'Confirmacion',
            html: htmlContent,
          });

          if (error) {
            this.logger.error(`Error al enviar email a ${email}: ${error.message}`);
            return;
          }

          this.logger.log(`Email de actualización enviado a ${email}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.error(`Error al enviar email a ${email}: ${errorMessage}`);
        }
      })(),
    );
  }

  private generateEmailHTML(
    user: Record<string, any>,
  ): string {
    const detailsHTML = Object.entries(user)
      .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 5px; }
            .header { background-color: #007bff; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
            .content { background-color: white; padding: 20px; border-radius: 0 0 5px 5px; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
            ul { list-style-type: none; padding: 0; }
            li { padding: 8px 0; border-bottom: 1px solid #eee; }
          </style>
        </head>
        <body>
          <p>Confirmado ${user.name} ${user.lastName},</p>
        </body>
      </html>
    `;
  }
}


