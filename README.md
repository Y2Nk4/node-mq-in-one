# node-index-in-one
MQ-IN-ONE，聚合阿里云MNS、腾讯云CMQ等(http)队列服务

### 使用的库
- 腾讯云CMQ: [kainonly/cmq-node-sdk](https://github.com/kainonly/cmq-node-sdk)
- 阿里云MNS: [InCar/ali-mns](https://github.com/InCar/ali-mns)

### API Reference
- `MQIneOne`
    - `constructor`
        * `config`
            
            MQ配置项，不同厂商的MQ需要的配置不同，请查看各MQ的[配置项](#配置项)

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
