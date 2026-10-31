'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../lib/auth-client';
import toast from 'react-hot-toast';

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Fiction',
    image: '',
    totalCopies: 1,
    description: '',
  });

  // Protect private route on client
  useEffect(() => {
    document.title = 'BookNook | Add Book';
    if (!isPending && !session?.user) {
      toast.error('Please log in to add a book');
      router.push('/login?callbackUrl=/add-book');
    }
  }, [session, isPending, router]);

  // Handle Image Upload via ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey || apiKey === 'your_imgbb_api_key_here') {
      // If user hasn't provided ImgBB key yet, provide an aesthetic placeholder
      toast('Using direct image upload fallback');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
      return;
    }

    try {
      setUploadingImage(true);
      const imgData = new FormData();
      imgData.append('image', file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: imgData,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
        toast.success('Book cover image uploaded!');
      } else {
        toast.error('Image upload failed: ' + (data.error?.message || 'Unknown error'));
      }
    } catch {
      toast.error('Error connecting to image host');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      return toast.error('Please upload or provide a book cover image');
    }

    setLoading(true);
    try {
      // 1. Fetch JWT token
      const jwtRes = await fetch('/api/jwt');
      const jwtData = await jwtRes.json();
      const token = jwtData?.token;

      // 2. Post to Express backend
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
      const res = await fetch(`${serverUrl}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success('Book published to BookNook successfully!');
        router.push('/books');
      } else {
        toast.error(result.message || 'Failed to add book');
      }
    } catch {
      toast.error('Server connection error. Please make sure the Express server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-forest-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-200 shadow-sm">
        <div className="mb-6">
          <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase">
            CONTRIBUTE TO CATALOGUE
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest-950 mt-1">
            Add a New Book
          </h1>
          <p className="text-xs text-stone-500">
            Share a literary gem with fellow BookNook readers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Book Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. The Psychology of Money"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950 bg-cream-50/50"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Author Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Morgan Housel"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950 bg-cream-50/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950 bg-cream-50/50 cursor-pointer"
              >
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Kids">Kids</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Total Copies */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Total Copies Available *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.totalCopies}
                onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950 bg-cream-50/50"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Book Cover Image (Upload or Direct URL) *
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-forest-950 file:text-white hover:file:bg-forest-900 cursor-pointer"
              />
              <span className="text-stone-400 self-center text-[11px]">OR</span>
              <input
                type="url"
                placeholder="Paste direct image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 px-4 py-2 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950 bg-cream-50/50"
              />
            </div>
            {uploadingImage && <p className="text-[11px] text-amber-700 mt-1">Uploading cover image...</p>}
          </div>

          {/* Short Description */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Short Description *</label>
            <textarea
              rows="4"
              required
              placeholder="Write a concise overview of the book plot, key ideas, or intended audience..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950 bg-cream-50/50"
            />
          </div>

          {/* User Name & Email (Read-only as required) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-stone-500 mb-1">Added By (Name)</label>
              <input
                type="text"
                readOnly
                value={session?.user?.name || 'Logged In User'}
                className="w-full px-4 py-2 rounded-xl border border-cream-200 bg-cream-100 text-stone-500 cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-500 mb-1">User Email</label>
              <input
                type="email"
                readOnly
                value={session?.user?.email || 'user@booknook.dev'}
                className="w-full px-4 py-2 rounded-xl border border-cream-200 bg-cream-100 text-stone-500 cursor-not-allowed font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full bg-forest-950 hover:bg-forest-900 text-white font-semibold py-3 rounded-full text-xs transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
            >
              {loading ? 'Adding Book...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

