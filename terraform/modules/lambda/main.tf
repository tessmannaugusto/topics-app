variable "function_name" {
  description = "Name of the Lambda function"
  type        = string
}

variable "handler_path" {
  description = "Path to the bundled JS handler"
  type        = string
}

variable "lambda_role_arn" {
  description = "IAM Role ARN for the Lambda"
  type        = string
}

variable "environment_variables" {
  description = "Environment variables for the Lambda"
  type        = map(string)
  default     = {}
}

variable "runtime" {
  description = "Lambda runtime"
  type        = string
  default     = "nodejs22.x"
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = var.handler_path
  output_path = "${var.handler_path}.zip"
}

resource "aws_lambda_function" "this" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = var.function_name
  role            = var.lambda_role_arn
  handler         = "${replace(basename(var.handler_path), ".js", "")}.handler"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  runtime         = var.runtime
  timeout         = 30
  memory_size     = 256

  environment {
    variables = var.environment_variables
  }
}

resource "aws_lambda_function_url" "this" {
  function_name      = aws_lambda_function.this.function_name
  authorization_type = "NONE" # Public for Function URLs, security handled via custom logic or API keys if needed

  cors {
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
    max_age           = 86400
  }
}

output "function_url" {
  value = aws_lambda_function_url.this.function_url
}

output "function_name" {
  value = aws_lambda_function.this.function_name
}
