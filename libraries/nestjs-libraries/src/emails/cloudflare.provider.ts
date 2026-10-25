import { EmailInterface } from '@gitroom/nestjs-libraries/emails/email.interface';

type CloudflareEmailResponse = {
  success?: boolean;
  errors?: Array<{ code?: number; message?: string }>;
  result?: {
    delivered?: string[];
    queued?: string[];
    permanent_bounces?: string[];
  };
};

export class CloudflareEmailProvider implements EmailInterface {
  name = 'cloudflare';
  validateEnvKeys = ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_EMAIL_API_TOKEN'];

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    emailFromName: string,
    emailFromAddress: string,
    replyTo?: string
  ) {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_EMAIL_API_TOKEN;
    if (!accountId || !apiToken) {
      throw new Error('Cloudflare Email Sending is missing required configuration');
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/email/sending/send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          from: `${emailFromName} <${emailFromAddress}>`,
          subject,
          html,
          text: html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
          ...(replyTo ? { reply_to: replyTo } : {}),
        }),
      }
    );

    let result: CloudflareEmailResponse;
    try {
      result = (await response.json()) as CloudflareEmailResponse;
    } catch {
      throw new Error(`Cloudflare Email Sending returned HTTP ${response.status} with an invalid response`);
    }

    if (!response.ok || !result.success) {
      const details = result.errors?.map(({ code, message }) =>
        [code, message].filter(Boolean).join(': ')
      ).join('; ');
      throw new Error(`Cloudflare Email Sending failed (HTTP ${response.status})${details ? `: ${details}` : ''}`);
    }

    if (result.result?.permanent_bounces?.includes(to)) {
      throw new Error('Cloudflare Email Sending permanently bounced the recipient');
    }

    if (
      !result.result?.delivered?.includes(to) &&
      !result.result?.queued?.includes(to)
    ) {
      throw new Error('Cloudflare Email Sending did not report the recipient as delivered or queued');
    }

    return result;
  }
}
