export type ListingData = {
    accepted_applicants?: string[] | null;
    applicants?: string[] | null;
    capacity?: number | null;
    categories?: string | null;
    city?: string | null;
    description?: string | null;
    distance?: number | null;
    duration?: string | null;
    files?: string[] | null;
    latitude?: number | null;
    listing_date?: string | null;
    listing_id?: string;
    listing_name?: string | null;
    longitude?: number | null;
    needed_skill?: string[] | null;
    org_id: string;
    org_name?: string | null;
    Questions?: string[] | null;
    state?: string | null;
    street?: string | null;
    transport?: string | null;
    volunteer_time?: string | null;
    zip_code?: string | null;
};


export type UserProfile = {
    bio: string | null;
    email: string | null;
    first_name: string | null;
    graduation_year: number | null;
    last_name: string;
    major: string | null;
    phone: number | null;
    school: string | null;
    total_hours_completed: number | null;
    user_id: string;
};

export type OrganizationProfile = {
    all_listings?: string | null;
    bio?: string | null;
    email: string;
    org_id: string;
    org_name?: string | null;
    password_hash?: string | null;
    website?: string | null;
};

export type Account = {
    role: AccountRole,
    profile: UserProfile | OrganizationProfile,
};
export type AccountRole = "User" | "Organization";

export type Success<S> = {
    type: "success",
    data: S,
};

export function success<S, F>(data: S): Result<S, F> {
    return {
        type: "success",
        data,
    }
}

export type Failure<F> = {
    type: "error",
    error: F,
};

export function failure<S, F>(error: F): Result<S, F> {
    return {
        type: "error",
        error,
    }
}

export type Result<S, F> = Success<S> | Failure<F>;

