import * as types from '../../types'
import { AddToRedisList } from './redis-client'

export const ReceiveNewMessage = async (message: types.MessageRequest): Promise<boolean> => {
    try {
        await AddToRedisList(message)
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}