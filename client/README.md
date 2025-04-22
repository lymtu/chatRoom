db example

```ts
user
{
    "_id": ObjectId("") as string,
    "name": "lymtu" as string,
    "password": "1" as string,
    "status": Int32("1") as 0 | 1
}

room-contorl
{
    "_id": ...,
    "room-id": "0" as string,
    "room-status": 1 as 0 | 1,
    "room-name": "test" as string,
    "wss-url": "ws://localhost:3000" as string,
}
```
