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
    
    // Borrow Status
    alreadyTakenByYou: 'Already taken by you',
    alreadyTakenByYouBn: 'ইতোমধ্যে আপনি ধার নিয়েছেন',
    alreadyTakenBadge: 'ধার নেওয়া আছে',
    alreadyTakenDesc: 'আপনি ইতোমধ্যে এই বইটি ধার নিয়েছেন। ফেরত দেওয়ার পর পুনরায় ধার নেওয়া যাবে।',
    viewInMyBorrows: 'আমার ধার করা তালিকায় দেখুন',
    liveSearchSpeed: 'লাইভ স্পিড সার্চ',

    // Footer
    footerDesc: 'BookNook হলো বইপ্রেমীদের একটি প্রাণবন্ত উন্মুক্ত কমিউনিটি লাইব্রেরি। প্রিয় বইসমূহ আবিষ্কার করুন, সহজেই ধার নিন এবং আপনার বুকশেলফের বই যুক্ত করে ছড়িয়ে দিন জ্ঞানের আলো।',
    quickLinks: 'প্রয়োজনীয় লিংক',

    // 404 & Error Pages
    pageNotFound: 'পেজটি খুঁজে পাওয়া যায়নি',
    pageNotFoundDesc: 'আপনি যে বইয়ের তাক বা পেজটি খুঁজছেন তা সরানো হয়েছে বা লাইব্রেরি ক্যাটালগে নেই।',
    backToHome: 'হোমপেজে ফিরে যান',
    errorTitle: 'অনাকাঙ্ক্ষিত সমস্যা দেখা দিয়েছে',
    errorDesc: 'পেজটি লোড করার সময় সাময়িক সমস্যা হয়েছিল। অনুগ্রহ করে পুনরায় চেষ্টা করুন অথবা হোমপেজে ফিরে যান।',
    tryAgain: 'আবার চেষ্টা করুন',
    goToHome: 'হোমে যান',

    // Image & Cropper
    cropImageTitle: 'ছবি ক্রপ ও রিসাইজ করুন',
    cropImageDesc: 'ছবিটি ড্র্যাগ করে সঠিক অবস্থানে বসান',
    cropProfileTab: 'প্রোফাইল (১:১)',
    cropBookTab: 'বই কভার (৩:৪)',
    cropFreeTab: 'ফ্রি মোড',
    cropDragHint: 'মাউস বা আঙুল দিয়ে ড্র্যাগ করুন',
    cropZoom: 'জুম',
    cropRotate: 'ঘোরান (Rotate)',
    cropCancel: 'বাতিল',
    cropApply: 'ক্রপ প্রয়োগ করুন',
    selectAndCropPhoto: 'ছবি নির্বাচন ও ক্রপ করুন',
    imageSizeLimitError: 'ছবির সাইজ অবশ্যই ১ মেগাবাইট (1MB)-এর কম হতে হবে!',
    invalidImageFileError: 'অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন',
    coverImageUploaded: 'কভার ছবি আপলোড সফল হয়েছে!',
    coverImageReady: 'কভার ছবি প্রস্তুত!',
    coverImageSaved: 'কভার ছবি সংরক্ষিত হয়েছে',
    coverImageLabel: 'বইয়ের কভার ছবি (আপলোড বা লিঙ্ক)',
    orPasteDirectUrl: 'বা সরাসরি ইমেজ URL দিন',
    communityRules: 'কমিউনিটি নির্দেশিকা',
    contactSupport: 'যোগাযোগ ও সহায়তা',
    rightsReserved: 'সর্বস্বত্ব সংরক্ষিত।',
    createdBy: 'তৈরি করেছেন',
    selectLanguage: 'ভাষা নির্বাচন (Select Language):',
    
    // Login & Register
    welcomeBackBadge: 'স্বাগতম পাঠক',
    loginTitle: 'BookNook-এ প্রবেশ করুন',
    loginSub: 'আপনার ধার নেওয়া বই ও ব্যক্তিগত শেলফ পরিচালনা করুন।',
    emailLabel: 'ইমেইল ঠিকানা',
    passwordLabel: 'পাসওয়ার্ড',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    loginBtn: 'লগইন করুন',
    loggingIn: 'যাচাই করা হচ্ছে...',
    orContinueGoogle: 'Continue with Google (গুগল দিয়ে প্রবেশ করুন)',
    noAccount: 'এখনো কোনো অ্যাকাউন্ট নেই?',
    registerHere: 'নতুন অ্যাকাউন্ট খুলুন',
    joinCommunityBadge: 'কমিউনিটিতে যোগ দিন',
    registerTitle: 'নতুন অ্যাকাউন্ট খুলুন',
    registerSub: 'BookNook লাইব্রেরিতে যুক্ত হতে আপনার তথ্য দিন।',
    nameLabel: 'আপনার পূর্ণ নাম',
    photoUrlLabel: 'প্রোফাইল ছবির URL (ঐচ্ছিক)',
    registerBtn: 'রেজিস্টার করুন',
    registering: 'অ্যাকাউন্ট তৈরি হচ্ছে...',
    hasAccount: 'ইতোমধ্যে অ্যাকাউন্ট আছে?',
    loginHere: 'এখানে লগইন করুন',

    // Profile Page
    profileNav: 'প্রোফাইল',
    profileSettings: 'প্রোফাইল সেটিংস',
    profileTitle: 'প্রোফাইল তথ্য ও সেটিংস',
    profileSub: 'আপনার ব্যক্তিগত তথ্য ও প্রোফাইল ছবি আপডেট করুন।',
    personalInfo: 'ব্যক্তিগত তথ্য',
    profilePhoto: 'প্রোফাইল ছবি',
    uploadPhoto: 'নতুন ছবি আপলোড করুন',
    uploadingPhoto: 'ছবি আপলোড হচ্ছে...',
    photoUrlOption: 'অথবা ছবির ডিরেক্ট URL দিন',
    photoUrlPlaceholder: 'https://example.com/avatar.jpg',
    fullNameLabel: 'আপনার পূর্ণ নাম',
    fullNamePlaceholder: 'আপনার নাম লিখুন',
    emailAddressLabel: 'ইমেইল অ্যাড্রেস',
    emailReadOnlyBadge: 'অপরিবর্তনযোগ্য',
    saveProfileBtn: 'পরিবর্তন সংরক্ষণ করুন',
    savingProfile: 'সংরক্ষণ করা হচ্ছে...',
    profileUpdatedSuccess: 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!',
    profileUpdateFailed: 'প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে',
    statsContributedBooks: 'যুক্ত করা বই',
    statsActiveBorrows: 'ধার নেওয়া বই',
    memberSince: 'যোগদানের তারিখ',
    membershipBadge: 'সক্রিয় পাঠক',
    avatarUploadSuccess: 'ছবি সফলভাবে আপলোড হয়েছে!',
  },
  en: {
    // Nav
    home: 'Home',
    browseBooks: 'All Books',
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

    // Login & Register
    welcomeBackBadge: 'WELCOME BACK',
    loginTitle: 'Sign in to BookNook',
    loginSub: 'Manage your active loans and personal bookshelf.',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    forgotPassword: 'Forgot password?',
    loginBtn: 'Sign In',
    loggingIn: 'Signing in...',
    orContinueGoogle: 'Or continue with Google',
    noAccount: "Don't have an account?",
    registerHere: 'Create an account',
    joinCommunityBadge: 'JOIN BOOKNOOK COMMUNITY',
    registerTitle: 'Create an Account',
    registerSub: 'Enter your credentials to join BookNook Community Library.',
    nameLabel: 'Full Name',
    photoUrlLabel: 'Profile Photo URL (Optional)',
    registerBtn: 'Create Account',
    registering: 'Creating account...',
    hasAccount: 'Already have an account?',
    loginHere: 'Sign in here',

    // Profile Page
    profileNav: 'Profile',
    profileSettings: 'Profile Settings',
    profileTitle: 'Profile & Account Settings',
    profileSub: 'Manage your profile details and avatar representation.',
    personalInfo: 'Personal Information',
    profilePhoto: 'Profile Avatar',
    uploadPhoto: 'Upload New Photo',
    uploadingPhoto: 'Uploading photo...',
    photoUrlOption: 'Or provide direct image URL',
    photoUrlPlaceholder: 'https://example.com/avatar.jpg',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    emailAddressLabel: 'Email Address',
    emailReadOnlyBadge: 'Read-only',
    saveProfileBtn: 'Save Changes',
    savingProfile: 'Saving...',
    profileUpdatedSuccess: 'Profile updated successfully!',
    profileUpdateFailed: 'Failed to update profile',
    statsContributedBooks: 'Books Contributed',
    statsActiveBorrows: 'Active Borrows',
    memberSince: 'Member Since',
    membershipBadge: 'Active Reader',
    avatarUploadSuccess: 'Photo uploaded successfully!',

    // Borrow Status
    alreadyTakenByYou: 'Already taken by you',
    alreadyTakenByYouBn: 'Already taken by you',
    alreadyTakenBadge: 'Borrowed by you',
    alreadyTakenDesc: 'You have already borrowed this book. Please return it before borrowing again.',
    viewInMyBorrows: 'View in My Borrows',
    liveSearchSpeed: 'Live Speed Search',

    // 404 & Error Pages
    pageNotFound: 'Page Not Found',
    pageNotFoundDesc: 'The book shelf or page you are looking for has been moved, archived, or does not exist in our library index.',
    backToHome: 'Back to Home',
    errorTitle: 'Something Went Wrong',
    errorDesc: 'A temporary error occurred while rendering this page. Please try again or return to the homepage.',
    tryAgain: 'Try Again',
    goToHome: 'Go to Home',

    // Image & Cropper
    cropImageTitle: 'Crop & Adjust Image',
    cropImageDesc: 'Drag and reposition the image to frame it properly',
    cropProfileTab: 'Profile (1:1)',
    cropBookTab: 'Book Cover (3:4)',
    cropFreeTab: 'Free Mode',
    cropDragHint: 'Drag with cursor or finger to position',
    cropZoom: 'Zoom',
    cropRotate: 'Rotate',
    cropCancel: 'Cancel',
    cropApply: 'Apply Crop',
    selectAndCropPhoto: 'Select & Crop Photo',
    imageSizeLimitError: 'Image size must be strictly less than 1MB!',
    invalidImageFileError: 'Please select a valid image file',
    coverImageUploaded: 'Cover image uploaded successfully!',
    coverImageReady: 'Cover image is ready!',
    coverImageSaved: 'Cover image saved',
    coverImageLabel: 'Book Cover Image (Upload or URL)',
    orPasteDirectUrl: 'OR paste direct image URL',
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
