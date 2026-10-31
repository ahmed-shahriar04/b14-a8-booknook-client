import Link from 'next/link';
import DiscoverHeader from '../components/DiscoverHeader';
import HomeBannerSlider from '../components/HomeBannerSlider';
import BookCard from '../components/BookCard';
import HomeSectionsClient from '../components/HomeSectionsClient';
import { getServerUrl } from '../lib/api';

async function getNewArrivals() {
  try {
    const serverUrl = getServerUrl();
    const res = await fetch(`${serverUrl}/books?limit=6&sort=newest`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch (error) {
    return [];
  }
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
