
const dgram = require('dgram')
const urlParser = require('url').parse
const crypt = require('crypto')

const util = require('./util')
const torrentParser = require('./torrent-parser')

exports.getPeers = (torrent: any, callback: (value: any) => {}) => {
    const socket = dgram.createSocket('udp4')
    const url = torrent.announce.toString('utf8')

    udpSend(socket, buildConnReq(), url)

    socket.on('message', (response: Buffer) => {
        if (respType(response) == 'connect') {
            const connResp = parseConnResp(response)

            const announceReq = buildAnnouceReq(connResp.connectionId, torrent)
            udpSend(socket, announceReq, url)
        } else if(respType(response) == 'announce') {
            const announceResp = parseAnnounceResp(response)
            callback(announceResp.peers)
        }
    })

}


function respType(response: any): string {

}


function udpSend(socket: any, message: string, rawUrl: URL, callback: VoidFunction = () => {}) {
    const url = urlParser(rawUrl)
    socket.send(message, 0, message.length, url.port, url.host, callback)
}

function buildConnReq() {
    const buf = Buffer.alloc(16)
    // write the connection id according to bep
    buf.writeUInt32BE(0x417, 0)
    buf.writeUInt32BE(0x27101980, 4)
    // the action which is connect
    buf.writeUInt32BE(0, 8)
    // now the transaction id
    crypt.randomBytes(4).copy(buf, 12)
    // now we have our 16bytes buffer
    return buf
}

function parseConnResp(response: Buffer) {
    return {
        action: response.readUInt32BE(0),
        transactionId: response.readUInt32BE(4),
        connectionId: response.slice(8)
    }
}

function buildAnnouceReq(connectionId: Buffer, torrent: any, port=6881) {
    // building buf from bep
    const buf = Buffer.allocUnsafe(98)
    // copy connectionId to buf
    connectionId.copy(buf, 0)
    // action
    buf.writeUInt32BE(1, 8)
    // transactionId
    crypt.randomBytes(4).copy(buf, 12)
    // info hash
    torrentParser.infoHash(torrent).copy(buf, 16)
    // peer id
    util.genId().copy(buf, 36)
    // downloaded
    Buffer.alloc(8).copy(buf, 56)
    // left
    torrentParser.size(torrent).copy(buf, 64)
    // uploaded
    Buffer.alloc(8).copy(buf, 72)
    // event
    buf.writeUInt32BE(0, 80)
    // ip addr
    buf.writeUInt32BE(0, 84)
    // key
    crypt.randomBytes(4).copy(buf, 88)
    // num want
    buf.writeInt32BE(-1, 92)
    buf.writeUInt16BE(port, 96)

    return buf
}

function announceReq() {

}

function parseAnnounceResp(response: any) {
    
}
