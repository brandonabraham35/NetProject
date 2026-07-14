# Netflix Clone - Streaming Platform Architecture

## Overview
This platform utilizes a decoupled, modular architecture designed to support multiple content providers effortlessly. The frontend never communicates directly with third-party streaming APIs; instead, it relies entirely on the internal Content Platform.

## Core Flow
Frontend -> REST API (Express) -> ContentService -> ProviderManager -> [TMDBProvider, FutureProviders]

## Key Components
- **ProviderManager**: Manages registration, health tracking, and fallback execution of content requests across multiple providers.
- **ContentCache**: A PostgreSQL-backed caching layer that stores normalized provider responses and supports graceful degradation using stale data during upstream outages.
- **Normalizer**: An abstraction adapter ensuring raw JSON from various providers is structurally aligned before returning to the frontend to ensure zero UI breakage.
- **SyncManager**: Node-cron jobs running in the background to automatically warm cache for Trending, Popular, and Genres to reduce frontend latency.
- **RecommendationService**: Version 1 recommendation engine dynamically suggesting titles by integrating the user's SearchHistory and Favorites (List).
