/*
  Demo data for the nav. In the real app this comes from the API.
  Text comes from the Figma "Language" variable collection (ქართული / English).
*/
import type { IconName } from '../icons/Icon';

export type Lang = 'ka' | 'en';

export const t = {
  ka: {
    myBusinesses: 'ჩემი ბიზნესები',
    navigation: 'ნავიგაცია',
    resources: 'რესურსები',
    otherBusinesses: 'სხვა ბიზნესები',
    personalAccount: 'პირადი ანგარიში',
    createBusiness: 'ბიზნესის შექმნა',
    search: 'ძიება',
    searchMintly: 'ძებნა Mintly-ზე…',
    cancel: 'გაუქმება',
    notifications: 'შეტყობინებები',
    yesterday: 'გუშინ',
    older: 'ძველი',
    markAllRead: 'ყველას წაკითხულად მონიშვნა',
    refresh: 'განახლება',
    settings: 'პარამეტრები',
    details: 'დეტალების ნახვა',
    messages: 'მიმოწერა',
    menu: 'მენიუ',
    ai: 'AI ასისტენტი (მალე)',
    filter: 'ფილტრი',
    viewAll: 'ყველას ნახვა',
    collapse: 'გვერდითი მენიუს შეკეცვა',
    expand: 'გვერდითი მენიუს გაშლა',
    noResults: 'ვერაფერი მოიძებნა',
    owner: 'მფლობელი',
  },
  en: {
    myBusinesses: 'My businesses',
    navigation: 'Navigation',
    resources: 'Resources',
    otherBusinesses: 'Other businesses',
    personalAccount: 'Personal account',
    createBusiness: 'Create business',
    search: 'Search',
    searchMintly: 'Search Mintly…',
    cancel: 'Cancel',
    notifications: 'Notifications',
    yesterday: 'Yesterday',
    older: 'Older',
    markAllRead: 'Mark all as read',
    refresh: 'Refresh',
    settings: 'Settings',
    details: 'View details',
    messages: 'Messages',
    menu: 'Menu',
    ai: 'AI assistant (soon)',
    filter: 'Filter',
    viewAll: 'View all',
    collapse: 'Collapse sidebar',
    expand: 'Expand sidebar',
    noResults: 'Nothing found',
    owner: 'Owner',
  },
} satisfies Record<Lang, Record<string, string>>;

export type NavItem = { id: string; icon: IconName; label: Record<Lang, string>; group: 'main' | 'resources' };

export const navItems: NavItem[] = [
  { id: 'home', icon: 'home', group: 'main', label: { ka: 'მთავარი', en: 'Home' } },
  { id: 'discover', icon: 'compass', group: 'main', label: { ka: 'აღმოჩენა', en: 'Discover' } },
  { id: 'market', icon: 'megaphone', group: 'main', label: { ka: 'პარტნიორული მარკეტი', en: 'Affiliate marketplace' } },
  { id: 'create', icon: 'plus', group: 'main', label: { ka: 'ბიზნესის შექმნა', en: 'Create business' } },
  { id: 'invite', icon: 'user-plus', group: 'main', label: { ka: 'მეგობრების მოწვევა', en: 'Invite friends' } },
  { id: 'blog', icon: 'book', group: 'resources', label: { ka: 'ბლოგი', en: 'Blog' } },
  { id: 'about', icon: 'info', group: 'resources', label: { ka: 'ჩვენ შესახებ', en: 'About us' } },
];

export type Business = { id: string; name: string; initials: string; role?: Record<Lang, string> };

/** Businesses the user owns or manages (Business selector). Test data only. */
export const myBusinesses: Business[] = [
  { id: 'ua', name: 'UX Audit Test', initials: 'UA', role: { ka: 'მფლობელი', en: 'Owner' } },
  { id: 'ut', name: 'UX Test Company', initials: 'UT', role: { ka: 'ადმინი', en: 'Admin' } },
];

/** Businesses the user is a member of (Other businesses). */
export const otherBusinesses: Business[] = [
  { id: 'tb', name: 'Test Business', initials: 'TB' },
  { id: 'tl', name: 'Tech Laws Georgia', initials: 'TL' },
  { id: 't', name: 'test', initials: 'T' },
  { id: 'ts', name: 'Tefno Business Space', initials: 'TS' },
  { id: 'sk', name: 'Studio Kadri', initials: 'SK' },
  { id: 'lg', name: 'Lingo.ge', initials: 'LG' },
];

export type Notification = { id: string; icon: IconName; unread: boolean; group: 'yesterday' | 'older'; title: Record<Lang, string>; time: string; body: Record<Lang, string> };

export const notifications: Notification[] = [
  { id: 'n1', icon: 'check-circle', unread: true, group: 'yesterday', time: '19/10/26', title: { ka: 'ნამუშევარი დამტკიცდა', en: 'Submission approved' }, body: { ka: '„AI ვიდეოები Tech Laws-ისთვის“ — ანაზღაურება დაიწყება ნახვების მიხედვით.', en: '“AI videos for Tech Laws” — payout starts based on views.' } },
  { id: 'n2', icon: 'wallet', unread: false, group: 'older', time: '15/10/26', title: { ka: 'თანხის გატანა დასრულდა', en: 'Withdrawal completed' }, body: { ka: '50.00 ₾ ჩაირიცხა თქვენს ბარათზე.', en: '50.00 ₾ was sent to your card.' } },
  { id: 'n3', icon: 'megaphone', unread: true, group: 'older', time: '12/10/26', title: { ka: 'ახალი კამპანია', en: 'New campaign' }, body: { ka: 'UX Test-მა გამოაქვეყნა კამპანია „UX Test Campaign“.', en: 'UX Test published the campaign “UX Test Campaign”.' } },
  { id: 'n4', icon: 'user-plus', unread: false, group: 'older', time: '09/10/26', title: { ka: 'ახალი წევრი', en: 'New member' }, body: { ka: 'keresa შემოუერთდა თქვენს სივრცეს „UX Audit Test“.', en: 'keresa joined your space “UX Audit Test”.' } },
];

export const user = { name: 'kakadube', initials: 'K', balance: '182.50 ₾' };
