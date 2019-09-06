const koa = require('koa');
const app = new koa();
const Route = require('e.router')();
const render = require('koa-ejs');
const IO = require('koa-socket-2');
const serve = require('koa-static');
const io = new IO();
const fs = require('fs');

let lights = {
	floor1: false,
	floor2: false,
	roof: false
};

let aa_address = null;
try {
	fs.accessSync('./address', fs.constants.R_OK | fs.constants.W_OK);
	aa_address = fs.readFileSync('./address').toString();
} catch (e) {
}


const channels = require('biot-core/channels');
const eventBus = require('ocore/event_bus');
const core = require('biot-core');
const db = require('ocore/db');

core.init('test').then(async () => {
	eventBus.emit('biot_ok');
	let wallets = await core.getWallets();
	console.error('----- my address', (await core.getAddressesInWallet(wallets[0]))[0]);
	if (!aa_address) {
		setTimeout(() => {
			channels.createNewChannel('A8jr0/gaCe4bFJQhw0y73rsBVlTqtzCJMMyjQqtiVCRR@obyte.org/bb-test#0000', 200000, {
				timeout: 1000,
				salt: 'biot.ws'
			}, (error, _aa_address, unit) => {
				console.error(error, _aa_address);
				aa_address = _aa_address;
				fs.writeFileSync('./address', aa_address);
			});
		}, 3000);
	}

	setInterval(() => {
		let balance = 0;
		if (lights.floor1) balance += 3;
		if (lights.floor2) balance += 3;
		if (lights.roof) balance += 3;
		if (balance > 0) {
			channels.sendMessageAndPay(aa_address, '', balance, async (error, response) => {
				if (error)
					return console.error(error);
				else {
					let rows = await db.query("SELECT amount_deposited_by_peer, amount_spent_by_me FROM aa_channels WHERE aa_channels.aa_address = ?", [aa_address]);
					io.connections.forEach(s => s.emit('upd_paid', rows[0].amount_spent_by_me));
					console.error(response);
				}
			});
		}
	}, 15000);
});


app.use(serve('./s/'));

render(app, {
	root: __dirname,
	layout: false,
	viewExt: 'html',
	cache: false,
	debug: false
});

io.attach(app);

io.on('connection', async (socket) => {
	socket.on('set', (data) => {
		lights[data.key] = data.value;
	});
	if (aa_address) {
		let rows = await db.query("SELECT amount_deposited_by_peer, amount_spent_by_me FROM aa_channels WHERE aa_channels.aa_address = ?", [aa_address]);
		socket.emit('upd_paid', rows[0].amount_spent_by_me);
	}
	console.error('connection');
});

Route.get('/', async (ctx, next) => {
	await ctx.render('index', {message: 'hey'})
});


app.use(Route.R());
app.listen(3001);