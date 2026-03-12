import { AuthError, type PostgrestSingleResponse, type UserResponse } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase"

export type AccountRole = "User" | "Organization";

export type AuthSuccess = {
    type: "success",
    data: Record<string, any>
};

export type AuthFailure = {
    type: "error",
    error: AuthError,
};

export type AuthRes = AuthSuccess | AuthFailure;

export type UserProfile = {
    bio?: string;
    email: string;
    first_name?: string;
    graduation_year?: number;
    last_name: string;
    major?: string;
    phone?: number;
    school?: string;
    total_hours_completed?: number;
    user_id: string;
};

// SIGN UP
export async function userSignUp(email: string, password: string, firstName: string, lastName: string, school: string, graduationYear: number): Promise<AuthRes> {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (data.user) {
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
            user_id: data.user.id,
        };
        await supabase.from("profiles").insert(
            profile
        );
    }

    if (error) {
        console.error(error);
        return {
            type: "error",
            error
        };
    }

    return {
        type: "success",
        data,
    };
}

// LOGIN
export async function login(email: string, password: string): Promise<AuthRes> {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        console.error(error)
        return { type: "error", error };
    }

    return { type: "success", data };
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

export async function getUserProfile(): Promise<PostgrestSingleResponse<UserProfile[]>> {
    return await supabase.from("profiles").select();
}
