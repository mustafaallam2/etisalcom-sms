import axios from 'axios'
import xmlParser from 'xml-parser'

export interface sendOptions {
    from?: string
    to: string
    /** message body */
    body: string
    /**
     * This is foreign ID which can be used by customers to track the sent SMS
     * at their own end. Response sent from the server will also contain fid (if
     * provided). It can be alphanumeric.
     */
    referenceId?: string
    /**
     * It is the date and time to send the message. If future time is given the
     *  messages would be scheduled to deliver at the given time. If not provided
     * or past time is given then message will be sent immediately.
     */
    sendAt?: string
    /**  
     * Callback URL to receive the response from the server. Must be URL
     * encoded. Below given parameter can be used to fetch status from server.
     * Parameter Description
     * %from Message sender
     * %to Message receiver
     * %time DLR Date and Time
     * %status DLR Status (Delivered, Undelivered, etc.)
     * Sample URL:
     * http://www.example.com/yourpage?sender=%from&receiver=%to&dlrtime=%time&
     * status=%status

    */
    callbackUrl?: string

}

export interface constructorOptions {
    accountSid: string
    authToken: string
    from?: string,
}

export default class etisalcomSMS {
    // base URL to send SMS via etisalcom
    private uri: URL = new URL('https://esms.etisalcom.net:9443/smsportal/services/SpHttp/sendsms')

    /**
     * configure class options
     *
     * @param options constructorOptions
     */
    constructor(private options: constructorOptions) {
        this.uri.searchParams.append('user', this.options.accountSid)
        this.uri.searchParams.append('pass', this.options.authToken)

        /**
         * if provider provided the fixed Sender ID in constructing the class, it is added to the parameters
         */

        if (this.options.from) {
            this.uri.searchParams.append('from', this.options.from)
        }
    }

    /**
     * Send a SMS content to specific number
     */
    async send(options: sendOptions) {
        this.uri.searchParams.append('text', options.body)
        this.uri.searchParams.append('to', options.to)

        if (!this.options.from && !options.from) {
            throw Error('(From) field is required')
        }

        // if there is already from
        if (options.from) {
            this.uri.searchParams.append('from', options.from)
        }

        if (options.referenceId) {
            this.uri.searchParams.append('fid', options.referenceId)
        }

        if (options.sendAt) {
            this.uri.searchParams.append('at', options.sendAt)
        }

        if (options.callbackUrl) {
            this.uri.searchParams.append('url', options.callbackUrl)
        }

        const result = await axios.get(this.uri.toString())

        // if returned is only digits it means SMS was sent successfully
        const body = xmlParser(result.data)

        return {
            message: 'SMS Sent Successfully',
            response: body.root.children[0].content
        }
    }
}
