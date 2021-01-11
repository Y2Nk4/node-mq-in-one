let { CMQ } = require('cmq-sdk'),
    _logger = require('log4js').getLogger('cmq'),
    Queue = require('better-queue')

class cmq {
    constructor(CONFIG) {
        this.CONFIG = CONFIG

        this.CMQClient = new CMQ.NEW({
            path: '/v2/index.php',
            signatureMethod: 'HmacSHA256',
            extranet: true,
            secretId: this.CONFIG.keyId,
            secretKey: this.CONFIG.secretKey,
            region: this.CONFIG.mqRegion
        })

        this.TaskQueue = new Queue(function (task, cb) {
            return task(cb)
        }, {
            maxRetries: Infinity,
            retryDelay: 3000,
            concurrent: 3,
        })

        setInterval(() => {
            _logger.info(this.TaskQueue.getStats())
        }, 3000)

        setInterval(() => {
            _logger.info(this.TaskQueue.resetStats())
        }, 60 * 60 * 1000)
    }


    pollingMessage (maxRetries, handler) {
        let job = async function (cb) {
            try{
                let Message = await this.CMQClient.receiveMessage({
                    'queueName': this.CONFIG.queueName,
                })

                if (maxRetries && Message.dequeueCount > maxRetries) {
                    // 失败次数过多
                    await this.CMQClient.deleteMessage({
                        'queueName': this.CONFIG.queueName,
                        'receiptHandle': Message.receiptHandle
                    })

                    this.TaskQueue.push((cb_inner) => {
                        return job(cb_inner)
                    })

                    cb(null)
                } else {
                    handler(Message.msgBody, async (result) => {
                        if (result) {
                            await this.CMQClient.deleteMessage({
                                'queueName': this.CONFIG.queueName,
                                'receiptHandle': Message.receiptHandle
                            })
                        }

                        this.TaskQueue.push((cb_inner) => {
                            return job(cb_inner)
                        })

                        cb(null)
                    })
                }

            }catch (err) {
                if(err.message.indexOf('no message') === -1){
                    _logger.error(err)
                }

                this.TaskQueue.push((cb_inner) => {
                    return job(cb_inner)
                })

                cb(null)
            }
        }

        for(let a = 0; a <= 3; a++){
            setTimeout(() => {
                this.TaskQueue.push((cb) => {
                    return job(cb)
                })
            }, a * 100)
        }
    }
}

module.exports = cmq
