# Feature Spec: AWS Serverless Migration

## 1. Vision & Goals
Transition the current Express-based backend to a serverless architecture on AWS to improve scalability, reduce idle costs, and practice Infrastructure as Code (IaC) with Terraform.

## 2. Requirements

### R1: Infrastructure as Code (Terraform)
- **R1.1**: All AWS resources must be provisioned via Terraform.
- **R1.2**: Module-based structure for reusable components (Lambda, DynamoDB, IAM).

### R2: Compute (AWS Lambda)
- **R2.1**: Migrate existing API endpoints to Lambda functions.
- **R2.2**: Use a "Modular Lambda" approach (one function per endpoint) or a "Fat Lambda" (Express wrapper) - *Needs Design Decision*.
- **R2.3**: Follow AWS Lambda best practices (proper IAM roles, environment variable management, cold start optimization).

### R3: Storage (DynamoDB)
- **R3.1**: Create a DynamoDB table to store "Topics".
- **R3.2**: Schema must support Topic metadata, notes, scripts, and related questions.
- **R3.3**: Use Partition Key (PK) and Sort Key (SK) effectively for querying topics by user/folder.

### R4: Configuration (AWS Secrets Manager)
- **R4.1**: Store AI provider API keys (OpenAI, Anthropic, Gemini) and other sensitive envs in Secrets Manager.
- **R4.2**: Lambda functions must fetch secrets at runtime (or via Lambda Extension/Env injection).

### R5: API Exposure (API Gateway)
- **R5.1**: Secure endpoints using API Gateway.
- **R5.2**: Evaluate pricing vs. Function URLs (cheaper alternative).

## 3. Architecture Comparison

| Component | Current (Server) | Target (Serverless) |
|-----------|------------------|---------------------|
| Compute   | Express on Node.js| AWS Lambda          |
| API Entry | Express Router    | API Gateway / URL   |
| DB        | Local/None       | AWS DynamoDB        |
| Secrets   | .env file         | AWS Secrets Manager |
| Deploy    | Manual/PM2       | Terraform (IaC)     |

## 4. Open Questions / Gray Areas
- **Function Packaging**: Should we use one Lambda per endpoint or one Lambda for all routes?
- **API Gateway Pricing**: Are we okay with the standard REST API pricing, or should we consider HTTP APIs (cheaper) or Function URLs (free)?
- **DynamoDB Schema**: What are the primary access patterns for "Topics"?
