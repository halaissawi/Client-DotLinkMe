import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, ChevronDown, Search, Check } from "lucide-react";
import SocialAuthButtons from "../components/SocialAuthButtons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import TermsModal from "../components/TermsModal";
import Swal from "sweetalert2";
import ReactCountryFlag from "react-country-flag";
import PrivacyPolicyModal from "../components/PrivacyPolicyModal";

// Country codes moved outside component for performance
const COUNTRY_CODES = [
  { name: "Jordan", code: "+962", shortcut: "JO", flag: "JO" },
  { name: "Saudi Arabia", code: "+966", shortcut: "SA", flag: "SA" },
  { name: "UAE", code: "+971", shortcut: "AE", flag: "AE" },
  { name: "Qatar", code: "+974", shortcut: "QA", flag: "QA" },
  { name: "Kuwait", code: "+965", shortcut: "KW", flag: "KW" },
  { name: "USA", code: "+1", shortcut: "US", flag: "US" },
  { name: "UK", code: "+44", shortcut: "GB", flag: "GB" },
  { name: "Australia", code: "+61", shortcut: "AU", flag: "AU" },
  { name: "Germany", code: "+49", shortcut: "DE", flag: "DE" },
  { name: "France", code: "+33", shortcut: "FR", flag: "FR" },
  { name: "Italy", code: "+39", shortcut: "IT", flag: "IT" },
  { name: "Spain", code: "+34", shortcut: "ES", flag: "ES" },
  { name: "Netherlands", code: "+31", shortcut: "NL", flag: "NL" },
  { name: "Sweden", code: "+46", shortcut: "SE", flag: "SE" },
  { name: "Norway", code: "+47", shortcut: "NO", flag: "NO" },
  { name: "Denmark", code: "+45", shortcut: "DK", flag: "DK" },
  { name: "Finland", code: "+358", shortcut: "FI", flag: "FI" },
  { name: "Brazil", code: "+55", shortcut: "BR", flag: "BR" },
  { name: "Mexico", code: "+52", shortcut: "MX", flag: "MX" },
  { name: "Argentina", code: "+54", shortcut: "AR", flag: "AR" },
  { name: "South Africa", code: "+27", shortcut: "ZA", flag: "ZA" },
  { name: "India", code: "+91", shortcut: "IN", flag: "IN" },
  { name: "China", code: "+86", shortcut: "CN", flag: "CN" },
  { name: "Japan", code: "+81", shortcut: "JP", flag: "JP" },
  { name: "South Korea", code: "+82", shortcut: "KR", flag: "KR" },
  { name: "Singapore", code: "+65", shortcut: "SG", flag: "SG" },
  { name: "New Zealand", code: "+64", shortcut: "NZ", flag: "NZ" },
  { name: "Russia", code: "+7", shortcut: "RU", flag: "RU" },
  { name: "Turkey", code: "+90", shortcut: "TR", flag: "TR" },
  { name: "Egypt", code: "+20", shortcut: "EG", flag: "EG" },
  { name: "Morocco", code: "+212", shortcut: "MA", flag: "MA" },
  { name: "Nigeria", code: "+234", shortcut: "NG", flag: "NG" },
  { name: "Kenya", code: "+254", shortcut: "KE", flag: "KE" },
  { name: "Pakistan", code: "+92", shortcut: "PK", flag: "PK" },
  { name: "Bangladesh", code: "+880", shortcut: "BD", flag: "BD" },
  { name: "Thailand", code: "+66", shortcut: "TH", flag: "TH" },
  { name: "Vietnam", code: "+84", shortcut: "VN", flag: "VN" },
  { name: "Philippines", code: "+63", shortcut: "PH", flag: "PH" },
  { name: "Malaysia", code: "+60", shortcut: "MY", flag: "MY" },
];

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    secondname: "",
    lastname: "",
    dob: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [agree, setAgree] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

  // Load saved form data (excluding sensitive fields)
  useEffect(() => {
    const savedData = localStorage.getItem("signupFormData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Never load password from storage for security
        delete parsed.password;
        delete parsed.confirmPassword;
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  }, []);

  // Save form data (excluding sensitive fields)
  useEffect(() => {
    const dataToSave = { ...formData };
    // Never save passwords to localStorage
    delete dataToSave.password;
    delete dataToSave.confirmPassword;
    localStorage.setItem("signupFormData", JSON.stringify(dataToSave));
  }, [formData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchQuery("");
        setHighlightedIndex(0);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isDropdownOpen]);

  // Filter countries based on search with memoization
  const filteredCountries = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return COUNTRY_CODES;

    return COUNTRY_CODES.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query) ||
        country.shortcut.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Reset highlighted index when filtered countries change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredCountries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Password validation checks - simplified
  const hasMinLength = formData.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
    formData.password
  );
  const passwordsMatch =
    formData.password === formData.confirmPassword && formData.password !== "";

  // Calculate password strength
  const calculatePasswordStrength = () => {
    if (formData.password.length === 0)
      return { label: "", color: "", width: "" };

    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;

    if (score <= 2)
      return { label: "Weak", color: "bg-red-500", width: "w-1/3" };
    if (score <= 3)
      return { label: "Fair", color: "bg-yellow-500", width: "w-1/2" };
    if (score <= 4)
      return { label: "Good", color: "bg-blue-500", width: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  };

  const passwordStrength = calculatePasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    // Only validate phone if user entered something
    if (
      formData.phone &&
      formData.phone.trim() !== selectedCountry.code.trim()
    ) {
      const phoneWithoutCode = formData.phone
        .replace(selectedCountry.code, "")
        .trim();
      if (
        phoneWithoutCode.length < 8 ||
        !/^\d+$/.test(phoneWithoutCode.replace(/\s/g, ""))
      ) {
        setError("Please enter a valid phone number");
        setLoading(false);
        return;
      }
    }

    if (!agree) {
      setError("You must agree to the terms and conditions");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        firstName: formData.firstname,
        secondName: formData.secondname,
        lastName: formData.lastname,
        dateOfBirth: formData.dob,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
      };

      const response = await axios.post(`${API_URL}/auth/signup`, payload);

      if (response.status === 201) {
        localStorage.removeItem("signupFormData");
        if (response.data.message?.includes("OTP")) {
          await Swal.fire({
            icon: "info",
            title: "OTP Verification Required",
            text: response.data.message,
            confirmButtonText: "OK",
          });
          navigate("/verify-otp", {
            state: {
              email: formData.email,
              returnTo: location.state?.returnTo,
            },
          });
        } else if (response.data.token) {
          login(response.data.token, response.data.user);
          const returnTo = location.state?.returnTo;
          navigate(returnTo || "/");
        }
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "An error occurred during signup. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);

    // Smart phone number handling
    const currentPhone = formData.phone.trim();
    let newPhone = country.code + " ";

    // If there's an existing phone number, try to preserve the digits
    if (currentPhone) {
      // Remove old country code if exists
      let digits = currentPhone;
      for (const c of COUNTRY_CODES) {
        if (digits.startsWith(c.code)) {
          digits = digits.substring(c.code.length).trim();
          break;
        }
      }
      newPhone = country.code + " " + digits;
    }

    setFormData((prev) => ({
      ...prev,
      phone: newPhone,
    }));
    setIsDropdownOpen(false);
    setSearchQuery("");
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCountries.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredCountries[highlightedIndex]) {
          handleCountrySelect(filteredCountries[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsDropdownOpen(false);
        setSearchQuery("");
        setHighlightedIndex(0);
        break;
      default:
        break;
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (isDropdownOpen && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex, isDropdownOpen]);

  const inputClasses =
    "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 transition-colors";

  return (
    <div className="min-h-screen bg-brand-light">
      <section className="section-shell pt-8 pb-20 flex justify-center items-start">
        <div
          data-aos="fade-up"
          className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-10"
        >
          <div className="text-center mb-8">
            <p className="text-xs font-semibold text-brand-primary uppercase tracking-wide">
              Create Account
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark mt-1">
              Join LinkMe Today
            </h1>
            <p className="text-gray-600 mt-3 text-sm">
              Start building your smart digital identity in seconds.
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div
              className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg"
              role="alert"
            >
              {message}
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div
              className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Name Fields Group */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* First Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  required
                  value={formData.firstname}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClasses}
                />
              </div>

              {/* Second Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5">
                  Second Name
                </label>
                <input
                  type="text"
                  name="secondname"
                  placeholder="Second Name (Optional)"
                  value={formData.secondname}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClasses}
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  required
                  value={formData.lastname}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className={inputClasses}
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1.5">
                Phone Number
              </label>

              <div className="flex gap-2">
                {/* Custom Country Code Selector */}
                <div
                  className="w-32 sm:w-36 flex-shrink-0 relative"
                  ref={dropdownRef}
                >
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    className="w-full px-3 py-3 bg-white border border-gray-300 rounded-xl hover:border-brand-primary focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 transition-all duration-200 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Select country code"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="listbox"
                  >
                    <div className="flex items-center gap-2">
                      <ReactCountryFlag
                        countryCode={selectedCountry.flag}
                        svg
                        style={{ width: "1.25em", height: "1.25em" }}
                        aria-hidden="true"
                      />
                      <span className="font-semibold text-sm text-gray-700">
                        {selectedCountry.code}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div
                      className="absolute z-50 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                      role="listbox"
                      aria-label="Country codes"
                    >
                      {/* Search Box */}
                      <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                        <div className="relative">
                          <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            aria-hidden="true"
                          />
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search country..."
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                            aria-label="Search countries"
                          />
                        </div>
                      </div>

                      {/* Countries List */}
                      <div className="max-h-64 overflow-y-auto" ref={listRef}>
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country, index) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => handleCountrySelect(country)}
                              role="option"
                              aria-selected={
                                selectedCountry.code === country.code
                              }
                              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-brand-primary/5 transition-all duration-150 text-left ${
                                selectedCountry.code === country.code
                                  ? "bg-brand-primary/10"
                                  : ""
                              } ${
                                highlightedIndex === index
                                  ? "bg-brand-primary/5"
                                  : ""
                              }`}
                            >
                              <ReactCountryFlag
                                countryCode={country.flag}
                                svg
                                style={{ width: "1.5em", height: "1.5em" }}
                                aria-hidden="true"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm text-gray-700">
                                    {country.code}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {country.name}
                                  </span>
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <p className="text-sm text-gray-500">
                              No countries found
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone Input */}
                <input
                  type="tel"
                  name="phone"
                  placeholder="7X XXX XXXX (Optional)"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  className={`${inputClasses} flex-1`}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                disabled={loading}
                max={new Date().toISOString().split("T")[0]}
                className={inputClasses}
              />
            </div>

            {/* Password Fields Group */}
            <div className="col-span-1 md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      className={`${inputClasses} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      disabled={loading}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-brand-primary transition-colors disabled:opacity-50"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={20} className="text-gray-500" />
                      ) : (
                        <Eye size={20} className="text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                      className={`${inputClasses} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      disabled={loading}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-brand-primary transition-colors disabled:opacity-50"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} className="text-gray-500" />
                      ) : (
                        <Eye size={20} className="text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Indicator & Requirements */}
              {formData.password.length > 0 && (
                <div className="mt-4 space-y-3">
                  {/* Strength Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">
                        Password Strength
                      </span>
                      {passwordStrength.label && (
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength.label === "Weak"
                              ? "text-red-600"
                              : passwordStrength.label === "Fair"
                              ? "text-yellow-600"
                              : passwordStrength.label === "Good"
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      )}
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`}
                      ></div>
                    </div>
                  </div>

                  {/* Simple Requirements */}
                  <div className="space-y-2">
                    <ul className="text-sm space-y-1.5">
                      <li
                        className={`flex items-center ${
                          hasMinLength ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full ${
                            hasMinLength ? "bg-green-100" : "bg-gray-100"
                          }`}
                        >
                          {hasMinLength && (
                            <Check size={14} className="text-green-600" />
                          )}
                        </span>
                        At least 8 characters
                      </li>
                      {formData.confirmPassword.length > 0 && (
                        <li
                          className={`flex items-center ${
                            passwordsMatch ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          <span
                            className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full ${
                              passwordsMatch ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {passwordsMatch && (
                              <Check size={14} className="text-green-600" />
                            )}
                          </span>
                          Passwords match
                        </li>
                      )}
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Tip: Use uppercase, lowercase, numbers, and symbols for
                      a stronger password
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="col-span-1 md:col-span-2 mt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-brand-primary focus:ring-2 focus:ring-brand-primary/40 cursor-pointer disabled:opacity-50"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsModal(true);
                    }}
                    className="text-brand-primary underline hover:text-brand-primary/80 font-medium transition-colors"
                  >
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPrivacyPolicyModal(true);
                    }}
                    className="text-brand-primary underline hover:text-brand-primary/80 font-medium transition-colors"
                  >
                    Privacy Policy
                  </button>
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="col-span-1 md:col-span-2 btn-primary-clean w-full py-3 text-base rounded-xl shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center justify-center my-6">
            <div className="h-px flex-1 bg-gray-200"></div>
            <p className="mx-4 text-xs text-gray-500">or</p>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          {/* Social Auth Buttons */}
          {/* <SocialAuthButtons /> */}

          {/* Login Link */}
          <div className="text-center text-sm text-gray-600 mt-6">
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                state={{ returnTo: location.state?.returnTo }}
                className="text-brand-primary font-medium hover:underline transition-all"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </section>
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
      <PrivacyPolicyModal
        isOpen={showPrivacyPolicyModal}
        onClose={() => setShowPrivacyPolicyModal(false)}
      />
    </div>
  );
};

export default SignUp;
