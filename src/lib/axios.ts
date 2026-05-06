import axios, { AxiosError, type AxiosResponse } from "axios";
import type { Failure, Success, Result } from "../auth/auth";

const axios_instance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
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

export async function axios_post<S>(url: string, data?: any): Promise<Result<AxiosResponse<S, any, {}>, RequestError>> {
    return await axios_instance.post<S>(url, data)
    .then(handle_axios_success)
    .catch(handle_axios_error);
}

export async function axios_get<S>(url: string, data?: any): Promise<Result<AxiosResponse<S, any, {}>, RequestError>> {
    return await axios_instance.get<S>(url, data)
    .then(handle_axios_success)
    .catch(handle_axios_error);
}

