variable "project_name" {}
variable "environment" {}

resource "aws_dynamodb_table" "topics" {
  name           = "${var.project_name}-topics-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name               = "UserIndex"
    hash_key           = "userId"
    projection_type    = "ALL"
  }

  tags = {
    Name        = "TopicsTable"
    Environment = var.environment
  }
}

output "table_arn" {
  value = aws_dynamodb_table.topics.arn
}

output "table_name" {
  value = aws_dynamodb_table.topics.name
}
