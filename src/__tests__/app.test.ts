import request from "supertest";
import app from '../app';

jest.mock('../ops/redis-client')

describe("POST /", () => {
    it("returns status code 200 if correct post body is passed", async() => {
        const res = await request(app)
            .post("/")
            .send({destination : "test", text: "test", timestamp: 'test'});

        expect(res.statusCode).toEqual(200);
    })
})




