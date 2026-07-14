/**
 * Normalizer.js
 *
 * Standardizes responses from various providers into a consistent internal model.
 */

class Normalizer {

  /**
   * Normalizes a movie or series item.
   * Assumes TMDB structure for this initial implementation,
   * but maps it to a provider-agnostic internal format.
   */
  static normalizeItem(item, providerName) {
    if (!item) return null;

    // Distinguish type correctly
    const mediaType = item.media_type || (item.name ? 'tv' : 'movie');

    return {
      id: item.id?.toString(),
      title: item.title || item.name || item.original_name,
      overview: item.overview || '',
      poster: item.poster_path, // internally we might keep the relative path and let UI form URL
      backdrop: item.backdrop_path,
      releaseDate: item.release_date || item.first_air_date,
      genres: item.genre_ids || item.genres?.map(g => g.id) || [],
      genreObjects: item.genres || [], // Maintain detailed objects for single item views
      rating: item.vote_average,
      provider: providerName,
      mediaType: mediaType,
      language: item.original_language,
      runtime: item.runtime || null,
      seasonCount: item.number_of_seasons || null,
      episodeCount: item.number_of_episodes || null,
      status: item.status || 'Unknown',
      images: item.images || null,
      trailers: item.videos || null,
      cast: item.credits?.cast?.slice(0, 10) || null,
      crew: item.credits?.crew?.filter(c => ['Director', 'Producer'].includes(c.job)) || null,
      similar: item.similar ? this.normalizeList(item.similar.results, providerName) : null
    };
  }

  static normalizeList(results, providerName) {
    if (!Array.isArray(results)) return [];
    return results.map(item => this.normalizeItem(item, providerName));
  }

  /**
   * TMDB Adapter
   * The frontend explicitly relies on properties like 'name', 'title', 'backdrop_path'.
   * This function converts our strict internal normalized model back to the shape the UI expects
   * to strictly satisfy "DO NOT redesign the UI" and "DO NOT break existing pages."
   */
  static adaptToUI(normalizedItem) {
    if (!normalizedItem) return null;

    return {
      id: normalizedItem.id,
      title: normalizedItem.title,
      name: normalizedItem.title, // UI uses `name` for series and `title` for movies
      original_name: normalizedItem.title,
      overview: normalizedItem.overview,
      poster_path: normalizedItem.poster,
      backdrop_path: normalizedItem.backdrop,
      release_date: normalizedItem.releaseDate,
      first_air_date: normalizedItem.releaseDate,
      genre_ids: normalizedItem.genres,
      genres: normalizedItem.genreObjects, // Ensure the frontend single-item view does not crash
      vote_average: normalizedItem.rating,
      media_type: normalizedItem.mediaType,
      original_language: normalizedItem.language,
      runtime: normalizedItem.runtime,
      number_of_seasons: normalizedItem.seasonCount,
      number_of_episodes: normalizedItem.episodeCount,
      status: normalizedItem.status,
      videos: normalizedItem.trailers,
      images: normalizedItem.images,
      credits: {
        cast: normalizedItem.cast,
        crew: normalizedItem.crew
      },
      similar: normalizedItem.similar ? { results: this.adaptListToUI(normalizedItem.similar) } : null
    };
  }

  static adaptListToUI(normalizedList) {
    if (!Array.isArray(normalizedList)) return [];
    return normalizedList.map(item => this.adaptToUI(item));
  }
}

module.exports = Normalizer;
