"use client";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

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
  about_mission: "NUFF celebrates Ukrainian heritage and brings the Niagara community together through music, food, and culture.",
  about_history: "Founded by the Ukrainian community of Niagara, NUFF has grown into one of the region's most beloved summer festivals.",
  seo_title: "NUFF — Niagara Ukrainian Family Festival",
  seo_description: "A celebration of Ukrainian heritage in the heart of Niagara. July 11–12, 2026.",
};

let cache: SiteSettings | null = null;
const listeners = new Set<() => void>();

async function load() {
  try {
    const { data } = await supabase.from("site_settings").select("key,value");
    const map: SiteSettings = { ...DEFAULTS };
    (data ?? []).forEach((r: any) => { map[r.key] = r.value; });
    cache = map;
    listeners.forEach((l) => l());
  } catch { cache = { ...DEFAULTS }; listeners.forEach((l) => l()); }
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
