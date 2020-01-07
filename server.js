'use strict';

const Hapi = require('hapi');
const Pino = require('hapi-pino');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
		request.logger.info('In handler %s', request.path);
        return 'Hello, INFO 6250!';
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: (request, h) => {
		request.logger.info('In handler %s', request.path);
        return 'Hello, ' + encodeURIComponent(request.params.name) + ', this is INFO 6250!';
    }
});

const init = async () => {

    await server.register(require('inert'));
	await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: false,
            logEvents: ['response']
        }
    });

    server.route({
        method: 'GET',
        path: '/song',
        handler: (request, h) => {
			request.logger.info('In handler %s', request.path);
            return h.file('./public/mysong.html');
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();