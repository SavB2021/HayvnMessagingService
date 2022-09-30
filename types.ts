export interface MessageRequest {
    destination : string
    text : string
    timestamp : string
}

export interface AggregatedMessages {
    batches : DestinationObject[]
}

export interface DestinationObject{
    destination : string
    messages : Messages[]
}

export interface Messages {
    text : string
    timestamp : string
}