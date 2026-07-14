# Internal Content API

## Content Endpoints
- `GET /api/v1/content/trending/all`
- `GET /api/v1/content/trending/movies`
- `GET /api/v1/content/trending/series`
- `GET /api/v1/content/popular/movies`
- `GET /api/v1/content/popular/series`
- `GET /api/v1/content/discover/:type`
- `GET /api/v1/content/movie/:id`
- `GET /api/v1/content/series/:id`
- `GET /api/v1/content/:type/:id/videos`

All requests support basic query parameters like `?page=`.

## Personalized Endpoints (Requires Auth)
- `GET /api/v1/content/recommendations`
- `GET /api/v1/user/search-history`
