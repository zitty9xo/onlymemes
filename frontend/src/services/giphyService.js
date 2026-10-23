/**
 * giphyService.js
 * GIPHY REST API integration for searching and discovering trending GIFs.
 */

const DEFAULT_GIPHY_KEY = import.meta.env.VITE_GIPHY_API_KEY || '';
const GIPHY_BASE_URL = 'https://api.giphy.com/v1/gifs';

// Fallback curated meme GIFs for offline/rate-limited environments
const FALLBACK_GIFS = [
  {
    id: 'fallback_1',
    title: 'Mind Blown Reaction',
    url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/200w.gif',
    width: 480,
    height: 270
  },
  {
    id: 'fallback_2',
    title: 'Cat Typing Coding Fast',
    url: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/200w.gif',
    width: 400,
    height: 300
  },
  {
    id: 'fallback_3',
    title: 'Leonardo DiCaprio Toast',
    url: 'https://media.giphy.com/media/GCLlQnV7dXY2KGmpRh/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/GCLlQnV7dXY2KGmpRh/200w.gif',
    width: 480,
    height: 270
  },
  {
    id: 'fallback_4',
    title: 'Confused Travolta',
    url: 'https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/200w.gif',
    width: 480,
    height: 270
  },
  {
    id: 'fallback_5',
    title: 'This Is Fine Dog Fire',
    url: 'https://media.giphy.com/media/QMHoU66sBXqqLqYvGO/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/QMHoU66sBXqqLqYvGO/200w.gif',
    width: 480,
    height: 270
  },
  {
    id: 'fallback_6',
    title: 'Doge Wow Such Meme',
    url: 'https://media.giphy.com/media/oBQZIgNobc7ew/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/oBQZIgNobc7ew/200w.gif',
    width: 500,
    height: 375
  }
];

function transformGiphyItem(item) {
  const images = item.images || {};
  return {
    id: item.id,
    title: item.title || 'Untitled Meme GIF',
    url: images.original?.url || images.downsized_medium?.url || item.url,
    previewUrl: images.fixed_width?.url || images.fixed_height_small?.url || images.original?.url,
    width: parseInt(images.original?.width || 480, 10),
    height: parseInt(images.original?.height || 270, 10)
  };
}

/**
 * Fetches currently trending GIFs from GIPHY.
 * 
 * @param {number} limit 
 * @returns {Promise<Array<{ id: string, title: string, url: string, previewUrl: string }>>}
 */
export async function getTrendingGifs(limit = 24) {
  try {
    const endpoint = `${GIPHY_BASE_URL}/trending?api_key=${DEFAULT_GIPHY_KEY}&limit=${limit}&rating=g`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`GIPHY HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data.data) && data.data.length > 0) {
      return data.data.map(transformGiphyItem);
    }
    return FALLBACK_GIFS;
  } catch (err) {
    console.warn('GIPHY Trending notice (using fallback GIFs):', err.message);
    return FALLBACK_GIFS;
  }
}

/**
 * Searches GIPHY for GIFs matching a search query.
 * 
 * @param {string} query 
 * @param {number} limit 
 * @returns {Promise<Array<{ id: string, title: string, url: string, previewUrl: string }>>}
 */
export async function searchGifs(query, limit = 24) {
  if (!query || !query.trim()) {
    return getTrendingGifs(limit);
  }

  try {
    const endpoint = `${GIPHY_BASE_URL}/search?api_key=${DEFAULT_GIPHY_KEY}&q=${encodeURIComponent(query)}&limit=${limit}&rating=g`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`GIPHY HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data.data) && data.data.length > 0) {
      return data.data.map(transformGiphyItem);
    }
    return FALLBACK_GIFS.filter(g => g.title.toLowerCase().includes(query.toLowerCase()));
  } catch (err) {
    console.warn('GIPHY Search notice (using fallback GIFs):', err.message);
    return FALLBACK_GIFS.filter(g => g.title.toLowerCase().includes(query.toLowerCase()));
  }
}
