import {
    failure,
    getAccountProfile,
    success,
    type OrganizationProfile,
    type Result,
  } from "../auth/auth";
  import { supabase } from "./supabase";
  import { PostgrestError } from "@supabase/supabase-js";
  
  export type ListingData = {
    listing_id?: string;
    org_id: string;
    org_name?: string | null;
    listing_name?: string | null;
    description?: string | null;
    listing_date?: string | null;
    distance?: number | null;
    transport?: string | null;
    categories?: string | null;
    volunteer_time?: string | null;
    duration?: string | null;
    needed_skill?: string[] | null;
    capacity?: number | null;
  };
  
  export async function createListing(
    listing_name: string,
    description: string,
    listing_date: string,
    duration: string,
    capacity: number,
    categories?: string,
    needed_skill?: string[],
    transport?: string
  ): Promise<Result<null, PostgrestError | string>> {
    const accountResult = await getAccountProfile();
  
    if (accountResult.type === "error") {
      return failure(accountResult.error);
    }
  
    const profile = accountResult.data.profile as OrganizationProfile;
  
    // If your profile has a role field, check it here
    if (accountResult.data.role !== "Organization") {
      return failure("Only organizations can create listings.");
    }
  
    const listing = {
      org_id: profile.org_id,
      org_name : profile.org_name,
      listing_name,
      description,
      listing_date,
      duration,
      capacity,
      categories: categories ?? null,
      needed_skill: needed_skill ?? null,
      transport: transport ?? null,
    } as any;
  
    const { data, error } = await supabase
      .from("listing")
      .insert([listing])
      .select("listing_id")
      .single();
  
    if (error) {
      return failure(error);
    }
  
    // Optional: only do this if you really need all_listings in organization table
    // and only if profile has all_listings
    if (profile.all_listings !== undefined) {
      const updatedListings = profile.all_listings
        ? `${profile.all_listings},${data.listing_id}`
        : `${data.listing_id}`;
  
      const { error: updateError } = await supabase
        .from("organization")
        .update({ all_listings: updatedListings })
        .eq("org_id", profile.org_id);
  
      if (updateError) {
        return failure(updateError);
      }
    }
  
    return success(null);
  }

  export type ListingFilters = {
    searchTerm?: string;
    org_name?: string[];
    categories?: string[];
    skill?: string[];
    transport?: string[];
  };
  
  export async function retrieveListings(
    rangeStart: number,
    rangeEnd: number,
    filters?: ListingFilters
  ): Promise<Result<ListingData[], PostgrestError>> {
    let query = supabase
      .from("listing")
      .select("*")
      .range(rangeStart, rangeEnd);
    //keyword search
    if (filters?.searchTerm?.trim()) {
      const term = filters.searchTerm.trim();
      query = query.or(
        `listing_name.ilike.%${term}%,org_name.ilike.%${term}%,description.ilike.%${term}%`
      );
    }

    //filters
    if (filters?.categories && filters.categories.length > 0) {
      query = query.in("categories", filters.categories);
    }
  
    if (filters?.transport && filters.transport.length > 0) {
      query = query.in("transport", filters.transport);
    }
  
    if (filters?.org_name && filters.org_name.length > 0) {
      query = query.in("org_name", filters.org_name);
    }
  
    if (filters?.skill && filters.skill.length > 0) {
      query = query.overlaps("needed_skill", filters.skill);
    }
  
    const { data, error } = await query;
  
    if (error) {
      return failure(error);
    }
  
    return success((data ?? []) as ListingData[]);
  }
  