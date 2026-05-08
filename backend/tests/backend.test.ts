import { expect } from "@jest/globals";
import server from "../src/server.ts";
import supertest from "supertest";
import type { AccountRole, ListingData } from "../../shared/types.ts";
import type { ListingFilters } from "../../src/lib/listings.ts";

const request = supertest.agent(server);

describe("Basic auth", () => {
    it("Volunteer login logout", async () => {
        const loginRes = await request.post("/auth/login").send({
            email: "some@email.com",
            password: "123456",
        });
        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.body.user.id).toBe("dfbb0126-8cba-4e51-a366-8007fca57255");

        const logoutRes = await request.post("/auth/logout");
        expect(logoutRes.statusCode).toBe(200);
        expect(logoutRes.text).toBe("Logged out");
    })
})

test("Organization login logout", async () => {
    const loginRes = await request.post("/auth/login").send({
        email: "orgmail@mail.com",
        password: "123456",
    });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.user.id).toBe("fe570e3e-7873-43c7-a6dc-e1f790cae018");

    const logoutRes = await request.post("/auth/logout");
    expect(logoutRes.statusCode).toBe(200);
    expect(logoutRes.text).toBe("Logged out");
})

/* test("Create opportunity", async () => {
    const loginRes = await request.post("/auth/login").send({
        email: "orgmail@mail.com",
        password: "123456",
    });

    expect(loginRes.statusCode).toBe(200);

    const listingRes = await request.post("/organization/create_listing").send({
        name: "Test opportunity",
        capacity: 20,
        description: "Automated Jest opportunity",
        listing_date: "10193-04-28",
        duration: "50",
        categories: "coding",
        street: "154 Hicks Way",
        city: "Amherst",
        state: "Massachusetts",
        zip_code: "01003",
        needed_skill: ["everything"],
        transport: "walking",
    });

    expect(listingRes.statusCode).toBe(200);
}) */

describe("POST /volunteer/listings", () => {
    it("Fetch listings no filter", async () => {
        return request.post("/auth/login").send({
            email: "some@email.com",
            password: "123456",
        }).then(() => request
            .post("/volunteer/listings")
            .send({ range_start: 0, range_end: 4, filters: {} as ListingFilters })
            .expect(200)
            .then(res => {
                expect(res.body.length).toEqual(5);
            })
        )
    });
})

describe("GET /organization/profile", () => {
    it("Retrieves the organization profile", async () => {
        await request.post("/auth/login").send({
            email: "orgmail@mail.com",
            password: "123456",
        });
        const res = await request
            .get("/organization/profile")
            .expect(200);
        expect(res.body.role).toBe("Organization");
        expect(res.body.profile.email).toBe("orgmail@mail.com");
    })
})

describe("GET /volunteer/profile", () => {
    it("Retrieves the organization profile", async () => {
        await request.post("/auth/login").send({
            email: "some@email.com",
            password: "123456",
        });
        const res = await request
            .get("/volunteer/profile")
            .expect(200);
        expect(res.body.role).toBe("User");
        expect(res.body.profile.email).toBe("some@email.com");
    })
})
