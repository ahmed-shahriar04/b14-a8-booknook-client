'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext({
  lang: 'bn', // 'bn' | 'en'
  setLang: () => {},
  t: (key) => key,
});

export const translations = {
  bn: {
    // Nav
    home: 'হোম',
    browseBooks: 'বইসমগ্র',
    myDashboard: 'আমার ড্যাশবোর্ড',
    addBook: 'বই যোগ করুন',
    myBooks: 'আমার বইসমূহ',
    myBorrows: 'ধার নেওয়া বই',
    login: 'লগইন',
    register: 'রেজিস্টার',
    logout: 'লগআউট',
    notifications: 'নোটিফিকেশন',
    toggleTheme: 'থিম পরিবর্তন',
    librarySub: 'উন্মুক্ত লাইব্রেরি',
    
    // Discover Header
    discoverBadge: 'বইপ্রেমীদের উন্মুক্ত প্ল্যাটফর্ম',
    discoverTitle: 'Discover & Share Knowledge',
    discoverDesc: 'BookNook হলো বইপ্রেমীদের একটি প্রাণবন্ত উন্মুক্ত কমিউনিটি লাইব্রেরি। প্রিয় বইসমূহ আবিষ্কার করুন, সহজেই ধার নিন এবং আপনার বুকশেলফের বই যুক্ত করে ছড়িয়ে দিন জ্ঞানের আলো।',
    filterBtn: 'ফিল্টার প্যানেল',
    searchPlaceholder: 'বইয়ের নাম, লেখক বা বিষয় দিয়ে খুঁজুন...',
    searchBtn: 'অনুসন্ধান',
    
    // Filters Modal
    filterTitle: 'উন্নত ফিল্টার প্যানেল',
    categoryLabel: 'বইয়ের ক্যাটাগরি',
    authorLabel: 'লেখক অনুযায়ী ফিল্টার',
    eraLabel: 'প্রকাশকাল / সময়কাল',
    resetBtn: 'রিসেট',
    applyBtn: 'ফিল্টার প্রয়োগ করুন',
    allCategories: 'সব ক্যাটাগরি',
    allAuthors: 'সকল লেখক',
    allEras: 'সকল প্রকাশকাল',
    
    // Banner Quotes
    bannerBrowseBtn: 'বইসমূহ ব্রাউজ করুন',
    quote1Tag: 'প্রেরণাদায়ী বাণী • INSPIRATION',
    quote1Text: '“বই হচ্ছে এমন এক মাধ্যম যা কোনো সীমানা মানে না, আত্মার গভীরতম স্থানকে জাগিয়ে তোলে।”',
    quote1Author: 'রবীন্দ্রনাথ ঠাকুর',
    quote1Title: 'নোবেলজয়ী বিশ্বকবি ও সাহিত্যিক',
    
    quote2Tag: 'সাহিত্য দর্শন • LITERARY WISDOM',
    quote2Text: '“বই পড়া মানুষের মনের তৃষ্ণা মেটায়, চিন্তাশক্তিকে প্রসারিত করে এবং একজন মানুষকে প্রকৃত মানুষ হিসেবে গড়ে তোলে।”',
    quote2Author: 'কাজী নজরুল ইসলাম',
    quote2Title: 'বিদ্রোহী কবি ও জাতীয় কবি',
    
    quote3Tag: 'জ্ঞানের আলো • PHILOSOPHY OF READING',
    quote3Text: '“লাইব্রেরি হলো এমন একটি মন্দির, যেখানে সকল যুগের জ্ঞানী ব্যক্তিদের চিন্তা সংরক্ষিত থাকে মানুষের কল্যাণে।”',
    quote3Author: 'হুমায়ূন আহমেদ',
    quote3Title: 'জনপ্রিয় কথাসাহিত্যিক ও চলচ্চিত্রকার',

    // Home Sections
    newArrivalsBadge: 'নতুন বইয়ের সম্ভার',
    recommendations: 'Book Recommendation (সদ্য যুক্ত বইসমূহ)',
    recommendationsSub: 'বইপ্রেমীদের একটি প্রাণবন্ত উন্মুক্ত কমিউনিটি লাইব্রেরি — পড়তে শুরু করুন এখনই',
    viewAll: 'সব বই দেখুন',
    seeAllBooks: 'সব বইয়ের তালিকা দেখুন',
    noBooksTitle: 'লাইব্রেরিতে বর্তমানে কোনো বই যুক্ত নেই',
    noBooksDesc: 'আপনার বুকশেলফের বই যুক্ত করে ছড়িয়ে দিন জ্ঞানের আলো।',
    addFirstBook: 'প্রথম বইটি যোগ করুন',
    popularCategories: 'জনপ্রিয় ক্যাটাগরি সমূহ',
    browseByNiche: 'বিষয়ভিত্তিক বই',
    
    // 3 Step Guide
    threeStepBadge: 'সহজ ৩ ধাপের প্রক্রিয়া',
    howBorrowWorks: 'কীভাবে BookNook থেকে বই ধার নেবেন?',
    howBorrowDesc: 'প্রিয় বইসমূহ আবিষ্কার করুন, সহজেই ধার নিন এবং আপনার বুকশেলফের বই যুক্ত করে ছড়িয়ে দিন জ্ঞানের আলো।',
    step1Title: '১. বই নির্বাচন',
    step1Desc: 'পছন্দের বইটি খুঁজুন এবং পর্যাপ্ত কপি আছে কিনা দেখে নিন।',
    step2Title: '২. সহজে ধার নিন',
    step2Desc: 'ডিটেইলস পেজে বা কার্ডে ‘Borrow’ বাটনে চাপুন। সিস্টেম কপি রিজার্ভ করে নেবে।',
    step3Title: '৩. পড়ুন ও ফেরত দিন',
    step3Desc: 'পড়া শেষ হলে ‘Return’ বাটনে চেপে কপি ফেরত দিন যাতে অন্যরাও পড়ার সুযোগ পায়।',
    
    // Book Card & Details Modal
    viewDetails: 'বিস্তারিত',
    borrowThisBook: 'বইটি ধার নিন',
    outOfStock: 'কপি নেই',
    copiesCount: 'কপি',
    authorBy: 'লেখক',
    category: 'ক্যাটাগরি',
    availableStock: 'মজুদ কপি সংখ্যা',
    aboutBook: 'বইটি সম্পর্কে সংক্ষিপ্ত বিবরণ',
    addedBy: 'যুক্ত করেছেন',
    confirmBorrowTitle: 'ধার নেওয়ার তথ্য নিশ্চিত করুন',
    returnDueDate: 'ফেরত দেওয়ার সময়সীমা',
    confirmBtn: 'ধার নিশ্চিত করুন',
    cancelBtn: 'বাতিল',
    borrowSuccess: 'বইটি সফলভাবে ধার নেওয়া হয়েছে!',
    alreadyBorrowed: 'আপনি ইতোমধ্যে এই বইটি ধার নিয়েছেন। ফেরত দেওয়ার পর পুনরায় ধার নিতে পারবেন।',
    closeBtn: 'বন্ধ করুন',
    
    // Dashboard & Sidebar
    userDashboard: 'ইউজার ড্যাশবোর্ড',
    backToPublicLibrary: 'মূল লাইব্রেরিতে ফিরুন',
    personalReaderDashboard: 'ব্যক্তিগত রিডার ড্যাশবোর্ড',
    
    // My Books Page
    myBooksTitle: 'আমার যুক্ত করা বইসমূহ',
    myBooksSub: 'আপনার শেলফ থেকে লাইব্রেরিতে যুক্ত করা সকল বই এখান থেকে সম্পাদন ও পরিচালনা করুন।',
    addNewBookBtn: 'নতুন বই যোগ করুন',
    bookAndAuthorCol: 'বই ও লেখক',
    copiesRemainingCol: 'অবশিষ্ট কপি',
    dateAddedCol: 'যুক্ত করার তারিখ',
    actionCol: 'অ্যাকশন',
    editBtn: 'এডিট',
    deleteBtn: 'ডিলিট',
    noBooksAddedYet: 'আপনি এখনো কোনো বই যোগ করেননি',
    noBooksAddedSub: 'আপনার শেলফের প্রিয় বইসমূহ BookNook লাইব্রেরিতে অন্তর্ভুক্ত করুন এবং পাঠকদের সাথে জ্ঞানের আলো ছড়িয়ে দিন।',
    addFirstBookAction: 'প্রথম বইটি যোগ করুন',
    editBookTitleModal: 'বইয়ের তথ্য সম্পাদন করুন',
    editBookDescModal: 'বইটির তথ্য পরিবর্তন করে সংরক্ষণ করুন।',
    bookTitleField: 'বইয়ের নাম',
    authorField: 'লেখক',
    categoryField: 'ক্যাটাগরি',
    totalCopiesField: 'মোট কপি',
    coverImgField: 'কভার ছবির URL',
    shortDescField: 'সংক্ষিপ্ত বিবরণ',
    saveChangesBtn: 'পরিবর্তন সংরক্ষণ',
    deleteConfirmModalTitle: 'বইটি কি মুছে ফেলতে চান?',
    deleteConfirmModalSub: 'আপনি নিশ্চিত যে এই বইটি লাইব্রেরি ক্যাটালগ থেকে সম্পূর্ণ অপসারণ করবেন?',
    yesDeleteBtn: 'হ্যাঁ, ডিলিট করুন',
    
    // My Borrows Page
    readingTrackerBadge: 'রিডিং ট্র্যাকার • ACTIVE BOOK LOANS',
    myBorrowsTitle: 'আমার ধার নেওয়া বইসমূহ',
    myBorrowsSub: 'লাইব্রেরি থেকে আপনি যে বইগুলো ধার নিয়েছেন সেগুলোর তালিকা ও ফেরত দেওয়ার সময়সীমা।',
    findMoreBooksBtn: 'আরও বই খুঁজুন',
    borrowDateCol: 'ধার নেওয়ার তারিখ',
    returnDueDateCol: 'ফেরত দেওয়ার তারিখ',
    returnBookActionBtn: 'বই ফেরত দিন',
    returningBookStatus: 'ফেরত হচ্ছে...',
    noBorrowedBooksTitle: 'বর্তমানে আপনার কোনো বই ধার নেওয়া নেই',
    noBorrowedBooksSub: 'লাইব্রেরি থেকে যে কোনো বই মাত্র এক ক্লিকে ১৪ দিনের জন্য ফ্রিতে ধার নিন এবং পড়ার আনন্দ উপভোগ করুন।',
    exploreLibraryBtn: 'বইসমগ্র ঘুরে দেখুন',
    
    // Footer
    footerDesc: 'BookNook হলো বইপ্রেমীদের একটি প্রাণবন্ত উন্মুক্ত কমিউনিটি লাইব্রেরি। প্রিয় বইসমূহ আবিষ্কার করুন, সহজেই ধার নিন এবং আপনার বুকশেলফের বই যুক্ত করে ছড়িয়ে দিন জ্ঞানের আলো।',
    quickLinks: 'প্রয়োজনীয় লিংক',
    communityRules: 'কমিউনিটি নির্দেশিকা',
    contactSupport: 'যোগাযোগ ও সহায়তা',
    rightsReserved: 'সর্বস্বত্ব সংরক্ষিত।',
    createdBy: 'তৈরি করেছেন',
    selectLanguage: 'ভাষা নির্বাচন (Select Language):',
  },
  en: {
    // Nav
    home: 'Home',
    browseBooks: 'Browse Books',
    myDashboard: 'My Dashboard',
    addBook: 'Add Book',
    myBooks: 'My Books',
    myBorrows: 'My Borrows',
    login: 'Login',
    register: 'Register',
    logout: 'Log Out',
    notifications: 'Notifications',
    toggleTheme: 'Toggle Theme',
    librarySub: 'Open Library',
    
    // Discover Header
    discoverBadge: 'COMMUNITY READING PLATFORM',
    discoverTitle: 'Discover & Share Knowledge',
    discoverDesc: 'BookNook is a vibrant, cozy community library for book lovers. Explore handpicked titles, borrow seamlessly, and share books from your personal bookshelf to spread the light of wisdom.',
    filterBtn: 'Filter Panel',
    searchPlaceholder: 'Search books by title, author, or keyword...',
    searchBtn: 'Search',
    
    // Filters Modal
    filterTitle: 'Advanced Filter Panel',
    categoryLabel: 'Book Category',
    authorLabel: 'Filter by Author',
    eraLabel: 'Publication Era',
    resetBtn: 'Reset',
    applyBtn: 'Apply Filters',
    allCategories: 'All Categories',
    allAuthors: 'All Authors',
    allEras: 'All Eras',
    
    // Banner Quotes
    bannerBrowseBtn: 'Browse Library Books',
    quote1Tag: 'INSPIRING WISDOM',
    quote1Text: '“Clouds come floating into my life, no longer to carry rain or usher storm, but to add color to my sunset sky.”',
    quote1Author: 'Rabindranath Tagore',
    quote1Title: 'Nobel Laureate Poet & Philosopher',
    
    quote2Tag: 'LITERARY PASSION',
    quote2Text: '“A reader lives a thousand lives before he dies. The man who never reads lives only one.”',
    quote2Author: 'Kazi Nazrul Islam',
    quote2Title: 'National Rebel Poet of Bangladesh',
    
    quote3Tag: 'BEACON OF KNOWLEDGE',
    quote3Text: '“There is no friend as loyal as a book. In books, we discover the collective wisdom of all humanity.”',
    quote3Author: 'Humayun Ahmed',
    quote3Title: 'Legendary Novelist & Storyteller',

    // Home Sections
    newArrivalsBadge: 'NEW ARRIVALS 2026',
    recommendations: 'Book Recommendations',
    recommendationsSub: 'A cozy community reading haven — start reading your favorite book today',
    viewAll: 'View All',
    seeAllBooks: 'See All Books',
    noBooksTitle: 'No books catalogued in the library yet',
    noBooksDesc: 'Share a gem from your bookshelf to begin inspiring fellow bibliophiles.',
    addFirstBook: 'Add Your First Book',
    popularCategories: 'Popular Categories',
    browseByNiche: 'Browse by Collection',
    
    // 3 Step Guide
    threeStepBadge: 'SIMPLE 3-STEP SYSTEM',
    howBorrowWorks: 'How Borrowing Works at BookNook',
    howBorrowDesc: 'Explore compelling titles, borrow frictionless in a second, and return when finished.',
    step1Title: '1. Pick Your Book',
    step1Desc: 'Find your desired book and check live remaining stock availability.',
    step2Title: '2. Instant Borrow',
    step2Desc: 'Hit the borrow button to instantly reserve your copy for 14 days.',
    step3Title: '3. Read & Return',
    step3Desc: 'When done, hit return in your dashboard to replenish copies for others.',
    
    // Book Card & Details Modal
    viewDetails: 'Details',
    borrowThisBook: 'Borrow Book',
    outOfStock: 'Out of Stock',
    copiesCount: 'Copies',
    authorBy: 'Author',
    category: 'Category',
    availableStock: 'Available Copies',
    aboutBook: 'About This Book',
    addedBy: 'Contributed by',
    confirmBorrowTitle: 'Confirm Book Loan',
    returnDueDate: 'Return Due Date',
    confirmBtn: 'Confirm Borrow',
    cancelBtn: 'Cancel',
    borrowSuccess: 'Book borrowed successfully! Enjoy reading.',
    alreadyBorrowed: 'You have already borrowed this book. Please return it before borrowing again.',
    closeBtn: 'Close',
    
    // Dashboard & Sidebar
    userDashboard: 'USER DASHBOARD',
    backToPublicLibrary: 'Back to Main Library',
    personalReaderDashboard: 'Personal Reader Desk',
    
    // My Books Page
    myBooksTitle: 'My Added Books',
    myBooksSub: 'Manage, edit, or remove books you have contributed to the BookNook community library.',
    addNewBookBtn: 'Add New Book',
    bookAndAuthorCol: 'Book & Author',
    copiesRemainingCol: 'Available Copies',
    dateAddedCol: 'Date Added',
    actionCol: 'Actions',
    editBtn: 'Edit',
    deleteBtn: 'Delete',
    noBooksAddedYet: 'You haven\'t added any books yet',
    noBooksAddedSub: 'Catalogue books from your bookshelf to build the library and share the joy of reading.',
    addFirstBookAction: 'Contribute First Book',
    editBookTitleModal: 'Edit Book Information',
    editBookDescModal: 'Update details and save changes for this title.',
    bookTitleField: 'Book Title',
    authorField: 'Author Name',
    categoryField: 'Category',
    totalCopiesField: 'Total Copies',
    coverImgField: 'Cover Image URL',
    shortDescField: 'Short Description',
    saveChangesBtn: 'Save Changes',
    deleteConfirmModalTitle: 'Delete This Book?',
    deleteConfirmModalSub: 'Are you sure you want to permanently remove this book from the library catalog?',
    yesDeleteBtn: 'Yes, Delete',
    
    // My Borrows Page
    readingTrackerBadge: 'READING PROGRESS • ACTIVE LOANS',
    myBorrowsTitle: 'My Borrowed Books',
    myBorrowsSub: 'Active book loans you have checked out from the library and their scheduled return dates.',
    findMoreBooksBtn: 'Browse More Books',
    borrowDateCol: 'Borrow Date',
    returnDueDateCol: 'Return Due Date',
    returnBookActionBtn: 'Return Book',
    returningBookStatus: 'Returning...',
    noBorrowedBooksTitle: 'No active borrowed books',
    noBorrowedBooksSub: 'You currently have no active book loans. Ready to read something new?',
    exploreLibraryBtn: 'Explore Catalogue',
    
    // Footer
    footerDesc: 'BookNook is a vibrant open community library for readers and thinkers. Explore titles, borrow seamlessly, and contribute books from your shelf to inspire others.',
    quickLinks: 'Navigation',
    communityRules: 'Community Rules',
    contactSupport: 'Contact & Support',
    rightsReserved: 'All rights reserved.',
    createdBy: 'Created by',
    selectLanguage: 'Select Language:',
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('bn');

  useEffect(() => {
    const saved = localStorage.getItem('booknook-lang') || 'bn';
    setLangState(saved);
  }, []);

  const setLang = (nextLang) => {
    setLangState(nextLang);
    localStorage.setItem('booknook-lang', nextLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['bn']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
