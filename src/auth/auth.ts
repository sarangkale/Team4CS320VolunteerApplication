import { AuthError, type UserResponse } from "@supabase/supabase-js";
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

// SIGN UP
export async function signUp(email: string, password: string, name: string, university: string, role: AccountRole): Promise<AuthRes> {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (data.user) {
        await supabase.from("profiles").insert([
            {
                id: data.user.id,
                name,
                university,
                role,
            }
        ])
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

