#  Ize setup 

This action sets up `ize` for use within GitHub actions.

Ize is designed as a simple wrapper around popular tools, so they can be easily integrated in one infra: terraform, ECS deployment, serverless, and others.

## Usage

Copy and paste the following snippet into your .yml file.

```yaml
 - name: test action kobrikx
   uses: hazelops/action-setup-ize@0.0.1
   with:
     version: 0.3.0
```
