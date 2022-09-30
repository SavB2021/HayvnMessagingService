import express, {Application, json} from "express"
import * as bodyParser from 'body-parser';
import {AddToRedisList} from './ops/redis-client'
import * as types from '../types'
import {ReceiveNewMessage} from './ops/ops'

const app: Application = express();

app.use(bodyParser.json())

app.post('/', async (req, res, next) => {
    try {
        const message: types.MessageRequest = req.body
        const status = ReceiveNewMessage(message)
        if (status) {
            res.status(200).json({message: "Message received and saved successfully"});
        } else {
            res.status(400).json({error: "Something went wrong with saving this message"})
        }

    } catch (e) {
        console.error(e)
        res.status(400).json({error: "Something went wrong with saving this message"})
    }
});

app.listen(3001, () => {
    console.log("Server started on port 3001");
});

export default app

