exports.bServeAsHub = false;
exports.bLight = true;
exports.bSingleAddress = true;

exports.WS_PROTOCOL = "wss://";
exports.hub = process.env.testnet ? 'obyte.org/bb-test' : 'obyte.org/bb';
exports.deviceName = 'AA-channel-lib';
exports.permanent_pairing_secret = '0000';
exports.control_addresses = [''];

exports.minChannelTimeoutInSecond = 600;
exports.maxChannelTimeoutInSecond = 1000;
exports.defaultTimeoutInSecond = 600;

exports.unconfirmedAmountsLimitsByAssetOrChannel = {
	"base": {
		max_unconfirmed_by_asset: 10000000,
		max_unconfirmed_by_channel: 10000000,
		minimum_time_in_second: 1
	},
	"Clcb6ZC5br93OA7ZMFEq88i+1CkJtpxpyAz4WyinKBY=": {
		max_unconfirmed_by_asset: 10000000,
		max_unconfirmed_by_channel: 10000000,
		minimum_time_in_second: 1
	}
};

exports.enabledReceivers = ['obyte-messenger']; //configure the communication layers that can receive a message from peer
// if 'http' is present, a http server will start to listen at port httpDefaultPort
// if 'obyte-messenger' is present, messages incoming through the encypted chat layers will be treated (not possible in High availability mode)

exports.httpDefaultPort = 6800;

console.log('finished AA-channel-lib conf');
