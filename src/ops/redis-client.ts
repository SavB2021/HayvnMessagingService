import {PostAggregatedMessages} from './initial-server'
import * as types from '../../types'

const redis = require('redis');
const client = redis.createClient({url: process.env.REDIS_URL});

(async () => {
    // Connect to redis server
     await client.connect();
    console.log('connect')
})();

export async function GetListByKey(key: string): Promise<any> {
    try{
        return await client.lRange(key, 0, -1)
    }catch (e) {
        console.error(e)
        throw new Error(`Could not retrieve list for key: ${key}`)
    }

}

export async function GetAllkeys(): Promise<string[]> {
    try {
        return await client.keys('*')
    } catch (e) {
        console.error(e)
        throw new Error("Could not fetch all keys")
    }

}

export async function AddToRedisList(messageRequest: types.MessageRequest) {
    try {
        const result = await client.rPush(messageRequest.destination, JSON.stringify({
            text: messageRequest.text,
            timestamp: messageRequest.timestamp
        }))
        console.log(result)
    } catch (e) {
        console.error(e)
        throw new Error(`Could not add message to redis array for destination:${messageRequest.destination}`)
    }

}

export async function FlushCache() {
    try {
        await client.flushAll()
        console.log("Cache flushed successfully")
    } catch (e) {
        console.error(e)
        throw new Error("Encountered error flushing cache")
    }

}

// function that runs every 10 seconds to aggregate and send messages
setInterval(async function () {
    console.log("Sending to server")
    try {
        const keys = await GetAllkeys()
        if (keys.length >= 1) {
            let fullAggregatedList: types.DestinationObject[] = []
            for (let key of keys) {
                let perDestination : types.DestinationObject
                const arrayOfMessages = await GetListByKey(key)
                const parsed : types.Messages[] = JSON.parse('[' + arrayOfMessages.join(',') + ']');
                perDestination  = {
                    destination: key,
                    messages: parsed
                }
                fullAggregatedList.push(perDestination)
            }
            const batch = {
                batches: fullAggregatedList
            }
            const resp = await PostAggregatedMessages(batch)
            if (resp) {
                await FlushCache()
            }else{
                console.error("Encountered error sending to server, will not flush cache")
            }
        } else {
            console.log("No messages to aggregate. Halting for 10 seconds...")
        }
    } catch (e) {
        console.error(e)
        console.error("Encountered an error batching and sending messages, will try again in 10 seconds")

    }
}, 10000);