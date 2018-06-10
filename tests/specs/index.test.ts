import { startServer } from '../../mock/serve/index';
import { Server } from 'http';
import { variables } from './global';
import { AddressInfo } from 'net';

let server: Server;
before(async function() {
    try {
        server = await startServer();
    } catch (error) {
        console.error(error.message, error.stack);
        process.exit(-1);
    }
    variables.server.host = `http://127.0.0.1:${
        (server.address() as AddressInfo).port
    }`;
});

after(function(done) {
    console.log('closing server');
    server.close(() => {
        console.log('server closed');
        done();
    });
});
