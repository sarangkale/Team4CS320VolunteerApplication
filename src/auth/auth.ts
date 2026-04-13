import { /* AuthError, PostgrestError, type Session, */ type User/* , type UserResponse */ } from "@supabase/supabase-js";
// import { supabase } from "../lib/supabase"

import axios, { AxiosError, type AxiosResponse } from "axios";

const ACCOUNT_LOCAL_STORAGE_KEY = "Account";
const ROLE_LOCAL_STORAGE_KEY = "Role";

export type AccountRole = "User" | "Organization";

export type Account = {
    role: AccountRole,
    profile: UserProfile | OrganizationProfile,
};

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

const axios_instance = axios.create({
    baseURL: "http://localhost:3000",
});

export type RequestError = {
    name: string,
    msg: string,
}

function handle_axios_error(err: Error | AxiosError): Failure<RequestError> {
    if (axios.isAxiosError(err)) {
        const axios_err = err as AxiosError;
        return {
            type: "error",
            error:
            {
                name: axios_err.response?.statusText!,
                msg: axios_err.response?.request["responseText"],
            }
        };
    } else {
        return {
            type: "error",
            error: {
                name: err.name,
                msg: err.message,
            }
        };
    }
}

function handle_axios_success<S>(val: AxiosResponse<S, any, {}>): Success<AxiosResponse<S, any, {}>> {
    return { type: "success", data: val };
}

async function axios_post<S>(url: string, data?: any): Promise<Result<AxiosResponse<S, any, {}>, RequestError>> {
    return await axios_instance.post<S>(url, data)
    .then(handle_axios_success)
    .catch(handle_axios_error);
}

async function axios_get<S>(url: string): Promise<Result<AxiosResponse<S, any, {}>, RequestError>> {
    return await axios_instance.get<S>(url)
    .then(handle_axios_success)
    .catch(handle_axios_error);
}

// USER SIGN UP
export async function userSignUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    school: string,
    graduationYear: number
): Promise<Result<User, RequestError>> {
    const res = await axios_post<User>("/auth/signup_volunteer", {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        school,
        graduation_year: graduationYear
    });

    if (res.type == "success") {
        localStorage.setItem(ACCOUNT_LOCAL_STORAGE_KEY, JSON.stringify(res.data));
        localStorage.setItem(ROLE_LOCAL_STORAGE_KEY, "User");
        return success(res.data.data);
    } else {
        return failure(res.error);
    }
}

// ORGANIZATION SIGN UP
export async function organizationSignUp(
    email: string,
    password: string,
    orgName: string,
    website: string):
    Promise<Result<User, RequestError>> {
    const res = await axios_post<User>("/auth/signup_volunteer", {
        email,
        password,
        org_name: orgName,
        website,
    });

    if (res.type == "success") {
        localStorage.setItem(ACCOUNT_LOCAL_STORAGE_KEY, JSON.stringify(res.data));
        localStorage.setItem(ROLE_LOCAL_STORAGE_KEY, "User");
        return success(res.data.data);
    } else {
        return failure(res.error);
    }
}

// LOGIN
export async function login(email: string, password: string): Promise<Result<{ user: User, role: AccountRole }, RequestError>> {
    const res = await axios_post<{ user: User, role: AccountRole }>("/auth/login", {
        email,
        password
    });
    if (res.type == "success") {
        const { user, role } = res.data.data;
        localStorage.setItem(ACCOUNT_LOCAL_STORAGE_KEY, JSON.stringify(user));
        localStorage.setItem(ROLE_LOCAL_STORAGE_KEY, role as string);
        return success(res.data.data);
    } else {
        return failure(res.error);
    }
}

export function getCurrentUserRole(): AccountRole {
    return localStorage.getItem(ROLE_LOCAL_STORAGE_KEY) as AccountRole;
}

// LOGOUT
export async function logout(): Promise<Result<null, RequestError>> {
    localStorage.clear();
    const res = await axios_post("/auth/logout");

    if (res.type == "success") {
        return success(null);
    } else {
        return failure(res.error);
    }
}

// GET USER
export async function getCurrentUser(): Promise<User> {
    return JSON.parse(localStorage.getItem(ACCOUNT_LOCAL_STORAGE_KEY)!)
}

export async function getAccountProfile(): Promise<Result<Account, RequestError>> {
    const role = getCurrentUserRole();
    const res = await axios_get<UserProfile | OrganizationProfile>(role == "Organization" ? "/organization/profile" : "/volunteer/profile");
    if (res.type == "success") {
        return success({
            role,
            profile: res.data.data,
        });
    } else {
        return failure(res.error);
    }
}
