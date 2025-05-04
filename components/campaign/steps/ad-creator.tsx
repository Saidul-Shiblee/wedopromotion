"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, Globe, X, ChevronDown, ChevronRight, Search, Wand2, Upload, ChevronUp } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCampaign } from "@/contexts/campaign-context"
import { generateAdText } from "@/services/api"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Spotify icon component using inline SVG (Font Awesome style)
const SpotifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    focusable="false"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 496 512"
    width="28"
    height="28"
    {...props}
  >
    <path
      fill="currentColor"
      d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"
    ></path>
  </svg>
)

const genreOptions = [
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "hip-hop", label: "Hip Hop" },
  { value: "electronic", label: "Electronic" },
  { value: "country", label: "Country" },
]

// Define country categories by continent
const countryCategories = [
  {
    name: "Africa",
    icon: "continent",
    countries: [
      { value: "dz", label: "Algeria" },
      { value: "ao", label: "Angola" },
      { value: "bj", label: "Benin" },
      { value: "bw", label: "Botswana" },
      { value: "bf", label: "Burkina Faso" },
      { value: "bi", label: "Burundi" },
      { value: "cm", label: "Cameroon" },
      { value: "cv", label: "Cape Verde" },
      { value: "td", label: "Chad" },
      { value: "km", label: "Comoros" },
      { value: "ci", label: "Côte d'Ivoire" },
      { value: "cd", label: "Democratic Republic of the Congo" },
      { value: "dj", label: "Djibouti" },
      { value: "eg", label: "Egypt" },
      { value: "et", label: "Ethiopia" },
      { value: "gq", label: "Equatorial Guinea" },
      { value: "sz", label: "Eswatini" },
      { value: "ga", label: "Gabon" },
      { value: "gm", label: "Gambia" },
      { value: "gh", label: "Ghana" },
      { value: "gn", label: "Guinea" },
      { value: "gw", label: "Guinea-Bissau" },
      { value: "ke", label: "Kenya" },
      { value: "ls", label: "Lesotho" },
      { value: "lr", label: "Liberia" },
      { value: "ly", label: "Libya" },
      { value: "mg", label: "Madagascar" },
      { value: "mw", label: "Malawi" },
      { value: "ml", label: "Mali" },
      { value: "mr", label: "Mauritania" },
      { value: "mu", label: "Mauritius" },
      { value: "ma", label: "Morocco" },
      { value: "mz", label: "Mozambique" },
      { value: "na", label: "Namibia" },
      { value: "ne", label: "Niger" },
      { value: "ng", label: "Nigeria" },
      { value: "cg", label: "Republic of the Congo" },
      { value: "rw", label: "Rwanda" },
      { value: "st", label: "São Tomé and Príncipe" },
      { value: "sn", label: "Senegal" },
      { value: "sc", label: "Seychelles" },
      { value: "sl", label: "Sierra Leone" },
      { value: "za", label: "South Africa" },
      { value: "tz", label: "Tanzania" },
      { value: "tg", label: "Togo" },
      { value: "tn", label: "Tunisia" },
      { value: "ug", label: "Uganda" },
      { value: "zm", label: "Zambia" },
      { value: "zw", label: "Zimbabwe" },
    ],
  },
  {
    name: "Asia",
    icon: "continent",
    countries: [
      { value: "am", label: "Armenia" },
      { value: "az", label: "Azerbaijan" },
      { value: "bh", label: "Bahrain" },
      { value: "bd", label: "Bangladesh" },
      { value: "bt", label: "Bhutan" },
      { value: "bn", label: "Brunei Darussalam" },
      { value: "kh", label: "Cambodia" },
      { value: "ge", label: "Georgia" },
      { value: "hk", label: "Hong Kong" },
      { value: "in", label: "India" },
      { value: "id", label: "Indonesia" },
      { value: "iq", label: "Iraq" },
      { value: "il", label: "Israel" },
      { value: "jp", label: "Japan" },
      { value: "jo", label: "Jordan" },
      { value: "kw", label: "Kuwait" },
      { value: "kg", label: "Kyrgyzstan" },
      { value: "la", label: "Lao People's Democratic Republic" },
      { value: "lb", label: "Lebanon" },
      { value: "mo", label: "Macao" },
      { value: "my", label: "Malaysia" },
      { value: "mv", label: "Maldives" },
      { value: "mn", label: "Mongolia" },
      { value: "np", label: "Nepal" },
      { value: "om", label: "Oman" },
      { value: "pk", label: "Pakistan" },
      { value: "ps", label: "Palestine" },
      { value: "ph", label: "Philippines" },
      { value: "qa", label: "Qatar" },
      { value: "sa", label: "Saudi Arabia" },
      { value: "sg", label: "Singapore" },
      { value: "kr", label: "South Korea" },
      { value: "lk", label: "Sri Lanka" },
      { value: "tw", label: "Taiwan" },
      { value: "tj", label: "Tajikistan" },
      { value: "th", label: "Thailand" },
      { value: "tl", label: "Timor-Leste" },
      { value: "ae", label: "United Arab Emirates" },
      { value: "uz", label: "Uzbekistan" },
      { value: "vn", label: "Vietnam" },
    ],
  },
  {
    name: "Europe",
    icon: "continent",
    countries: [
      { value: "ax", label: "Åland" },
      { value: "al", label: "Albania" },
      { value: "ad", label: "Andorra" },
      { value: "ai", label: "Anguilla" },
      { value: "ac", label: "Ascension" },
      { value: "at", label: "Austria" },
      { value: "pt-20", label: "Azores" },
      { value: "es-ib", label: "Balearic Islands" },
      { value: "by", label: "Belarus" },
      { value: "be", label: "Belgium" },
      { value: "bm", label: "Bermuda" },
      { value: "ba", label: "Bosnia" },
      { value: "vg", label: "British Virgin Islands" },
      { value: "bg", label: "Bulgaria" },
      { value: "es-cn", label: "Canary Islands" },
      { value: "ky", label: "Cayman Islands" },
      { value: "es-ce", label: "Ceuta" },
      { value: "hr", label: "Croatia" },
      { value: "cy", label: "Cyprus" },
      { value: "cz", label: "Czech Republic" },
      { value: "dk", label: "Denmark" },
      { value: "ee", label: "Estonia" },
      { value: "fk", label: "Falkland Islands" },
      { value: "fo", label: "Faroe Islands" },
      { value: "fi", label: "Finland" },
      { value: "fr", label: "France" },
      { value: "gf", label: "French Guiana" },
      { value: "pf", label: "French Polynesia" },
      { value: "de", label: "Germany" },
      { value: "gi", label: "Gibraltar" },
      { value: "gr", label: "Greece" },
      { value: "gl", label: "Greenland" },
      { value: "gp", label: "Guadeloupe" },
      { value: "gg", label: "Guernsey" },
      { value: "hu", label: "Hungary" },
      { value: "is", label: "Iceland" },
      { value: "ie", label: "Ireland" },
      { value: "im", label: "Isle of Man" },
      { value: "it", label: "Italy" },
      { value: "je", label: "Jersey" },
      { value: "kz", label: "Kazakhstan" },
      { value: "xk", label: "Kosovo" },
      { value: "lv", label: "Latvia" },
      { value: "li", label: "Liechtenstein" },
      { value: "lt", label: "Lithuania" },
      { value: "lu", label: "Luxembourg" },
      { value: "pt-30", label: "Madeira" },
      { value: "mt", label: "Malta" },
      { value: "mq", label: "Martinique" },
      { value: "yt", label: "Mayotte" },
      { value: "es-ml", label: "Melilla" },
      { value: "md", label: "Moldova" },
      { value: "mc", label: "Monaco" },
      { value: "me", label: "Montenegro" },
      { value: "ms", label: "Montserrat" },
      { value: "nl", label: "Netherlands" },
      { value: "nc", label: "New Caledonia" },
      { value: "mk", label: "North Macedonia" },
      { value: "no", label: "Norway" },
      { value: "pn", label: "Pitcairn Islands" },
      { value: "pl", label: "Poland" },
      { value: "pt", label: "Portugal" },
      { value: "ro", label: "Romania" },
      { value: "re", label: "Réunion" },
      { value: "bl", label: "Saint Barthélemy" },
      { value: "sh", label: "Saint Helena" },
      { value: "mf", label: "Saint Martin" },
      { value: "pm", label: "Saint Pierre and Miquelon" },
      { value: "sm", label: "San Marino" },
      { value: "rs", label: "Serbia" },
      { value: "sk", label: "Slovakia" },
      { value: "si", label: "Slovenia" },
      { value: "es", label: "Spain" },
      { value: "sj", label: "Svalbard" },
      { value: "se", label: "Sweden" },
      { value: "ch", label: "Switzerland" },
      { value: "ta", label: "Tristan da Cunha" },
      { value: "tr", label: "Turkey" },
      { value: "tc", label: "Turks and Caicos Islands" },
      { value: "ua", label: "Ukraine" },
      { value: "gb", label: "United Kingdom" },
      { value: "wf", label: "Wallis and Futuna" },
    ],
  },
  {
    name: "North America & Caribbean",
    icon: "continent",
    countries: [
      { value: "as", label: "American Samoa" },
      { value: "ag", label: "Antigua and Barbuda" },
      { value: "bs", label: "Bahamas" },
      { value: "bb", label: "Barbados" },
      { value: "bz", label: "Belize" },
      { value: "ca", label: "Canada" },
      { value: "cr", label: "Costa Rica" },
      { value: "cw", label: "Curaçao" },
      { value: "dm", label: "Dominica" },
      { value: "do", label: "Dominican Republic" },
      { value: "sv", label: "El Salvador" },
      { value: "gd", label: "Grenada" },
      { value: "gu", label: "Guam" },
      { value: "gt", label: "Guatemala" },
      { value: "ht", label: "Haiti" },
      { value: "hn", label: "Honduras" },
      { value: "jm", label: "Jamaica" },
      { value: "mx", label: "Mexico" },
      { value: "ni", label: "Nicaragua" },
      { value: "mp", label: "Northern Mariana Islands" },
      { value: "pa", label: "Panama" },
      { value: "pr", label: "Puerto Rico" },
      { value: "kn", label: "St. Kitts and Nevis" },
      { value: "lc", label: "St. Lucia" },
      { value: "vc", label: "St. Vincent and the Grenadines" },
      { value: "tt", label: "Trinidad and Tobago" },
      { value: "us", label: "United States" },
      { value: "um", label: "United States Minor Outlying Islands" },
      { value: "vi", label: "United States Virgin Islands" },
    ],
  },
  {
    name: "South America",
    icon: "continent",
    countries: [
      { value: "ar", label: "Argentina" },
      { value: "aw", label: "Aruba" },
      { value: "bo", label: "Bolivia" },
      { value: "br", label: "Brazil" },
      { value: "cl", label: "Chile" },
      { value: "co", label: "Colombia" },
      { value: "ec", label: "Ecuador" },
      { value: "gy", label: "Guyana" },
      { value: "py", label: "Paraguay" },
      { value: "pe", label: "Peru" },
      { value: "sx", label: "Sint Maarten" },
      { value: "sr", label: "Suriname" },
      { value: "uy", label: "Uruguay" },
      { value: "ve", label: "Venezuela" },
    ],
  },
  {
    name: "Oceania",
    icon: "continent",
    countries: [
      { value: "au", label: "Australia" },
      { value: "bq-bo", label: "Bonaire" },
      { value: "cx", label: "Christmas Island" },
      { value: "cc", label: "Cocos (Keeling) Islands" },
      { value: "ck", label: "Cook Islands" },
      { value: "fj", label: "Fiji" },
      { value: "ki", label: "Kiribati" },
      { value: "mh", label: "Marshall Islands" },
      { value: "fm", label: "Micronesia" },
      { value: "nr", label: "Nauru" },
      { value: "nz", label: "New Zealand" },
      { value: "nu", label: "Niue" },
      { value: "nf", label: "Norfolk Island" },
      { value: "pw", label: "Palau" },
      { value: "pg", label: "Papua New Guinea" },
      { value: "bq-sa", label: "Saba" },
      { value: "ws", label: "Samoa" },
      { value: "bq-se", label: "Sint Eustatius" },
      { value: "sb", label: "Solomon Islands" },
      { value: "tk", label: "Tokelau" },
      { value: "to", label: "Tonga" },
      { value: "tv", label: "Tuvalu" },
      { value: "vu", label: "Vanuatu" },
    ],
  },
]

// Flatten countries for searching
const allCountries = countryCategories.flatMap((category) => category.countries)

// Continent icons
const ContinentIcon = ({ continent }: { continent: string }) => {
  switch (continent) {
    case "Africa":
      return <span className="font-bold text-sm">🌍</span>
    case "Asia":
      return <span className="font-bold text-sm">🌏</span>
    case "Europe":
      return <span className="font-bold text-sm">🌍</span>
    case "North America & Caribbean":
      return <span className="font-bold text-sm">🌎</span>
    case "South America":
      return <span className="font-bold text-sm">🌎</span>
    case "Oceania":
      return <span className="font-bold text-sm">🌏</span>
    default:
      return <Globe className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
  }
}

// Helper function to highlight matching text in search results
function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text

  const regex = new RegExp(`(${query.trim()})`, "gi")
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="bg-yellow-100 dark:bg-yellow-900 font-medium">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

export function AdCreator() {
  const { campaignData, updateCampaignData } = useCampaign()
  const [countrySearch, setCountrySearch] = useState("")
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [isCountryPopoverOpen, setIsCountryPopoverOpen] = useState(false)
  const [isGeneratingText, setIsGeneratingText] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [filteredCountries, setFilteredCountries] = useState<typeof allCountries>([])
  const [showAllSelectedCountries, setShowAllSelectedCountries] = useState(false)

  // Initialize selected countries from campaign data if available
  useEffect(() => {
    // Only initialize once when the component mounts
    if (campaignData.targetCountries && campaignData.targetCountries.length > 0) {
      setSelectedCountries(campaignData.targetCountries)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array means this only runs once on mount

  // Replace the useEffect for filtering countries with this improved version
  // Update filtered countries when search changes
  useEffect(() => {
    if (countrySearch.trim()) {
      const searchTerm = countrySearch.toLowerCase().trim()

      // First find countries that start with the search term (word boundary)
      const startsWithMatches = allCountries.filter((country) => {
        const label = country.label.toLowerCase()
        // Check if the country name starts with the search term
        return label.startsWith(searchTerm)
      })

      // Then find countries that include the search term elsewhere (but don't start with it)
      const includesMatches = allCountries.filter((country) => {
        const label = country.label.toLowerCase()
        // Check if the country name includes the search term but doesn't start with it
        return label.includes(searchTerm) && !label.startsWith(searchTerm)
      })

      // Sort each group alphabetically
      const sortedStartsWith = [...startsWithMatches].sort((a, b) => a.label.localeCompare(b.label))

      const sortedIncludes = [...includesMatches].sort((a, b) => a.label.localeCompare(b.label))

      // Combine both results, with startsWith matches first
      setFilteredCountries([...sortedStartsWith, ...sortedIncludes])

      // Debug output to verify filtering
      console.log("Search term:", searchTerm)
      console.log(
        "Starts with matches:",
        sortedStartsWith.map((c) => c.label),
      )
      console.log(
        "Includes matches:",
        sortedIncludes.map((c) => c.label),
      )
    } else {
      setFilteredCountries([])
    }
  }, [countrySearch])

  const handleGenerateText = async () => {
    setIsGeneratingText(true)
    try {
      // Use a default prompt or the track name if available
      const prompt = campaignData.selectedTrack ? `Track ${campaignData.selectedTrack}` : "My music"
      const text = await generateAdText(campaignData.adStyle, prompt)
      updateCampaignData({ adDescription: text })
    } catch (error) {
      console.error("Failed to generate text:", error)
    } finally {
      setIsGeneratingText(false)
    }
  }

  const toggleCountry = (countryValue: string) => {
    const newSelectedCountries = selectedCountries.includes(countryValue)
      ? selectedCountries.filter((c) => c !== countryValue)
      : [...selectedCountries, countryValue]

    setSelectedCountries(newSelectedCountries)
    updateCampaignData({ targetCountries: newSelectedCountries })
  }

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((name) => name !== categoryName) : [...prev, categoryName],
    )
  }

  // Toggle all countries in a category (continent)
  const toggleAllInCategory = (categoryName: string) => {
    const category = countryCategories.find((cat) => cat.name === categoryName)
    if (!category) return

    const categoryCountryValues = category.countries.map((country) => country.value)
    const allCategoryCountriesSelected = categoryCountryValues.every((value) => selectedCountries.includes(value))

    let newSelectedCountries: string[]

    if (allCategoryCountriesSelected) {
      // Remove all countries in this category
      newSelectedCountries = selectedCountries.filter((countryValue) => !categoryCountryValues.includes(countryValue))
    } else {
      // Add all countries in this category that aren't already selected
      const countriesToAdd = categoryCountryValues.filter((value) => !selectedCountries.includes(value))
      newSelectedCountries = [...selectedCountries, ...countriesToAdd]
    }

    setSelectedCountries(newSelectedCountries)
    updateCampaignData({ targetCountries: newSelectedCountries })
  }

  // Get selected countries count by continent
  const getSelectedCountriesCountByContinent = (continentName: string) => {
    const continent = countryCategories.find((cat) => cat.name === continentName)
    if (!continent) return 0

    const continentCountryValues = continent.countries.map((country) => country.value)
    return selectedCountries.filter((country) => continentCountryValues.includes(country)).length
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountrySearch(e.target.value)
  }

  // Add a new function to toggle all countries at once
  const toggleAllCountries = () => {
    const allCountryValues = allCountries.map((country) => country.value)
    const allSelected = allCountryValues.every((value) => selectedCountries.includes(value))

    if (allSelected) {
      // If all countries are already selected, deselect all
      setSelectedCountries([])
      updateCampaignData({ targetCountries: [] })
    } else {
      // Otherwise, select all countries
      setSelectedCountries(allCountryValues)
      updateCampaignData({ targetCountries: allCountryValues })
    }
  }

  return (
    <div className="space-y-6 mt-4 w-full">
      {/* Ad Creative Section */}
      <div className="space-y-2">
        <Label className="text-lg font-medium dark:text-zinc-300">Ad Creative</Label>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">Choose how you want to create your ad</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* AI-Generated Creative Card - Mobile Optimized */}
          <Card
            className={cn(
              "cursor-pointer transition-all hover:border-black dark:hover:border-indigo-600",
              campaignData.adStyle === "ai-generated"
                ? "border-2 border-black dark:border-indigo-600"
                : "border border-gray-200 dark:border-zinc-700",
            )}
            onClick={() => updateCampaignData({ adStyle: "ai-generated" })}
          >
            <CardHeader className="pb-2 md:pb-2 sm:p-4 p-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base md:text-lg dark:text-white">Generate my ad creative</CardTitle>
                  <CardDescription className="hidden md:block dark:text-zinc-400">
                    AI-powered ad creation
                  </CardDescription>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-300 text-xs md:text-sm">
                  Recommended
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="md:block sm:p-4 p-3">
              <div className="hidden md:flex items-center justify-center h-24 mb-4 bg-gray-50 dark:bg-zinc-800 rounded-md">
                <Wand2 className="h-12 w-12 text-gray-400 dark:text-zinc-500" />
              </div>
              <div className="flex items-center md:hidden mb-2">
                <Wand2 className="h-5 w-5 text-gray-400 dark:text-zinc-500 mr-2" />
                <p className="text-xs text-gray-600 dark:text-zinc-400">AI-powered ad creation</p>
              </div>
              <p className="hidden md:block text-sm text-gray-600 dark:text-zinc-400">
                We will ensure your ad creatives capture listeners&apos; attention and help you build your fanbase. Our
                ad creatives will help you achieve the lowest cost per listener.
              </p>
              <ul className="hidden md:block mt-4 space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
                  <span className="text-sm dark:text-zinc-300">Capture listeners&apos; attention effectively</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
                  <span className="text-sm dark:text-zinc-300">Build and grow your fanbase</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
                  <span className="text-sm dark:text-zinc-300">Achieve lowest cost per listener</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0 md:pt-2 sm:p-4 p-3">
              {campaignData.adStyle === "ai-generated" && (
                <div className="w-full text-center">
                  <Badge className="bg-black text-white dark:bg-indigo-600 hover:bg-black hover:text-white dark:hover:bg-indigo-600">
                    <Check className="h-3 w-3 mr-1" />
                    Selected
                  </Badge>
                </div>
              )}
            </CardFooter>
          </Card>

          {/* Custom Creative Card - Mobile Optimized */}
          <Card
            className={cn(
              "cursor-pointer transition-all hover:border-black dark:hover:border-indigo-600",
              campaignData.adStyle === "custom"
                ? "border-2 border-black dark:border-indigo-600"
                : "border border-gray-200 dark:border-zinc-700",
            )}
            onClick={() => updateCampaignData({ adStyle: "custom" })}
          >
            <CardHeader className="pb-2 md:pb-2 sm:p-4 p-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base md:text-lg dark:text-white">I have my own ad creative</CardTitle>
                  <CardDescription className="hidden md:block dark:text-zinc-400">
                    Upload your own assets
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="md:block sm:p-4 p-3">
              <div className="hidden md:flex items-center justify-center h-24 mb-4 bg-gray-50 dark:bg-zinc-800 rounded-md">
                <Upload className="h-12 w-12 text-gray-400 dark:text-zinc-500" />
              </div>
              <div className="flex items-center md:hidden mb-2">
                <Upload className="h-5 w-5 text-gray-400 dark:text-zinc-500 mr-2" />
                <p className="text-xs text-gray-600 dark:text-zinc-400">Upload your own assets</p>
              </div>
              <p className="hidden md:block text-sm text-gray-600 dark:text-zinc-400">
                Use your own creative assets for your campaign. Upload images, videos, or text that you&apos;ve already
                prepared for your promotion.
              </p>
              <ul className="hidden md:block mt-4 space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
                  <span className="text-sm dark:text-zinc-300">Full creative control</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
                  <span className="text-sm dark:text-zinc-300">Use your existing assets</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
                  <span className="text-sm dark:text-zinc-300">Brand consistency</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0 md:pt-2 sm:p-4 p-3">
              {campaignData.adStyle === "custom" && (
                <div className="w-full text-center">
                  <Badge className="bg-black text-white dark:bg-indigo-600 hover:bg-black hover:text-white dark:hover:bg-indigo-600">
                    <Check className="h-3 w-3 mr-1" />
                    Selected
                  </Badge>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Countries targeting field */}
      <div className="space-y-2 mt-8 mb-4 sm:mb-6 md:mb-8 pb-12 sm:pb-6">
        <Label htmlFor="countries-targeting" className="dark:text-zinc-300">
          Target Countries
        </Label>
        <div className="flex flex-col gap-2">
          <Popover open={isCountryPopoverOpen} onOpenChange={setIsCountryPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isCountryPopoverOpen}
                className="w-full justify-between border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                  <span>
                    {selectedCountries.length > 0
                      ? `${selectedCountries.length} countries selected`
                      : "Select target countries"}
                  </span>
                </div>
                <Check
                  className={cn(
                    "ml-2 h-4 w-4 shrink-0 opacity-0",
                    selectedCountries.length > 0 ? "opacity-100" : "opacity-0",
                  )}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 border-gray-200 shadow-md dark:border-zinc-700"
              align="start"
              style={{ width: "var(--radix-popover-trigger-width)" }}
            >
              <div className="flex flex-col">
                <div className="p-2 border-b border-gray-200 dark:border-zinc-700">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search countries..."
                      value={countrySearch}
                      onChange={handleSearchChange}
                      className="w-full rounded-md border border-gray-200 bg-white py-2 pl-8 pr-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-400"
                      autoComplete="off"
                    />
                    {countrySearch && (
                      <X
                        className="absolute right-2.5 top-2.5 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                        onClick={() => setCountrySearch("")}
                      />
                    )}
                  </div>
                </div>

                {!countrySearch.trim() && (
                  <div className="border-b border-gray-200 dark:border-zinc-700 p-2">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="w-full text-xs bg-black text-white hover:bg-gray-800 dark:bg-black dark:text-white dark:hover:bg-gray-800"
                      onClick={toggleAllCountries}
                    >
                      {allCountries.every((country) => selectedCountries.includes(country.value))
                        ? "Deselect All Countries"
                        : "Select All Countries"}
                    </Button>
                  </div>
                )}

                <div className="max-h-[300px] overflow-auto">
                  {countrySearch.trim() ? (
                    // Show search results
                    <div>
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                          <div
                            key={country.value}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer"
                            onClick={() => toggleCountry(country.value)}
                          >
                            <div
                              className={cn(
                                "flex h-4 w-4 items-center justify-center rounded-sm border border-black dark:border-zinc-600",
                                selectedCountries.includes(country.value)
                                  ? "bg-black text-white dark:bg-indigo-600"
                                  : "opacity-50",
                              )}
                            >
                              {selectedCountries.includes(country.value) && <Check className="h-3 w-3" />}
                            </div>
                            <span className="dark:text-zinc-300">{highlightMatch(country.label, countrySearch)}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500 dark:text-zinc-400">
                          No countries found matching &quot;{countrySearch}&quot;
                        </div>
                      )}
                    </div>
                  ) : (
                    // Show categorized countries by continent when not searching
                    <div>
                      {countryCategories.map((category) => (
                        <Collapsible
                          key={category.name}
                          open={expandedCategories.includes(category.name)}
                          onOpenChange={() => toggleCategory(category.name)}
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
                            <div className="flex items-center gap-2">
                              <ContinentIcon continent={category.name} />
                              <span className="font-medium text-sm dark:text-zinc-300">
                                {category.name}
                                {getSelectedCountriesCountByContinent(category.name) > 0 && (
                                  <span className="ml-2 text-xs text-gray-500 dark:text-zinc-400">
                                    ({getSelectedCountriesCountByContinent(category.name)}/{category.countries.length})
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleAllInCategory(category.name)
                                }}
                              >
                                {category.countries.every((country) => selectedCountries.includes(country.value))
                                  ? "Unselect All"
                                  : "Select All"}
                              </Button>
                              {expandedCategories.includes(category.name) ? (
                                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                              )}
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="py-1">
                              {category.countries.map((country) => (
                                <div
                                  key={country.value}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer pl-8"
                                  onClick={() => toggleCountry(country.value)}
                                >
                                  <div
                                    className={cn(
                                      "flex h-4 w-4 items-center justify-center rounded-sm border border-black dark:border-zinc-600",
                                      selectedCountries.includes(country.value)
                                        ? "bg-black text-white dark:bg-indigo-600"
                                        : "opacity-50",
                                    )}
                                  >
                                    {selectedCountries.includes(country.value) && <Check className="h-3 w-3" />}
                                  </div>
                                  <span className="dark:text-zinc-300">{country.label}</span>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {selectedCountries.length > 0 && (
            <div className="mt-2">
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3 border border-gray-200 dark:border-zinc-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-gray-500 dark:text-zinc-400" />
                    <p className="text-sm font-medium dark:text-zinc-300">
                      {selectedCountries.length} {selectedCountries.length === 1 ? "country" : "countries"} selected
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white h-7 px-2"
                    onClick={() => setIsCountryPopoverOpen(true)}
                  >
                    Edit
                  </Button>
                </div>

                {/* Display only the first 4 countries */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedCountries.slice(0, 4).map((countryValue) => {
                    const country = allCountries.find((c) => c.value === countryValue)
                    return (
                      <Badge
                        key={countryValue}
                        variant="outline"
                        className="bg-gray-100 border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
                      >
                        {country?.label}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0 text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                          onClick={() => toggleCountry(countryValue)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )
                  })}
                  {selectedCountries.length > 4 && !showAllSelectedCountries && (
                    <Badge
                      variant="outline"
                      className="bg-gray-100 border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
                    >
                      +{selectedCountries.length - 4} more
                    </Badge>
                  )}
                </div>

                {/* Show/Hide all countries button */}
                {selectedCountries.length > 4 && (
                  <Collapsible open={showAllSelectedCountries} onOpenChange={setShowAllSelectedCountries}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-xs p-0 h-auto text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                        onClick={(e) => {
                          e.preventDefault()
                          setShowAllSelectedCountries(!showAllSelectedCountries)
                        }}
                      >
                        {showAllSelectedCountries ? (
                          <>
                            <ChevronUp className="h-3 w-3 mr-1" />
                            <span>Hide all selected countries</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 mr-1" />
                            <span>Show all selected countries</span>
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="max-h-32 overflow-y-auto">
                        <div className="flex flex-wrap gap-2">
                          {selectedCountries.slice(4).map((countryValue) => {
                            const country = allCountries.find((c) => c.value === countryValue)
                            return (
                              <Badge
                                key={countryValue}
                                variant="outline"
                                className="bg-gray-100 border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
                              >
                                {country?.label}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-1 h-auto p-0 text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                                  onClick={() => toggleCountry(countryValue)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
