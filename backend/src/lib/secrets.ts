import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({});
let cachedSecrets: Record<string, string> | null = null;

export const getSecrets = async (secretId: string): Promise<Record<string, string>> => {
  if (cachedSecrets) return cachedSecrets;

  try {
    const response = await client.send(
      new GetSecretValueCommand({ SecretId: secretId })
    );

    if (response.SecretString) {
      cachedSecrets = JSON.parse(response.SecretString);
      return cachedSecrets!;
    }
    return {};
  } catch (error) {
    console.error("Error fetching secrets:", error);
    return {};
  }
};
