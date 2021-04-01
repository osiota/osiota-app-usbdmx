/* USB-DMX protocol:
 * http://usbdmx.com/downloads/protocol.pdf
 */

var SerialPort = require("serialport");

var showbytes = function(str) {
	var hex = "";
	for(var i=0; i<str.length; i++) {
		var chr = str.charCodeAt(i);
		hex += " " + chr;
	}
	return hex;
};

exports.init = function(node, app_config, main, host_info) {
	if (typeof app_config !== "object") {
		app_config = {};
	}
	if (typeof app_config.nodes !== "object") {
		app_config.nodes = {};
	}
	if (typeof app_config.device !== "string") {
		app_config.device = '/dev/ttyUSB0';
	}

	var port = new SerialPort(app_config.device, {
		baudRate: 115200,
		dataBits: 8,
		parity: 'none',
		stopBits: 1
	});

	port.write_bytes = function(data) {
		//console.log("usbdmx: ", showbytes(data));
		this.write(new Buffer(data, 'binary'));
	}

	port.on('data', function(data) {
		var str = data.toString('binary');
		console.log("DATA: " + showbytes(str));
	});

	port.on('error', function(err) {
		console.error(err.stack || err);
	});

	port.init = function() {
		port.write_bytes(String.fromCharCode(0x22));
		//port.write_bytes(Buffer.from([0x22]));
	};
	port.set = function(channel, value) {
		//console.log("SET", channel, value);
		channel--;
		var cmd = (channel >> 8);
		cmd += 0x48;
		channel &= 0xFF;
		value &= 0xFF;
		port.write_bytes(String.fromCharCode(cmd, channel, value));
		//port.write_bytes(Buffer.from([cmd, channel, value]);
	};

	var co = [];

	port.on('open', function() {
		console.log("opened dmx");
		port.init();

		node.rpc_dmx = function(reply, channel, value) {
			if (value === null)
				value = 0;
			if (typeof value !== "number")
				value *= 1;

			port.set(channel, value);

			reply(null, "okay");
		};
		node.dmx = function(channel, value) {
			if (value === null)
				value = 0;
			if (typeof value !== "number")
				value *= 1;

			port.set(channel, value);
		};
		node.announce({
			"type": "dmx.rpc"
		});

		// map block (see artnet)
		var map = node.map(app_config, null, true, null,
				function(n, metadata, c) {
			let channel = c.channel;
			let default_value = c.default_value;
			n.rpc_set = function(reply, value, time) {
				if (value === null)
					value = default_value;
				if (typeof value !== "number")
					value *= 1;

				port.set(channel, value);
				this.publish(undefined, value, time);

				reply(null, "ok");
			};
			n.announce(metadata);
			if (default_value !== null) {
				n.rpc_set(function() {}, default_value);
			}
		});
		// end map block

		co.push(map);
	});

	return [co, node, port];
};

