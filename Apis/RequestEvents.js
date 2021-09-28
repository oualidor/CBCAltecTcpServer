const RequestOperations = require("./RequestOperations");
const CMDs = require("./CMDs");
const {ConsoleMsgs} = require("./ConsoleMsgs");
const {LoginRequest} = require("../Structures/LoginRequest");
const {CmdExtractor} = require("./RequestOperations");
const {LoginAnswer} = require("../Structures/LoginAnswer");
const {TcpClient} = require("../Structures/TcpClient");
const {HttpRequestHandler} = require("./HttpRequestHandler");
const {BACKEND_SERVER} = require("./Config");
const {ConnectionOperations} = require("./ConnectionOperations");


async function answerHeartBit (connection, buf, request){
    buf = Buffer.from('000761010011223344', 'hex');
    connection.write(buf)
}

async function answerPowerBankReturn(connection, buf, request){
    buf = Buffer.from('00096601fa112233440001', 'hex');
    connection.write(buf)
}

async function getRentAnswer(data) {
    console.log(data)
}

async function getPBQueryAnswer(data) {
    console.log("power bank info coming")
    console.log(data)
}
const RequestEvents = {
    answerRequest : async (clientsList, connection, data) => {
        let buf
        let cmd = RequestOperations.CmdExtractor(data)
        if (cmd != undefined) {
            console.log(cmd + " request entered, trying to answer")
            if (CmdExtractor(data) === CMDs.login) {
                ConsoleMsgs.error("Refusing login cause of forbidden time")
            } else {
                if (await ConnectionOperations.isValid(clientsList, connection)) {
                    switch (cmd) {
                        case CMDs.heartBit:
                            answerHeartBit(connection,  null)
                            break
                        case CMDs.PowerBankInfo:
                            getPBQueryAnswer(data)
                            break
                        case CMDs.RentPowerBank:
                            getRentAnswer(data)
                            break
                        case CMDs.ReturnPowerBank:
                            answerPowerBankReturn(connection, buf, null)
                            break
                    }
                } else {
                    console.log("Operation no permitted")
                    connection.end();
                }
            }
        }
    },
}


module.exports = {RequestEvents}