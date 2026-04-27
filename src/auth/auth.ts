import { type User } from "@supabase/supabase-js";
import { axios_get, axios_post, type RequestError } from "../lib/axios.ts";
import { type UserProfile, type OrganizationProfile, failure, success, type Account, type AccountRole, type Result } from "../../shared/types.ts";

const ACCOUNT_LOCAL_STORAGE_KEY = "Account";
const ROLE_LOCAL_STORAGE_KEY = "Role";

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
        localStorage.setItem(ACCOUNT_LOCAL_STORAGE_KEY, JSON.stringify(res.data.data));
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
    const res = await axios_post<User>("/auth/signup_organization", {
        email,
        password,
        org_name: orgName,
        website,
    });

    if (res.type == "success") {
        localStorage.setItem(ACCOUNT_LOCAL_STORAGE_KEY, JSON.stringify(res.data.data));
        localStorage.setItem(ROLE_LOCAL_STORAGE_KEY, "Organization");
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
export function getCurrentUser(): User {
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
