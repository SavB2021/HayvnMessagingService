import request from "supertest";
import app from '../app';
import * as ops from '../ops/ops'


describe("POST /", () => {
    it("returns status code 200 if correct post body is passed", async () => {
        const res = await request(app)
            .post("/")
            .send({destination: "test", text: "test", timestamp: 'test'})

        expect(ops.ReceiveNewMessage).toHaveBeenCalled()
    })
})

