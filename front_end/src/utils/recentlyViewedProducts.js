const STORAGE_KEY = "recently_viewed_products";
const MAX_ITEMS = 12;

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveRecentlyViewed(product) {
  const current = getRecentlyViewed();

  const updated = [
    product,
    ...current.filter(p => p.id !== product.id)
  ].slice(0, MAX_ITEMS);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
