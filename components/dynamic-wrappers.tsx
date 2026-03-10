"use client";
import nextDynamic from "next/dynamic";

export const PromotionsCarousel = nextDynamic(() => import("@/components/promotions-carousel"), { ssr: false });
export const QuickSearch = nextDynamic(() => import("@/components/quick-search"), { ssr: false });
export const BarbershopRanking = nextDynamic(() => import("@/components/barbershop-ranking"), { ssr: false });
export const LocationFilter = nextDynamic(() => import("@/components/location-filter"), { ssr: false });
export const MembershipWidget = nextDynamic(() => import("@/components/membership-widget"), { ssr: false });
