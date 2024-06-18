export interface IEmailService {
    sendEmail(to: string, subject: string, payload: any ): Promise<boolean>;
}