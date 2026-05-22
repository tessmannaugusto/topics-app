variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = "string"
  default     = "sa-east-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = "string"
  default     = "topics-backend"
}

variable "environment" {
  description = "Environment (dev, prod, etc.)"
  type        = "string"
  default     = "dev"
}
