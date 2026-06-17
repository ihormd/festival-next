"use client";
import { useEffect, useState } from "react";

export type SiteSettings = Record<string, string>;

export const DEFAULTS: SiteSettings = {
  festival_name: "Niagara Ukrainian Family Festival",
  festival_short_name: "NUFF",
  festival_dates: "July 11–12, 2026",
  festival_year: "2026",
  location_name: "Fireman's Park",
  location_address: "2275 Dorchester Road, Niagara Falls, ON",
  hero_tagline: "A celebration of Ukrainian heritage in the heart of Niagara.",
  hero_subtitle: "Two days of music, dance, food, craft, and community at Fireman's Park.",
  contact_email: "info@niagarka.ca",
  contact_phone: "",
  home_stat_1_value: "2", home_stat_1_label: "Days of celebration",
  home_stat_2_value: "10+", home_stat_2_label: "Performers & artists",
  home_stat_3_value: "30+", home_stat_3_label: "Vendors & artisans",
  home_stat_4_value: "1000+", home_stat_4_label: "Expected guests",
  home_pillars_eyebrow: "What to expect",
  home_pillars_heading: "Four pillars of the festival",
  home_pillar_food_title: "Food", home_pillar_food_body: "Authentic Ukrainian cuisine and drinks.",
  home_pillar_music_title: "Music", home_pillar_music_body: "Live performances all weekend.",
  home_pillar_culture_title: "Culture", home_pillar_culture_body: "Art, crafts, and traditions.",
  home_pillar_family_title: "Family", home_pillar_family_body: "Activities for all ages.",
  home_involved_eyebrow: "Get involved",
  home_involved_heading: "Join NUFF 2026",
  home_involved_vendors_title: "Vendors", home_involved_vendors_body: "Reserve a booth on the live map.",
  home_involved_artists_title: "Artists", home_involved_artists_body: "Apply to perform on stage.",
  home_involved_volunteers_title: "Volunteers", home_involved_volunteers_body: "Pick a shift, choose your role.",
  home_involved_sponsors_title: "Sponsors", home_involved_sponsors_body: "Partner with NUFF 2026.",
  home_hero_cta_primary: "Book a vendor spot",
  home_hero_cta_secondary: "Explore the festival",
  header_logo_alt: "NUFF",
  header_nav_festival: "Festival",
  header_nav_entertainment: "Entertainment",
  header_nav_merch: "Merch",
  header_nav_about: "About",
  header_nav_contact: "Contact",
  header_nav_involved_label: "Get Involved",
  header_nav_artists_label: "Artists", header_nav_artists_desc: "Apply to perform on stage",
  header_nav_vendors_label: "Vendors", header_nav_vendors_desc: "Reserve a booth on the live map",
  header_nav_volunteers_label: "Volunteers", header_nav_volunteers_desc: "Pick a shift, choose your role",
  header_nav_sponsors_label: "Sponsors", header_nav_sponsors_desc: "Partner with NUFF 2026",
  footer_tagline: "A celebration of Ukrainian heritage in the heart of Niagara.",
  footer_col1_title: "Festival", footer_col2_title: "Get involved",
  footer_copyright: "Niagara Ukrainian Family Festival. All rights reserved.",
  footer_contact_display: "info@niagarka.ca · Niagara Falls, Ontario 🇨🇦 🇺🇦",
  about_eyebrow: "Who we are", about_title: "About NUFF",
  about_subtitle: "The people and story behind the Niagara Ukrainian Family Festival.",
  about_mission_heading: "Our Mission",
  about_history_heading: "Our History",
  about_board_eyebrow: "Board of Directors",
  about_board_title: "The volunteers behind NUFF.",
  about_board_subtitle: "An all-volunteer board guides the festival's vision, finances, and partnerships.",
  about_mission: "NUFF celebrates Ukrainian heritage and brings the Niagara community together through music, food, and culture.",
  about_history: "Founded by the Ukrainian community of Niagara, NUFF has grown into one of the region's most beloved summer festivals.",
  entertainment_eyebrow: "Live performances", entertainment_title: "Entertainment",
  entertainment_subtitle: "Two days of music, dance, and cultural performances at Fireman's Park.",
  entertainment_schedule_title: "Weekend lineup",
  entertainment_cta_title: "Are you a performer?",
  entertainment_cta_body: "Apply to perform on stage at NUFF 2026.",
  entertainment_lineup: "Sat 12:00 | Opening Ceremony | Welcome with Hopak dance ensemble\nSat 14:00 | Bandura Live | Traditional string instrument\nSat 17:00 | Folk Dance Showcase | 5 ensembles · all ages\nSat 20:00 | Headliner — TBA | Modern Ukrainian artist\nSun 13:00 | Pysanky Workshop | Egg painting masterclass\nSun 16:00 | Vyshyvanka Parade | Traditional embroidered shirts",
  artists_eyebrow: "Perform at NUFF",
  artists_title: "Take the NUFF stage",
  artists_subtitle: "One main stage, two days, a packed crowd of families and culture lovers. We program traditional Ukrainian acts alongside contemporary voices.",
  artists_card1_title: "Main stage",
  artists_card1_body: "Our single main stage — full PA, monitors, backline, lighting rig. Headliner, feature, and emerging slots throughout the weekend.",
  artists_card2_title: "July 11–12, 2026",
  artists_card2_body: "Two-day festival at Fireman's Park, Niagara Falls. Set lengths from 20 to 60 minutes.",
  artists_card3_title: "What you get",
  artists_card3_body: "Hospitality, parking, vendor passes for your crew, and a connected Niagara audience.",
  volunteers_eyebrow: "Crew up",
  volunteers_title: "Volunteer with NUFF",
  volunteers_subtitle: "Help us run the most welcoming festival in the region. Pick your roles, pick your days.",
  seo_title: "NUFF — Niagara Ukrainian Family Festival",
  seo_description: "A celebration of Ukrainian heritage in the heart of Niagara. July 11–12, 2026.",
  hero_image_url: "/assets/hero-festival.jpg",
  pillar_food_image_url: "/assets/food-vendors.jpg",
  pillar_music_image_url: "/assets/stage-performance.jpg",
  pillar_culture_image_url: "/assets/culture-pysanky.jpg",
  pillar_family_image_url: "/assets/memory-2.jpg",
  festival_page_eyebrow: "NUFF 2026", festival_page_title: "The Festival",
  festival_page_subtitle: "Two days of music, dance, food, craft, and community at Fireman's Park.",
  festival_mission_title: "Our Mission", festival_history_title: "Our History",
  festival_mission_body: "NUFF celebrates Ukrainian heritage and brings the Niagara community together.",
  festival_history_body: "Founded by the Ukrainian community of Niagara, NUFF has grown into one of the region's most beloved summer festivals.",
  festival_community_eyebrow: "Community first",
  festival_community_title: "Built by volunteers, for everyone.",
  festival_community_body1: "NUFF is an all-volunteer effort rooted in the Ukrainian diaspora of Niagara Falls.",
  festival_community_body2: "Every ticket sold, every vendor booth booked, and every volunteer hour goes directly toward making NUFF the best it can be.",
  festival_experience_title: "What to expect",
  festival_experience_items: "Live music on two stages\nAuthentic Ukrainian food vendors\nTraditional dance ensembles\nPysanky & craft workshops\nKids' Zone activities\nArtisan marketplace",
  festival_visit_eyebrow: "Plan your visit", festival_visit_heading: "Everything you need to know.",
  festival_visit_dates_title: "Dates", festival_visit_dates_body: "July 11–12, 2026",
  festival_visit_location_title: "Location", festival_visit_location_body: "Fireman's Park, 2275 Dorchester Road, Niagara Falls, ON",
  festival_visit_hours_title: "Hours", festival_visit_hours_body: "11:00 AM – 10:00 PM both days",
  festival_visit_parking_title: "Parking", festival_visit_parking_body: "Free parking on site.",
  festival_visit_accessibility_title: "Accessibility", festival_visit_accessibility_body: "The grounds are fully accessible.",
  festival_visit_safety_title: "Safety", festival_visit_safety_body: "Licensed event with on-site first aid and security.",
  festival_memories_eyebrow: "Past festivals", festival_memories_title: "Moments that last.",
  festival_memories_body: "A glimpse of the joy, culture, and community from previous NUFF festivals.",
  google_maps_embed: "",
  logo_url: "/assets/nuff-logo.png",
  vendor_map_image_url: "/assets/festival-map.jpg",
  entertainment_stage_url: "/assets/stage-performance.jpg",
  entertainment_culture_url: "/assets/culture-pysanky.jpg",
  about_hero_url: "",
};

let cache: SiteSettings | null = null;
const listeners = new Set<() => void>();

async function load() {
  try {
    const res = await fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "site_settings", select: "key,value" }),
      cache: "no-store",
    });
    const json = await res.json();
    const map: SiteSettings = { ...DEFAULTS };
    (json.data ?? []).forEach((r: any) => { map[r.key] = r.value; });
    cache = map;
  } catch {
    cache = { ...DEFAULTS };
  }
  listeners.forEach(l => l());
}

export function useSiteSettings(): SiteSettings {
  const [v, setV] = useState<SiteSettings>(cache ?? DEFAULTS);
  useEffect(() => {
    const sub = () => setV({ ...(cache ?? DEFAULTS) });
    listeners.add(sub);
    if (!cache) load(); else sub();
    return () => { listeners.delete(sub); };
  }, []);
  return v;
}

export async function refreshSiteSettings() { cache = null; await load(); }

// Sponsor tier card fields
const TIER_DEFAULTS: SiteSettings = {
  tier_section_subtitle: "Choose your tier — or design a custom partnership with our team.",
  tier_bronze_name: "Bronze", tier_bronze_price: "$250",
  tier_bronze_perks: "Logo on website\nSocial media mention\nFestival program listing",
  tier_silver_name: "Silver", tier_silver_price: "$1,000",
  tier_silver_perks: "All Bronze perks\nStage shout-out\nReserved booth space\nLogo on signage",
  tier_gold_name: "Gold", tier_gold_price: "$5,000",
  tier_gold_perks: "All Silver perks\nPremium booth location\nHeadline stage banner\nVIP hospitality",
  tier_platinum_name: "Platinum", tier_platinum_price: "$15,000",
  tier_platinum_perks: "All Gold perks\nTitle sponsor naming\nDedicated press release\nYear-round partnership",
  tier_cta_title: "Partner with NUFF 2026",
  tier_cta_body: "Custom packages, in-kind contributions, and multi-year partnerships are all welcome.",
};
Object.assign(DEFAULTS, TIER_DEFAULTS);
