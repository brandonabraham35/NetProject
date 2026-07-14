const Normalizer = require('../src/modules/content/utils/Normalizer');

describe('Normalizer', () => {
  it('should normalize a TMDB movie item correctly', () => {
    const raw = {
      id: 123,
      title: 'Test Movie',
      overview: 'Test Overview',
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2023-01-01',
      genre_ids: [1, 2],
      vote_average: 8.5,
    };

    const normalized = Normalizer.normalizeItem(raw, 'tmdb');

    expect(normalized.id).toBe('123');
    expect(normalized.title).toBe('Test Movie');
    expect(normalized.overview).toBe('Test Overview');
    expect(normalized.poster).toBe('/poster.jpg');
    expect(normalized.mediaType).toBe('movie');
    expect(normalized.provider).toBe('tmdb');
  });

  it('should adapt normalized item back to UI format', () => {
    const normalized = {
      id: '123',
      title: 'Test Movie',
      overview: 'Test Overview',
      poster: '/poster.jpg',
      releaseDate: '2023-01-01',
      mediaType: 'movie'
    };

    const uiItem = Normalizer.adaptToUI(normalized);
    expect(uiItem.id).toBe('123');
    expect(uiItem.name).toBe('Test Movie');
    expect(uiItem.poster_path).toBe('/poster.jpg');
    expect(uiItem.release_date).toBe('2023-01-01');
  });
});
