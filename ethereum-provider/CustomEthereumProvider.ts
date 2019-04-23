const errors = require("web3-core-helpers").errors;
const XHR2 = require("xhr2");
const Tx = require("ethereumjs-tx");
const Web3 = require("web3");


/**
 * This provider allows to send transactions.
 * A simple HttpProvider should be used to send rpc calls over http
 */
export default class CustomEthereumProvider {
    private host: string;
    private timeout: number;
    private connected: boolean;
    private headers: any;
    private callerAddress: string;
    private privateKey: string;

    constructor(callerAddress: string, privateKey: string, host: string, timeout?: number, headers?: any) {
        this.host = host || 'http://localhost:8545';
        this.timeout = timeout || 0;
        this.connected = false;
        this.headers = headers;
        this.callerAddress = callerAddress;
        this.privateKey = privateKey;
    }

    _prepareRequest() {
        const request = new XHR2();

        request.open('POST', this.host, true);
        request.setRequestHeader('Content-Type', 'application/json');

        if (this.headers) {
            this.headers.forEach(function (header: any) {
                request.setRequestHeader(header.name, header.value);
            });
        }

        return request;
    }

    /**
 * Should be used to make async request
 *
 * @method send
 * @param {Object} payload
 * @param {Function} callback triggered on end with (err, result)
 */
    send(payload: any, callback: any) {
        let _this = this;
        let request = this._prepareRequest();

        request.onreadystatechange = function () {

            if (request.readyState === 4 && request.timeout !== 1) {
                let result = request.responseText;
                let error = null;

                try {
                    result = JSON.parse(result);
                } catch (e) {
                    error = errors.InvalidResponse(request.responseText);
                }

                _this.connected = true;
                callback(error, result);
            }
        };

        request.ontimeout = function () {
            _this.connected = false;
            callback(errors.ConnectionTimeout(this.timeout));
        };


        switch (payload.method) {

            case 'eth_accounts':
            case 'eth_coinbase':
                // read from localStorage
                let selectedAddress = this.callerAddress;
                let result = [selectedAddress];
                callback(null, {
                    id: payload.id,
                    jsonrpc: payload.jsonrpc,
                    result: result,
                });
                break;

            case 'eth_sendTransaction':
                try {
                    console.log("> Custom Ethereum Provider : Sending transaction");

                    const web3 = new Web3(new Web3.providers.HttpProvider(this.host));

                    web3.eth.getTransactionCount(payload.params[0].from).then((nonce:any) => {

                        let rawTx = {
                            gasLimit: payload.params[0].gas,
                            gasPrice: payload.params[0].gasPrice,
                            nonce: nonce,
                            value: null,
                            data: null,
                            from: "",
                            to: ""
                        };

                        if (payload.params[0].value)
                            rawTx.value = payload.params[0].value;

                        if (payload.params[0].data)
                            rawTx.data = payload.params[0].data;

                        if (payload.params[0].from)
                            rawTx.from = payload.params[0].from;

                        if (payload.params[0].to)
                            rawTx.to = payload.params[0].to;

                        let transaction = new Tx(rawTx);
                        //signing transaction with private key
                        transaction.sign(Buffer.from(this.privateKey, 'hex'));

                        let txData = '0x' + transaction.serialize().toString('hex');

                        payload.method = "eth_sendRawTransaction";

                        let signedTx = {
                            "jsonrpc": "2.0",
                            "id": payload.id,
                            "method": "eth_sendRawTransaction",
                            "params": [txData]
                        }


                        request.send(JSON.stringify(signedTx))
                        console.log("> Custom Ethereum Provider : Transaction sent.");
                    });

                } catch (error) {
                    this.connected = false;
                    console.log(error);
                    //callback(errors.InvalidConnection(this.host));
                }
                break;

            default:
                request.send(JSON.stringify(payload));
        }
    }
}