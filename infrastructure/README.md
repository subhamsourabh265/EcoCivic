# Infrastructure

- `docker/`: local multi-service composition and supporting service configuration.
- `kubernetes/base/` and `kubernetes/overlays/{development,staging,production}/`: base resources and environment overlays if using Kustomize.
- `helm/charts/`: reusable charts if Helm is selected; avoid maintaining duplicate deployment definitions without a concrete need.
- `terraform/modules/` and `terraform/environments/{development,staging,production}/`: cloud resources, introduced after choosing Azure or GCP.
- `observability/{logging,metrics,tracing}/`: telemetry configuration.
- `kafka/`: future local broker configuration and topic definitions.

These directories are placeholders, not deployable infrastructure. Never commit credentials, Terraform state, or real environment secrets.
