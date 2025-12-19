import nodemailer from 'nodemailer';

export type MailerSendArgs = {
  to: string;
  subject: string;
  html: string;
};

type MailerConfig = {
  transporter: nodemailer.Transporter;
  from: string;
};

function parseBoolean(value: string | undefined): boolean | undefined {
  if (typeof value !== 'string') return undefined;
  const normalised = value.trim().toLowerCase();
  if (normalised === 'true') return true;
  if (normalised === 'false') return false;
  return undefined;
}

export function getMailerConfig(): MailerConfig | null {
  const from = process.env.EMAIL_FROM;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const service = process.env.SMTP_SERVICE;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;

  if (!from || !user || !pass) return null;

  if (service) {
    const transporter = nodemailer.createTransport({
      service,
      auth: { user, pass }
    });
    return { transporter, from };
  }

  if (!host || !port) return null;

  const portNumber = Number(port);
  const secure =
    parseBoolean(process.env.SMTP_SECURE) ?? (portNumber === 465);

  const transporter = nodemailer.createTransport({
    host,
    port: portNumber,
    secure,
    auth: { user, pass }
  });

  return { transporter, from };
}

export async function sendEmail(args: MailerSendArgs): Promise<void> {
  const config = getMailerConfig();
  if (!config) {
    throw new Error('SMTP is not configured.');
  }

  await config.transporter.sendMail({
    from: config.from,
    to: args.to,
    subject: args.subject,
    html: args.html
  });
}
