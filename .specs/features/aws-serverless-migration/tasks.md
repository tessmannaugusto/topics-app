# Tasks: AWS Serverless Migration

## T1: Infrastructure Setup (Terraform)
- [x] **T1.1**: Initialize Terraform project and define provider (AWS). [P]
- [x] **T1.2**: Create `modules/dynamodb` for the `Topics` table.
- [x] **T1.3**: Create `modules/secrets` for AI provider keys.
- [x] **T1.4**: Create `modules/iam` for Lambda execution roles with required permissions.

## T2: Backend Refactoring (Lambda Handlers)
- [x] **T2.1**: Install necessary types for Lambda (`@types/aws-lambda`).
- [x] **T2.2**: Create a `backend/src/lib/lambda-utils.ts` for standardized responses and error handling.
- [x] **T2.3**: Refactor AI generation endpoints (`generate-questions`, `generate-script`, `evaluate-answer`) into a unified `ai-content.lambda.ts`.
- [x] **T2.5**: Refactor `generate-audio.ts` to AWS Lambda format.
- [x] **T2.6**: Refactor `transcribe.ts` to AWS Lambda format.
- [x] **T2.8**: Create new Lambda handlers for Topic CRUD operations (list, update, delete).

## T3: Build & Deployment Configuration
- [x] **T3.1**: Configure `esbuild` script in `backend/package.json` to bundle each handler separately.
- [x] **T3.2**: Create `modules/lambda` in Terraform to deploy the bundled ZIPs and enable Function URLs.
- [x] **T3.3**: Integrate Secrets Manager fetching logic into the shared AI service.

## T4: Validation & Cleanup
- [ ] **T4.1**: Verify each Function URL with `curl` or Postman.
- [ ] **T4.2**: Verify DynamoDB persistence for topics.
- [ ] **T4.3**: Update Frontend configuration to use the new Lambda URLs.
- [ ] **T4.4**: Document the new deployment process in a `DEPLOYMENT.md`.
