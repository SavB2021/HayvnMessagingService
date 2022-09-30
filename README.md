# Simple Messaging Service

A simple node js app for the receiving, aggregation and sending of message objects.
<br />
The app is a node.js app with both typescript and redis support.

### How the app works

The main route of the app accepts the following request body as a POST request:

```json
{
  "destination": "operations-channel",
  "text": "An important event has occurred",
  "timestamp": "2021-01-01T12:00:00.000Z"
}
```

This body is injested and stored in a redis list per each destination.
<br />
Every 10 seconds a function runs which pulls all redis lists, aggregates them and sends them to a server in the
following object:

```json
{
  "batches": [
    {
      "destination": "operations-channel",
      "messages": [
        {
          "text": "An important event has occurred",
          "timestamp": "2021-01-01T12:00:00.000Z"
        },
        {
          "text": "Another important event has occurred",
          "timestamp": "2021-01-01T12:00:03.000Z"
        }
      ]
    },
    {
      "destination": "compliance",
      "messages": [
        {
          "text": "Some activity was completed",
          "timestamp": "2021-01-01T12:00:01.000Z"
        },
        {
          "text": "Some other activity was completed",
          "timestamp": "2021-01-01T12:00:03.000Z"
        }
      ]
    }
  ]
}

```

### To run the app

Before running the app, please ensure that docker is installed and running on your device.

1. In the docker-compose.yml file, add the correct URL for the external server that the batched messages will be sent
   to:
```yaml
    environment:
    - REDIS_URL=redis://cache
    - NODE_ENV=development
    - PORT=3001
    - SERVER_URL=test
```
2. Navigate to the root directory of the app
3. Build the app with
```text
docker-compose build
```
4. Run the app container along with the redis container with 
```text 
docker-compose up
```
5. You should see the following line in your terminal
```text
Server started on port 3001
```

6. In postman(or a similar app) use the following request to test the ingress route
``` text
curl --location --request POST 'localhost:3001' \
--header 'Content-Type: application/json' \
--data-raw '{
"destination": "operations",
"text": "An important event has occurred",
"timestamp": "2021-01-01T12:00:00.000Z"
}'
```

7. A successful response will look like this with a status code of 200:
```json
{
  "message": "Message received and saved successfully"
}
```

### Testing the app

There is a very simple unit test that has been setup to test the root path of the app.
<br/>
Because the app is so dependent on redis operations, creating unit tests turned out to be quite complicated.
<br/>
A workable solution was obtained by using jest alongside mock-redis which mocks a redis client instead of spinning up
the normal redis instance that is used by the app.
<br/>
To run the tests simply enter the following command in teh root directory ofthe project
<br/>

```
npm run test
```

### Security considerations

#### Endpoint exposed by the app

The root endpoint of this app is not secured, but it could easily have been done by using Auth0 API.
<br/>
When researching how to secure express app endpoints I successfully followed the steps as outlined in this doc
<br/>
(https://www.infoworld.com/article/3629129/how-to-use-auth0-with-nodejs-and-express.html).

#### Endpoint called by the app

The initial server endpoint that is called by the app was implemented using axios.
<br/>
If this endpoint were secured then auth credentials could be added to the config body as shown below
<br/>

 ``` js
   const config = {
      method: 'post',
      url: process.env.SERVER_URL,
      headers: {
         'Content-Type': 'application/json'
         'Authorization': ''
      },
      data: data
}
```

### Final Notes

In building this app, I tried a number of different methods to achieve the final result.
This definitely took more time than was necessary, but I feel that it was quite a good learning experience.
There are certain design decisions that were made which may have been a slight overkill considering
the scope of the task. The use of Redis is one such decision. The same result could have quite easily been obtained
by using node-cache or even just an in-memory array. This certainly would have made creating tests for the app
a lot easier. But my thinking was to offer a memory store that could hold a large capacity as opposed to using just
simple objects. 
