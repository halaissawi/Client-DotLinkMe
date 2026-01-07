import {
  Globe,
  Linkedin,
  Instagram,
  Github,
  MessageCircle,
  Mail,
  Phone,
  X,
  Facebook,
} from "lucide-react";

export const SOCIAL_PLATFORMS = [
  {
    key: "website",
    label: "Website",
    placeholder: "https://yoursite.com",
    icon: Globe,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholder: "Your LinkedIn Username/link",
    icon: Linkedin,
  },
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "Your Instagram Username/link",
    icon: Instagram,
  },
  {
    key: "facebook", // ✅ ADD THIS ENTIRE OBJECT
    label: "Facebook",
    placeholder: "Your Facebook Username/link",
    icon: Facebook,
  },
  {
    key: "x",
    label: "X",
    icon: X,
    placeholder: "Your X username or profile URL",
  },
  {
    key: "github",
    label: "GitHub",
    placeholder: "Your GitHub Username/link",
    icon: Github,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    placeholder: "Your WhatsApp Number",
    icon: MessageCircle,
  },
  {
    key: "email",
    label: "Email",
    placeholder: "hello@example.com",
    icon: Mail,
  },
  {
    key: "phone",
    label: "Phone",
    placeholder: "+962 7X XXX XXXX",
    icon: Phone,
  },
];

export const countryCodes = [
  {
    name: "Jordan",
    code: "+962",
    shortcut: "JO",
    flag: "🇯🇴", // Simple emoji flag instead of ReactCountryFlag component
  },
  {
    name: "Saudi Arabia",
    code: "+966",
    shortcut: "SA",
    flag: "🇸🇦",
  },
  {
    name: "UAE",
    code: "+971",
    shortcut: "AE",
    flag: "🇦🇪",
  },
  {
    name: "Qatar",
    code: "+974",
    shortcut: "QA",
    flag: "🇶🇦",
  },
  {
    name: "Kuwait",
    code: "+965",
    shortcut: "KW",
    flag: "🇰🇼",
  },
  {
    name: "USA",
    code: "+1",
    shortcut: "US",
    flag: "🇺🇸",
  },
  {
    name: "UK",
    code: "+44",
    shortcut: "GB",
    flag: "🇬🇧",
  },
  {
    name: "Australia",
    code: "+61",
    shortcut: "AU",
    flag: "🇦🇺",
  },
  {
    name: "Germany",
    code: "+49",
    shortcut: "DE",
    flag: "🇩🇪",
  },
  {
    name: "France",
    code: "+33",
    shortcut: "FR",
    flag: "🇫🇷",
  },
  {
    name: "Italy",
    code: "+39",
    shortcut: "IT",
    flag: "🇮🇹",
  },
  {
    name: "Spain",
    code: "+34",
    shortcut: "ES",
    flag: "🇪🇸",
  },
];
