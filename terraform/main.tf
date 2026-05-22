module "dynamodb" {
  source       = "./modules/dynamodb"
  project_name = var.project_name
  environment  = var.environment
}

module "secrets" {
  source       = "./modules/secrets"
  project_name = var.project_name
  environment  = var.environment
}

module "iam" {
  source       = "./modules/iam"
  project_name = var.project_name
  environment  = var.environment
  
  dynamodb_table_arn = module.dynamodb.table_arn
  secrets_arn        = module.secrets.secrets_arn
}

# Lambda Functions
module "lambda_ai_content" {
  source          = "./modules/lambda"
  function_name   = "${var.project_name}-ai-content-${var.environment}"
  handler_path    = "${path.module}/../backend/dist-lambda/ai-content.lambda.js"
  lambda_role_arn = module.iam.lambda_role_arn
  environment_variables = {
    AI_KEYS_SECRET_ID = module.secrets.secrets_arn
  }
}

module "lambda_topics" {
  source          = "./modules/lambda"
  function_name   = "${var.project_name}-topics-${var.environment}"
  handler_path    = "${path.module}/../backend/dist-lambda/topics.lambda.js"
  lambda_role_arn = module.iam.lambda_role_arn
  environment_variables = {
    TOPICS_TABLE_NAME = module.dynamodb.table_name
  }
}

module "lambda_generate_audio" {
  source          = "./modules/lambda"
  function_name   = "${var.project_name}-generate-audio-${var.environment}"
  handler_path    = "${path.module}/../backend/dist-lambda/generate-audio.lambda.js"
  lambda_role_arn = module.iam.lambda_role_arn
  environment_variables = {
    AI_KEYS_SECRET_ID = module.secrets.secrets_arn
  }
}

module "lambda_transcribe" {
  source          = "./modules/lambda"
  function_name   = "${var.project_name}-transcribe-${var.environment}"
  handler_path    = "${path.module}/../backend/dist-lambda/transcribe.lambda.js"
  lambda_role_arn = module.iam.lambda_role_arn
  environment_variables = {
    AI_KEYS_SECRET_ID = module.secrets.secrets_arn
  }
}

# Outputs
output "ai_content_url" {
  value = module.lambda_ai_content.function_url
}

output "topics_url" {
  value = module.lambda_topics.function_url
}

output "generate_audio_url" {
  value = module.lambda_generate_audio.function_url
}

output "transcribe_url" {
  value = module.lambda_transcribe.function_url
}
