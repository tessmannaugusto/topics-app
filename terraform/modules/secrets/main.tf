variable "project_name" {}
variable "environment" {}

resource "aws_secretsmanager_secret" "ai_keys" {
  name = "${var.project_name}-ai-keys-${var.environment}"
  description = "AI Provider API Keys (Gemini, OpenAI, Anthropic)"
  recovery_window_in_days = 0 # For development convenience, set to >0 for production
}

output "secrets_arn" {
  value = aws_secretsmanager_secret.ai_keys.arn
}
