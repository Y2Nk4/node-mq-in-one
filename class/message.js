class message {
    constructor (content, handler, options = {}, raw) {
        this.content = content
        this.handler = handler
        this.options = options || {}
        this.raw = raw
    }

    getContent () {
        return this.content
    }

    getHandler () {
        return this.handler
    }

    getMessageId () {
        return this.options.messageId
    }

    getMsgPriority () {
        return this.options.priority
    }

    getEnqueueTime () {
        return this.options.enqueueTime
    }

    getNextVisibleTime () {
        return this.options.nextVisibleTime
    }

    getFirstDequeueTime () {
        return this.options.firstDequeueTime
    }

    getRawResponse () {
        return this.raw
    }

    getDequeueCount () {
        return this.options.dequeueCount
    }
}

module.exports = message
