import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "motion/react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Pencil,
  Trash2,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";

export const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cream: "#FFF8EE",
  lightPurple: "#F1ECFF",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

export const defaultContactContent = {
  badgeText: "Get In Touch",
  title: "We'd Love to Hear From You",
  highlightedText: "Hear From You",
  subtitle:
    "Questions about admissions, curriculum, or school life? Our team is here to help.",
  contactInfo: [
    {
      id: "address",
      icon: "map",
      label: "Address",
      value: "Basudev Marga, Hetauda Sub-Metropolitan City, Ward No. 2",
      color: "#D71920",
    },
    {
      id: "phone",
      icon: "phone",
      label: "Phone",
      value: "057-590144, 057-590145, 057-590146",
      color: "#168A3A",
    },
    {
      id: "email",
      icon: "mail",
      label: "Email",
      value: "infobjess2046@gmail.com",
      color: "#4B2E83",
    },
    {
      id: "school",
      icon: "clock",
      label: "School",
      value: "Baljagriti Secondary English Boarding School",
      color: "#7C5CC4",
    },
  ],
  mapCard: {
    title: "Baljagriti Secondary English Boarding School",
    address: "Basudev Marga, Hetauda-2, Makawanpur, Nepal",
    buttonText: "Open in Maps",
    mapUrl:
      "https://www.google.com/maps/place/Bal+Jagriti+Boarding+School/@27.4312792,85.0379093,19z/data=!4m6!3m5!1s0x39eb4991159e4289:0x8707a51c9add8d8e!8m2!3d27.4312792!4d85.0379093!16s%2Fg%2F11bw3f8rbl",
  },
  form: {
    title: "Send a Message",
    nameLabel: "Your Name",
    namePlaceholder: "Your full name",
    emailLabel: "Email Address",
    emailPlaceholder: "your@email.com",
    phoneLabel: "Phone Number",
    phonePlaceholder: "98XXXXXXXX or +97798XXXXXXXX",
    subjectLabel: "Subject",
    subjectPlaceholder: "Admissions inquiry",
    messageLabel: "Message",
    messagePlaceholder: "Tell us how we can help you...",
    buttonText: "Send Message",
    sendingText: "Sending...",
    successMessage: "Message sent successfully!",
    errorMessage: "Message could not be sent. Please try again.",
  },
};

export function mergeContactContent(saved = {}) {
  return {
    ...defaultContactContent,
    ...saved,
    contactInfo:
      Array.isArray(saved.contactInfo) && saved.contactInfo.length
        ? saved.contactInfo.map((item, index) => ({
            id: item.id || `contact-${index}-${Date.now()}`,
            icon: item.icon || "map",
            label: item.label || "Contact",
            value: item.value || "",
            color: item.color || colors.purple,
          }))
        : defaultContactContent.contactInfo,
    mapCard: {
      ...defaultContactContent.mapCard,
      ...(saved.mapCard || {}),
    },
    form: {
      ...defaultContactContent.form,
      ...(saved.form || {}),
    },
  };
}

export function normalizeExternalUrl(url = "") {
  const cleanUrl = String(url || "").trim();

  if (!cleanUrl) return "#";

  if (/^(https?:|mailto:|tel:|sms:)/i.test(cleanUrl)) {
    return cleanUrl;
  }

  if (cleanUrl.startsWith("//")) {
    return `https:${cleanUrl}`;
  }

  if (/^[\w.-]+\.[a-z]{2,}([/:?#].*)?$/i.test(cleanUrl)) {
    return `https://${cleanUrl}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    cleanUrl
  )}`;
}

function getContactIcon(icon) {
  if (icon === "phone") return Phone;
  if (icon === "mail") return Mail;
  if (icon === "clock") return Clock;
  return MapPin;
}

function normalizePhone(phone = "") {
  return String(phone).replace(/[^\d+]/g, "").trim();
}

function isValidPhone(phone = "") {
  const cleaned = normalizePhone(phone);
  const digitsOnly = cleaned.replace(/\D/g, "");

  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

function HighlightedTitle({ title, highlightedText }) {
  if (!highlightedText || !title.includes(highlightedText)) {
    return <>{title}</>;
  }

  const [before, after] = title.split(highlightedText);

  return (
    <>
      {before}
      <span className="relative inline-block italic" style={{ color: colors.purple }}>
        {highlightedText}
        <span
          className="absolute left-0 right-0 -bottom-1 h-2 rounded-full -z-10"
          style={{ background: "rgba(250,204,21,0.58)" }}
        />
      </span>
      {after}
    </>
  );
}

function ErrorText({ children }) {
  if (!children) return null;

  return (
    <p className="text-xs font-semibold mt-2" style={{ color: colors.red }}>
      {children}
    </p>
  );
}

function AdminActionButton({ label, icon: Icon, onClick, tone = "purple" }) {
  const toneStyles = {
    purple: {
      background: "linear-gradient(135deg, #4B2E83, #7C5CC4)",
      color: "#FFFFFF",
    },
    green: {
      background: "linear-gradient(135deg, #168A3A, #22C55E)",
      color: "#FFFFFF",
    },
    red: {
      background: "linear-gradient(135deg, #D71920, #9B1117)",
      color: "#FFFFFF",
    },
    gold: {
      background: "linear-gradient(135deg, #FACC15, #38BDF8)",
      color: "#020617",
    },
  };

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick?.();
      }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black shadow-xl transition-all hover:-translate-y-0.5 hover:scale-105"
      style={toneStyles[tone] || toneStyles.purple}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

// Complete country codes data - all countries
const countryCodes = [
  { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
  { code: "+355", country: "Albania", flag: "🇦🇱" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+376", country: "Andorra", flag: "🇦🇩" },
  { code: "+244", country: "Angola", flag: "🇦🇴" },
  { code: "+1264", country: "Anguilla", flag: "🇦🇮" },
  { code: "+1268", country: "Antigua and Barbuda", flag: "🇦🇬" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+374", country: "Armenia", flag: "🇦🇲" },
  { code: "+297", country: "Aruba", flag: "🇦🇼" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
  { code: "+1242", country: "Bahamas", flag: "🇧🇸" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+1246", country: "Barbados", flag: "🇧🇧" },
  { code: "+375", country: "Belarus", flag: "🇧🇾" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+501", country: "Belize", flag: "🇧🇿" },
  { code: "+229", country: "Benin", flag: "🇧🇯" },
  { code: "+1441", country: "Bermuda", flag: "🇧🇲" },
  { code: "+975", country: "Bhutan", flag: "🇧🇹" },
  { code: "+591", country: "Bolivia", flag: "🇧🇴" },
  { code: "+387", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "+267", country: "Botswana", flag: "🇧🇼" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+673", country: "Brunei", flag: "🇧🇳" },
  { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
  { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
  { code: "+257", country: "Burundi", flag: "🇧🇮" },
  { code: "+855", country: "Cambodia", flag: "🇰🇭" },
  { code: "+237", country: "Cameroon", flag: "🇨🇲" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+238", country: "Cape Verde", flag: "🇨🇻" },
  { code: "+1345", country: "Cayman Islands", flag: "🇰🇾" },
  { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
  { code: "+235", country: "Chad", flag: "🇹🇩" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+269", country: "Comoros", flag: "🇰🇲" },
  { code: "+242", country: "Congo", flag: "🇨🇬" },
  { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
  { code: "+385", country: "Croatia", flag: "🇭🇷" },
  { code: "+53", country: "Cuba", flag: "🇨🇺" },
  { code: "+357", country: "Cyprus", flag: "🇨🇾" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+253", country: "Djibouti", flag: "🇩🇯" },
  { code: "+1767", country: "Dominica", flag: "🇩🇲" },
  { code: "+1849", country: "Dominican Republic", flag: "🇩🇴" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+503", country: "El Salvador", flag: "🇸🇻" },
  { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "+291", country: "Eritrea", flag: "🇪🇷" },
  { code: "+372", country: "Estonia", flag: "🇪🇪" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
  { code: "+679", country: "Fiji", flag: "🇫🇯" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+594", country: "French Guiana", flag: "🇬🇫" },
  { code: "+689", country: "French Polynesia", flag: "🇵🇫" },
  { code: "+241", country: "Gabon", flag: "🇬🇦" },
  { code: "+220", country: "Gambia", flag: "🇬🇲" },
  { code: "+995", country: "Georgia", flag: "🇬🇪" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+350", country: "Gibraltar", flag: "🇬🇮" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+299", country: "Greenland", flag: "🇬🇱" },
  { code: "+1473", country: "Grenada", flag: "🇬🇩" },
  { code: "+590", country: "Guadeloupe", flag: "🇬🇵" },
  { code: "+1671", country: "Guam", flag: "🇬🇺" },
  { code: "+502", country: "Guatemala", flag: "🇬🇹" },
  { code: "+224", country: "Guinea", flag: "🇬🇳" },
  { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "+592", country: "Guyana", flag: "🇬🇾" },
  { code: "+509", country: "Haiti", flag: "🇭🇹" },
  { code: "+504", country: "Honduras", flag: "🇭🇳" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+354", country: "Iceland", flag: "🇮🇸" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+98", country: "Iran", flag: "🇮🇷" },
  { code: "+964", country: "Iraq", flag: "🇮🇶" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+225", country: "Ivory Coast", flag: "🇨🇮" },
  { code: "+1876", country: "Jamaica", flag: "🇯🇲" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+962", country: "Jordan", flag: "🇯🇴" },
  { code: "+7", country: "Kazakhstan", flag: "🇰🇿" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+686", country: "Kiribati", flag: "🇰🇮" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "+856", country: "Laos", flag: "🇱🇦" },
  { code: "+371", country: "Latvia", flag: "🇱🇻" },
  { code: "+961", country: "Lebanon", flag: "🇱🇧" },
  { code: "+266", country: "Lesotho", flag: "🇱🇸" },
  { code: "+231", country: "Liberia", flag: "🇱🇷" },
  { code: "+218", country: "Libya", flag: "🇱🇾" },
  { code: "+423", country: "Liechtenstein", flag: "🇱🇮" },
  { code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
  { code: "+853", country: "Macau", flag: "🇲🇴" },
  { code: "+389", country: "Macedonia", flag: "🇲🇰" },
  { code: "+261", country: "Madagascar", flag: "🇲🇬" },
  { code: "+265", country: "Malawi", flag: "🇲🇼" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+960", country: "Maldives", flag: "🇲🇻" },
  { code: "+223", country: "Mali", flag: "🇲🇱" },
  { code: "+356", country: "Malta", flag: "🇲🇹" },
  { code: "+692", country: "Marshall Islands", flag: "🇲🇭" },
  { code: "+596", country: "Martinique", flag: "🇲🇶" },
  { code: "+222", country: "Mauritania", flag: "🇲🇷" },
  { code: "+230", country: "Mauritius", flag: "🇲🇺" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+691", country: "Micronesia", flag: "🇫🇲" },
  { code: "+373", country: "Moldova", flag: "🇲🇩" },
  { code: "+377", country: "Monaco", flag: "🇲🇨" },
  { code: "+976", country: "Mongolia", flag: "🇲🇳" },
  { code: "+382", country: "Montenegro", flag: "🇲🇪" },
  { code: "+1664", country: "Montserrat", flag: "🇲🇸" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+258", country: "Mozambique", flag: "🇲🇿" },
  { code: "+95", country: "Myanmar", flag: "🇲🇲" },
  { code: "+264", country: "Namibia", flag: "🇳🇦" },
  { code: "+674", country: "Nauru", flag: "🇳🇷" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+687", country: "New Caledonia", flag: "🇳🇨" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
  { code: "+227", country: "Niger", flag: "🇳🇪" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+680", country: "Palau", flag: "🇵🇼" },
  { code: "+970", country: "Palestine", flag: "🇵🇸" },
  { code: "+507", country: "Panama", flag: "🇵🇦" },
  { code: "+675", country: "Papua New Guinea", flag: "🇵🇬" },
  { code: "+595", country: "Paraguay", flag: "🇵🇾" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+1787", country: "Puerto Rico", flag: "🇵🇷" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+262", country: "Réunion", flag: "🇷🇪" },
  { code: "+40", country: "Romania", flag: "🇷🇴" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+250", country: "Rwanda", flag: "🇷🇼" },
  { code: "+590", country: "Saint Barthélemy", flag: "🇧🇱" },
  { code: "+1869", country: "Saint Kitts and Nevis", flag: "🇰🇳" },
  { code: "+1758", country: "Saint Lucia", flag: "🇱🇨" },
  { code: "+590", country: "Saint Martin", flag: "🇲🇫" },
  { code: "+1784", country: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { code: "+685", country: "Samoa", flag: "🇼🇸" },
  { code: "+378", country: "San Marino", flag: "🇸🇲" },
  { code: "+239", country: "Sao Tome and Principe", flag: "🇸🇹" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+221", country: "Senegal", flag: "🇸🇳" },
  { code: "+381", country: "Serbia", flag: "🇷🇸" },
  { code: "+248", country: "Seychelles", flag: "🇸🇨" },
  { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { code: "+386", country: "Slovenia", flag: "🇸🇮" },
  { code: "+677", country: "Solomon Islands", flag: "🇸🇧" },
  { code: "+252", country: "Somalia", flag: "🇸🇴" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+211", country: "South Sudan", flag: "🇸🇸" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+249", country: "Sudan", flag: "🇸🇩" },
  { code: "+597", country: "Suriname", flag: "🇸🇷" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+963", country: "Syria", flag: "🇸🇾" },
  { code: "+886", country: "Taiwan", flag: "🇹🇼" },
  { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+670", country: "Timor-Leste", flag: "🇹🇱" },
  { code: "+228", country: "Togo", flag: "🇹🇬" },
  { code: "+690", country: "Tokelau", flag: "🇹🇰" },
  { code: "+676", country: "Tonga", flag: "🇹🇴" },
  { code: "+1868", country: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
  { code: "+1649", country: "Turks and Caicos Islands", flag: "🇹🇨" },
  { code: "+688", country: "Tuvalu", flag: "🇹🇻" },
  { code: "+256", country: "Uganda", flag: "🇺🇬" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+598", country: "Uruguay", flag: "🇺🇾" },
  { code: "+998", country: "Uzbekistan", flag: "🇺🇿" },
  { code: "+678", country: "Vanuatu", flag: "🇻🇺" },
  { code: "+379", country: "Vatican City", flag: "🇻🇦" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+681", country: "Wallis and Futuna", flag: "🇼🇫" },
  { code: "+967", country: "Yemen", flag: "🇾🇪" },
  { code: "+260", country: "Zambia", flag: "🇿🇲" },
  { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
];

// Country select component with search
function CountrySelect({ value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredCountries = countryCodes.filter(
    (country) =>
      country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.includes(searchTerm)
  );

  const selectedCountry = countryCodes.find((c) => c.code === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    onChange({ target: { value: code } });
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative flex-shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="px-3 py-3.5 rounded-2xl text-sm outline-none transition-all disabled:opacity-70 focus:ring-4 focus:ring-purple-100 w-[130px] flex items-center justify-between gap-2"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(75,46,131,0.14)",
          color: colors.dark,
        }}
      >
        <span>
          {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.code}` : "Select"}
        </span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && !disabled && (
        <div
          className="absolute top-full left-0 mt-1 w-[280px] rounded-2xl shadow-xl z-50 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          <div className="p-2 border-b border-gray-200">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[240px] overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country.code)}
                  className="w-full px-4 py-2.5 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 text-sm"
                  style={{
                    background:
                      country.code === value ? "rgba(75,46,131,0.08)" : "transparent",
                  }}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="font-medium">{country.country}</span>
                  <span className="ml-auto text-gray-500 text-xs">{country.code}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Contact({
  editMode = false,
  contentOverride = null,
  onEditHero = () => {},
  onEditContactInfo = () => {},
  onDeleteContactInfo = () => {},
  onAddContactInfo = () => {},
  onEditMap = () => {},
  onEditForm = () => {},
} = {}) {
  const [loadedContent, setLoadedContent] = useState(
    mergeContactContent(contentOverride || defaultContactContent)
  );
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+977");
  const [phoneNumber, setPhoneNumber] = useState("");

  const content = contentOverride
    ? mergeContactContent(contentOverride)
    : loadedContent;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
    trigger,
  } = useForm();

  useEffect(() => {
    if (contentOverride) return;

    const loadContactContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/contact",
          {
            timeout: 12000,
          }
        );

        const savedContent = res.data?.data?.content || {};
        setLoadedContent(mergeContactContent(savedContent));
      } catch (error) {
        console.error("Contact content load error:", error);
        setLoadedContent(defaultContactContent);
      }
    };

    loadContactContent();
  }, [contentOverride]);

  const onSubmit = async (data) => {
    if (editMode) return;

    setSubmitMessage("");
    setSubmitError("");

    const fullPhoneNumber = selectedCountryCode + phoneNumber;
    
    const payload = {
      ...data,
      phone: fullPhoneNumber,
      source: "contact",
    };

    try {
      await axios.post(
        "https://school-website-backend-ixx2.onrender.com/api/contact",
        payload,
        {
          timeout: 15000,
        }
      );

      setSubmitMessage(content.form.successMessage);
      reset();
      setPhoneNumber("");
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitError(
        error.response?.data?.message || content.form.errorMessage
      );
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
      setValue("phone", selectedCountryCode + value);
      trigger("phone");
    }
  };

  const handleCountryChange = (e) => {
    const code = e.target.value;
    setSelectedCountryCode(code);
    setValue("phone", code + phoneNumber);
    trigger("phone");
  };

  // Glassmorphism style matching the left container
  const glassStyle = {
    background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.72))",
    border: "1px solid rgba(255,255,255,0.76)",
    boxShadow: "0 24px 70px rgba(11,16,32,0.12), inset 0 1px 0 rgba(255,255,255,0.92)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(75,46,131,0.14)",
    color: colors.dark,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95)",
  };

  return (
    <section
      id="contact"
      className="pt-32 pb-24 relative overflow-hidden min-h-screen"
      style={{
        background: `
          radial-gradient(circle at 8% 10%, rgba(250,204,21,0.2), transparent 26%),
          radial-gradient(circle at 90% 18%, rgba(56,189,248,0.18), transparent 30%),
          radial-gradient(circle at 12% 90%, rgba(215,25,32,0.1), transparent 28%),
          radial-gradient(circle at 88% 86%, rgba(22,138,58,0.14), transparent 28%),
          linear-gradient(180deg, #FFF8EE 0%, #F8F4FF 48%, #EEF7FF 100%)
        `,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.23]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(75,46,131,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(75,46,131,0.08) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />

      <div
        className="absolute -top-36 -left-28 w-[430px] h-[430px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(75,46,131,0.13), transparent 70%)",
          filter: "blur(7px)",
        }}
      />

      <div
        className="absolute top-24 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.15), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {editMode && (
          <div className="mb-8 rounded-[28px] p-5 bg-slate-950 text-white border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-white/45 font-black">
                Admin Contact Editor Active
              </div>
              <div className="text-lg font-black mt-1">
                Hover each block and click edit/delete. Public page stays normal.
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <AdminActionButton
                label="Edit Heading"
                icon={Pencil}
                tone="gold"
                onClick={onEditHero}
              />
              <AdminActionButton
                label="Add Contact Block"
                icon={Plus}
                tone="green"
                onClick={onAddContactInfo}
              />
              <AdminActionButton
                label="Edit Form"
                icon={Pencil}
                tone="purple"
                onClick={onEditForm}
              />
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className={`text-center mb-12 relative group ${
            editMode
              ? "rounded-[28px] p-6 border-2 border-dashed border-sky-300/70 bg-white/30"
              : ""
          }`}
        >
          {editMode && (
            <div className="absolute right-4 top-4 z-30 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <AdminActionButton
                label="Edit"
                icon={Pencil}
                tone="gold"
                onClick={onEditHero}
              />
            </div>
          )}

          <span
            className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-black mb-4"
            style={{
              background: "rgba(215,25,32,0.09)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.2)",
              boxShadow: "0 12px 28px rgba(215,25,32,0.08)",
            }}
          >
            {content.badgeText}
          </span>

          <h2
            className="text-4xl md:text-5xl leading-tight mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              color: colors.dark,
            }}
          >
            <HighlightedTitle
              title={content.title}
              highlightedText={content.highlightedText}
            />
          </h2>

          <p
            className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
            style={{ color: "#64748B" }}
          >
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-5 space-y-5"
          >
            <div
              className="rounded-[34px] p-5 md:p-6 relative overflow-hidden"
              style={{
                ...glassStyle,
                background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.72))",
              }}
            >
              <div
                className="absolute -right-20 -top-20 w-56 h-56 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(75,46,131,0.12), transparent 70%)",
                }}
              />

              <div className="relative z-10">
                <div
                  className="text-xs font-black uppercase tracking-[0.22em] mb-4"
                  style={{ color: colors.purple }}
                >
                  School Contact Details
                </div>

                <div className="space-y-4">
                  {content.contactInfo.map((info, index) => {
                    const Icon = getContactIcon(info.icon);

                    return (
                      <motion.div
                        key={info.id || info.label}
                        data-contact-card-id={info.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.42, delay: index * 0.05 }}
                        whileHover={editMode ? undefined : { y: -4 }}
                        className={`flex gap-4 p-4 rounded-[24px] relative group overflow-hidden ${
                          editMode
                            ? "border-2 border-dashed border-sky-300/70"
                            : ""
                        }`}
                        style={{
                          background:
                            "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
                          border: editMode
                            ? undefined
                            : `1px solid ${info.color}22`,
                          boxShadow:
                            "0 16px 40px rgba(11,16,32,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                        }}
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1.5"
                          style={{ background: info.color }}
                        />

                        <div
                          className="absolute -right-12 -top-12 w-32 h-32 rounded-full"
                          style={{
                            background: `radial-gradient(circle, ${info.color}18, transparent 70%)`,
                          }}
                        />

                        {editMode && (
                          <div className="absolute right-3 top-3 z-30 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <AdminActionButton
                              label="Edit"
                              icon={Pencil}
                              tone="purple"
                              onClick={() => onEditContactInfo(info.id)}
                            />
                            <AdminActionButton
                              label="Delete"
                              icon={Trash2}
                              tone="red"
                              onClick={() => onDeleteContactInfo(info.id)}
                            />
                          </div>
                        )}

                        <div
                          className="rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10"
                          style={{
                            width: 52,
                            height: 52,
                            background: `${info.color}14`,
                            border: `1px solid ${info.color}24`,
                            boxShadow: `0 14px 28px ${info.color}18`,
                          }}
                        >
                          <Icon
                            className="w-6 h-6"
                            style={{ color: info.color }}
                          />
                        </div>

                        <div
                          className={`relative z-10 min-w-0 ${
                            editMode ? "pr-24 md:pr-0" : ""
                          }`}
                        >
                          <div
                            className="text-xs font-black mb-1 uppercase tracking-[0.16em]"
                            style={{ color: "#94A3B8" }}
                          >
                            {info.label}
                          </div>
                          <div
                            className="text-sm md:text-base font-bold leading-relaxed"
                            style={{ color: colors.dark }}
                          >
                            {info.value}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div
              className={`rounded-[34px] overflow-hidden min-h-[260px] relative flex items-center justify-center group ${
                editMode ? "border-2 border-dashed border-sky-300/70" : ""
              }`}
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05)), linear-gradient(135deg, #020617, #1E1B4B 55%, #4B2E83)",
                border: editMode
                  ? undefined
                  : "1px solid rgba(255,255,255,0.18)",
                boxShadow:
                  "0 24px 64px rgba(11,16,32,0.28), 0 0 44px rgba(56,189,248,0.12)",
                backdropFilter: "blur(18px)",
              }}
            >
              {editMode && (
                <div className="absolute right-4 top-4 z-30 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <AdminActionButton
                    label="Edit Map"
                    icon={Pencil}
                    tone="gold"
                    onClick={onEditMap}
                  />
                </div>
              )}

              <div
                className="absolute inset-0 opacity-16"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                }}
              />

              <div
                className="absolute -top-20 -right-20 w-56 h-56 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(56,189,248,0.34), transparent 70%)",
                }}
              />

              <div
                className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(250,204,21,0.25), transparent 70%)",
                }}
              />

              <div className="text-center relative z-10 px-6">
                <div
                  className="w-16 h-16 mx-auto rounded-3xl flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    boxShadow: "0 16px 38px rgba(0,0,0,0.24)",
                  }}
                >
                  <MapPin className="w-8 h-8" style={{ color: colors.gold }} />
                </div>

                <div className="text-white font-black text-lg leading-tight">
                  {content.mapCard.title}
                </div>

                <div
                  className="text-sm mt-2 mb-5 leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.68)" }}
                >
                  {content.mapCard.address}
                </div>

                <a
                  href={normalizeExternalUrl(content.mapCard.mapUrl)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => {
                    if (editMode) {
                      event.preventDefault();
                      onEditMap();
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all duration-300 hover:scale-105"
                  style={{
                    color: "#020617",
                    background:
                      "linear-gradient(135deg, #FACC15 0%, #38BDF8 100%)",
                    boxShadow:
                      "0 16px 38px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
                  }}
                >
                  {content.mapCard.buttonText}
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div
              className={`p-6 md:p-10 rounded-[36px] h-full relative group overflow-hidden ${
                editMode ? "border-2 border-dashed border-sky-300/70" : ""
              }`}
              style={{
                ...glassStyle,
                background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.72))",
                border: editMode ? undefined : "1px solid rgba(255,255,255,0.76)",
                boxShadow: "0 24px 70px rgba(11,16,32,0.12), inset 0 1px 0 rgba(255,255,255,0.92)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <div
                className="absolute -right-24 -top-24 w-72 h-72 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(75,46,131,0.12), transparent 70%)",
                }}
              />

              <div
                className="absolute -left-24 bottom-0 w-72 h-72 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(56,189,248,0.12), transparent 70%)",
                }}
              />

              {editMode && (
                <div className="absolute right-4 top-4 z-30 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <AdminActionButton
                    label="Edit Form"
                    icon={Pencil}
                    tone="purple"
                    onClick={onEditForm}
                  />
                </div>
              )}

              <form
                onSubmit={
                  editMode
                    ? (event) => event.preventDefault()
                    : handleSubmit(onSubmit)
                }
                className="space-y-5 relative z-10"
              >
                <div className="mb-7">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.18em] mb-4"
                    style={{
                      background: "rgba(75,46,131,0.08)",
                      color: colors.purple,
                      border: "1px solid rgba(75,46,131,0.14)",
                    }}
                  >
                    <Send className="w-4 h-4" />
                    Contact Form
                  </div>

                  <h3
                    className="text-2xl md:text-3xl font-black"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: colors.dark,
                    }}
                  >
                    {content.form.title}
                  </h3>

                  <p className="text-sm mt-2" style={{ color: "#64748B" }}>
                    Fill out the form and the school team will get back to you.
                  </p>
                </div>

                {submitMessage && (
                  <div
                    className="p-4 rounded-2xl text-sm font-bold"
                    style={{
                      background: "rgba(22,138,58,0.1)",
                      color: colors.green,
                      border: "1px solid rgba(22,138,58,0.24)",
                    }}
                  >
                    {submitMessage}
                  </div>
                )}

                {submitError && (
                  <div
                    className="p-4 rounded-2xl text-sm font-bold"
                    style={{
                      background: "rgba(215,25,32,0.1)",
                      color: colors.red,
                      border: "1px solid rgba(215,25,32,0.24)",
                    }}
                  >
                    {submitError}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: "#475569" }}
                    >
                      {content.form.nameLabel}
                    </label>
                    <input
                      {...register("name", {
                        required: "Name is required.",
                      })}
                      disabled={editMode}
                      placeholder={content.form.namePlaceholder}
                      className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none transition-all disabled:opacity-70 focus:ring-4 focus:ring-purple-100"
                      style={inputStyle}
                    />
                    <ErrorText>{errors.name?.message}</ErrorText>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: "#475569" }}
                    >
                      {content.form.emailLabel}
                    </label>
                    <input
                      {...register("email", {
                        required: "Email is required.",
                      })}
                      disabled={editMode}
                      type="email"
                      placeholder={content.form.emailPlaceholder}
                      className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none transition-all disabled:opacity-70 focus:ring-4 focus:ring-purple-100"
                      style={inputStyle}
                    />
                    <ErrorText>{errors.email?.message}</ErrorText>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: "#475569" }}
                    >
                      {content.form.phoneLabel}
                    </label>
                    <div className="flex gap-2">
                      <CountrySelect
                        value={selectedCountryCode}
                        onChange={handleCountryChange}
                        disabled={editMode}
                      />
                      <input
                        {...register("phone", {
                          required: "Phone number is required.",
                          validate: (value) => {
                            const digitsOnly = value.replace(/\D/g, "");
                            if (digitsOnly.length !== 10) {
                              return "Phone number must be exactly 10 digits.";
                            }
                            return true;
                          },
                        })}
                        disabled={editMode}
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="9863468125"
                        className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none transition-all disabled:opacity-70 focus:ring-4 focus:ring-purple-100"
                        style={inputStyle}
                        maxLength={10}
                      />
                    </div>
                    <ErrorText>{errors.phone?.message}</ErrorText>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: "#475569" }}
                    >
                      {content.form.subjectLabel}
                    </label>
                    <input
                      {...register("subject", {
                        required: "Subject is required.",
                      })}
                      disabled={editMode}
                      placeholder={content.form.subjectPlaceholder}
                      className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none transition-all disabled:opacity-70 focus:ring-4 focus:ring-purple-100"
                      style={inputStyle}
                    />
                    <ErrorText>{errors.subject?.message}</ErrorText>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: "#475569" }}
                  >
                    {content.form.messageLabel}
                  </label>
                  <textarea
                    {...register("message", {
                      required: "Message is required.",
                    })}
                    disabled={editMode}
                    rows={6}
                    placeholder={content.form.messagePlaceholder}
                    className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none transition-all resize-none disabled:opacity-70 focus:ring-4 focus:ring-purple-100"
                    style={inputStyle}
                  />
                  <ErrorText>{errors.message?.message}</ErrorText>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || editMode}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all duration-300 hover:scale-[1.01] disabled:opacity-60"
                  style={{
                    color: "#020617",
                    background:
                      "linear-gradient(135deg, #FACC15 0%, #38BDF8 100%)",
                    boxShadow:
                      "0 22px 52px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
                  }}
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting
                    ? content.form.sendingText
                    : content.form.buttonText}
                </button>

                <div
                  className="rounded-2xl p-4 text-xs leading-relaxed"
                  style={{
                    background: "rgba(75,46,131,0.06)",
                    border: "1px solid rgba(75,46,131,0.1)",
                    color: "#64748B",
                  }}
                >
                  Your message will be sent directly to the school office.
                  Please include your correct phone number or email address.
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;