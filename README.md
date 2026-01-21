### chatRoom


#### client

use `Next.js v16.0.10` `node v24.11.0`

因 Next.js 此版本不再使用 session，故使用 redis，以实现 session 功能

用户头像只能设置网络图片，未添加本地图片上传功能


#### server

use `elysia.js v1.4.19` `bun v1.2.15`

推荐使用 `bun` 运行


---

```js
// redis
 "token:[user_token]": {name, id, role}
```