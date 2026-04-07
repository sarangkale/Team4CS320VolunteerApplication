import { AuthError, PostgrestError, type Session, type User, type UserResponse } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase"

export type AccountRole = "User" | "Organization";

export type AuthSuccess<S> = {
    type: "success",
    data: S,
};

export type AuthFailure<F> = {
    type: "error",
    error: F,
};

export type AuthRes<S, F> = AuthSuccess<S> | AuthFailure<F>;

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
    all_listings: string | null;
    bio: string | null;
    email: string | null;
    org_id: string;
    org_name: string | null;
    password_hash: string | null;
    website: string | null;
};

type SignupResult = { user: User | null, session: Session | null };

async function createAccount(
    email: string,
    password: string,
    role: AccountRole
): Promise<AuthRes<SignupResult, AuthError>> {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (data.user) {
        await supabase.from("account roles").insert({ id: data.user.id, role })

        return {
            type: "success",
            data,
        };
    }
    console.error(error);
    return {
        type: "error",
        error: error!,
    };
}

// USER SIGN UP
export async function userSignUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    school: string,
    graduationYear: number
): Promise<AuthRes<SignupResult, AuthError>> {
    const accountResult = await createAccount(email, password, "User");

    if (accountResult.type == "success") {
        const profile: UserProfile = {
            bio: "",
            email,
            first_name: firstName,
            graduation_year: graduationYear,
            last_name: lastName,
            major: "",
            phone: 0,
            school,
            total_hours_completed: 0,
            user_id: accountResult.data.user!.id,
        };
        await supabase.from("profiles").insert(
            profile
        );

        return {
            type: "success",
            data: accountResult.data,
        };
    }

    console.error(accountResult.error);
    return {
        type: "error",
        error: accountResult.error,
    };
}

// ORGANIZATION SIGN UP
export async function organizationSignUp(
    email: string,
    password: string,
    orgName: string,
    website: string):
Promise<AuthRes<SignupResult, AuthError>> {
    const accountResult = await createAccount(email, password, "Organization");

    if (accountResult.type === "success") {
        const profile = {
            all_listings: "",
            bio: "",
            email,
            org_id: accountResult.data.user!.id,
            org_name: orgName,
            website,
        };
        await supabase.from("organization").insert(
            profile
        );

        return {
            type: "success",
            data: accountResult.data,
        };
    }

    console.error(accountResult.error);
    return {
        type: "error",
        error: accountResult.error,
    };
}

// LOGIN
export async function login(email: string, password: string): Promise<AuthRes<{ user: User }, AuthError>> {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error(error)
        return { type: "error", error };
    }

    return { type: "success", data };
}

export async function getCurrentUserRole(): Promise<AuthRes<AccountRole, AuthError | PostgrestError>> {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
        return {
            type: "error",
            error: userError ?? new AuthError("No authenticated user session."),
        };
    }

    const { data, error } = await supabase
        .from("account roles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

    if (error || !data?.role) {
        return {
            type: "error",
            error: error ?? new AuthError("Unable to determine account role."),
        };
    }

    if (data.role !== "User" && data.role !== "Organization") {
        return {
            type: "error",
            error: new AuthError("Invalid account role."),
        };
    }

    return {
        type: "success",
        data: data.role,
    };
}

// LOGOUT
export async function logout(): Promise<AuthError | null> {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error(error);
    }

    return error;
}

// GET USER
export async function getCurrentUser(): Promise<UserResponse> {
    return await supabase.auth.getUser();
}

export async function getAccountProfile(): Promise<AuthRes<(UserProfile | OrganizationProfile), PostgrestError>> {
    const { data, error } = await supabase.from("account roles").select("role");
    if (data && data[0]) {
        const role = data[0].role;
        if (role == "User") {
            const {data, error}= await supabase.from("profiles").select();
            if (data) {
                return {type: "success", data: data[0]};
            } else {
                return {type: "error", error}
            }
        } else {
            const {data, error}= await supabase.from("organization").select();
            if (data) {
                return {type: "success", data: data[0]};
            } else {
                return {type: "error", error}
            }
        }
    }

    return {
        type: "error",
        error: error!,
    };
}

/* export async function getUserProfile(): Promise<PostgrestSingleResponse<UserProfile>> {
    return await supabase.from("profiles").select()
}

export async function getOrganizationProfile(): Promise<PostgrestSingleResponse<OrganizationProfile>> {
    return await supabase.from("organization").select();
} */
