<span align="center">

# MQ-In-One

</span>

MQ-IN-ONE，旨在聚合各家云平台(阿里云MNS、腾讯云CMQ等)的队列服务，
以使用相似的API来调用各家云平台的队列，使得切换不同云平台服务的时候
仅需要更改配置文件而不需要更改代码结构。

### 现已支持
- 腾讯云CMQ: 基于 [kainonly/cmq-node-sdk](https://github.com/kainonly/cmq-node-sdk) 实现
- 阿里云MNS: 基于 [InCar/ali-mns](https://github.com/InCar/ali-mns) 实现

感谢以上库作者的贡献

### Quick Start

```javascript

let MQInOne = require('mq-in-one')

let mq = new MQInOne({
    // 不同厂商的MQ需要的配置不同，请查看各MQ的[配置项]
    accountId: '<accountId>',
    keyId: '<keyId>',
    keySecret: '<keySecret>',
    queueName: '<queueName>',
    mqRegion: '<mqRegion>',
}, '<mqType>')
```

不同厂商的MQ需要的配置不同，请查看各MQ的[配置项](#配置项)

#### 获取消息
```javascript
mq.receiveMessage().then(message => {
    console.log('Message content:', message.getContent())
})
```

#### 添加消息
```javascript
mq.pushMessage('I am content', {
    delaySeconds: 2     // 延迟2秒后可见
}).then(result => {
    console.log('Sent message:', result)
})
```

#### 轮询消息
```javascript
mq.pollingMessage(30, (err, message) => {
    if (err) {
        console.error('Error occurred:', err)
    } else {
        console.log('Received message', message)
    }
})
```

### API Reference
- `MQIneOne`
    - `constructor`
        * `config`
            
            MQ配置项，不同厂商的MQ需要的配置不同，请查看各MQ的[配置项](#配置项)
    
        * `mqType`

            队列类型。现在支持: 阿里云MNS: `mns`, 腾讯云CMQ `cmq`
    
        * `logger`
    
            log4js的logger实例
    
    - `pushMessage`: Promise\<MessageContract\>
                
        向队列添加消息
      
        * `content`: `String` - 消息内容
        * `options`: `Object` - 消息更多设置项
            * `delaySeconds` - 需要延时多久该消息才可见(单位:秒)
              
                Supported: `mns`, `cmq`
                
            * `priority` - 消息优先级

                Supported: `mns`

    - `receiveMessage`: Promise\<MessageContract\>
      
        接收队列中的消息

        * `pollingWaitSeconds`: `Number` - 请求的长轮询等待时间(单位:秒)
            
            Supported: `mns`, `cmq`
    
    - `consumeMessage`: Promise\<Boolean\>
    
        消费(删除)消息
    
        * `message`: `MessageContract` - 要删除的信息
    
    - `pollingMessage`
        
        不断轮询队列，若获取到新消息，则调用传入的handler函数
    
        * handler: `function`
            * `err` - 轮询错误
            * `message`: `MessageContract` - 获取到的消息
    
- `MessageContract` 
    - `constructor`
        * `content` - 消息内容
        * `handler` - 消息的句柄(用于删除消息)
        * `options` - 消息的附加属性(均为可选)
            * `messageId` - 消息Id，区别于handler
            * `priority` - 消息优先级
            * `enqueueTime`: `Date` - 消息入队时间
            * `nextVisibleTime`: `Date` - 消息下次可见时间
            * `firstDequeueTime`: `Date` - 消息初次出队时间
            * `dequeueCount`: `Number` - 出队次数(需为`Number`类型)
            * `raw` - 创建消息的原始信息
    
    - `getContent`: `String`
        获取消息内容
    - `getHandler`
        获取消息句柄
    - `getMessageId`
        获取消息Id
    - `getMsgPriority`
        获取消息优先度
    - `getEnqueueTime`
        获取消息入队时间
    - `getNextVisibleTime`
        获取消息下次可见时间
    - `getDequeueCount`
        获取消息出队次数
    - `getRawResponse`
        获取消息原始信息
    
### 配置项
- 公共配置项
    - `queueName` 队列名称

- 阿里云MNS
    - `accountId` 阿里云账户ID
    - `keyId` 阿里云 AccessKey ID
    - `keySecret` 阿里云 AccessKey Secret
    - `mqRegion` 队列服务所在地域，例如杭州为`hangzhou`，具体可查看MNS控制台上的`endpoint`地址中的地域名

- 腾讯云CMQ
    - `keyId` 腾讯云 Secret Id
    - `keySecret` 腾讯云 Secret Key
    - `mqRegion` 队列服务所在地域
        - gz（广州），sh（上海），bj（北京），shjr（上海金融），szjr（深圳金融），
          hk（香港），cd（成都），ca(北美)，usw（美西），sg（新加坡）
          
          (来自 [kainonly/cmq-node-sdk](https://github.com/kainonly/cmq-node-sdk#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B))

### Contribute Guideline

欢迎大家的PR/Issues来帮助我们完善这个项目，但请请留下方便理解的注释。 :)

You are most welcome to make any contribution to improve this project,
just please leave an understandable description of what you contribute
:)

### License
This Project is based on [MIT License](LICENSE)
