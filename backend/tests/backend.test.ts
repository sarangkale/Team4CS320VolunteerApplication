import { expect } from "@jest/globals";
import server from "../src/server.ts";
import supertest from "supertest";

const request = supertest(server);

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

test("Create opportunity", async () => {
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
        needed_skill: "everything"
    });

    expect(listingRes.statusCode).toBe(200);
})
