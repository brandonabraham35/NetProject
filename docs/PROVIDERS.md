# Provider Engine Documentation

## Adding a New Provider
1. Create a new class extending `ContentProvider.js`.
2. Implement all required interface methods (`getTrending`, `getMovie`, `search`, etc.).
3. Return raw JSON that the `Normalizer` can digest or adapt it prior to returning.
4. Register the new provider in `ProviderManager.js`:
   `this.register('newProvider', new NewProvider());`

## Provider Health Monitoring
The `ProviderManager` automatically tracks:
- Latency (ms)
- Successes / Failures
- Health Status (`Healthy`, `Failing`)

These metrics are available via the Admin API at `GET /api/v1/admin/providers`.
