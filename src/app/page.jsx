import DiscoverHeader from '../components/DiscoverHeader';
import HomeBannerSlider from '../components/HomeBannerSlider';
import HomeSectionsClient from '../components/HomeSectionsClient';
import { getServerUrl } from '../lib/api';
import { FALLBACK_BOOKS } from '../lib/fallback-books';

async function getNewArrivals() {
  try {
    const serverUrl = getServerUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast response

    const res = await fetch(`${serverUrl}/books?limit=6&sort=newest`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json?.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // Fallback immediately if remote server is waking up
  }

  return FALLBACK_BOOKS;
}

export default async function HomePage() {
  const books = await getNewArrivals();

  return (
    <div className="w-full space-y-10 md:space-y-14">
      {/* 1. Discover Header with Multi-filters */}
      <DiscoverHeader />

      {/* 2. Motivational Quotes Swiper Banner Slider */}
      <HomeBannerSlider />

      {/* 3, 4, 5. Dynamic Client Sections with Live Multi-Language State */}
      <HomeSectionsClient books={books} />
    </div>
  );
}
