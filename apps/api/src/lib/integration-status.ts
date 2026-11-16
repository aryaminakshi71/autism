type Environment = Record<string, string | undefined>;

export function getIntegrationStatus(env: Environment) {
  const configured = (keys: string[]) => keys.every((key) => Boolean(env[key]?.trim()));
  return {
    email: configured(["RESEND_API_KEY", "EMAIL_FROM"]),
    sms: configured(["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"]),
    storage: configured(["S3_ENDPOINT", "S3_BUCKET", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY"]),
    backups: configured(["BACKUP_S3_BUCKET", "BACKUP_ENCRYPTION_KEY_ID"]),
    clearinghouse: configured(["CLEARINGHOUSE_BASE_URL", "CLEARINGHOUSE_CLIENT_ID", "CLEARINGHOUSE_CLIENT_SECRET"]),
  };
}
