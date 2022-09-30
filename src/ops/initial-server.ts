import * as types from '../../types'


export async function PostAggregatedMessages(body: types.AggregatedMessages): Promise<boolean> {
    const axios = require('axios');
    const data = JSON.stringify(body)
    const config = {
        method: 'post',
        url: process.env.SERVER_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    }
    try {
        await axios(config)
        return true
    } catch (error) {
        console.log(error);
    }
}
