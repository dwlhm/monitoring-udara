// import aedes library
const aedes = require('aedes')()
// create server based on aedes configuration
const server = require('net').createServer(aedes.handle)
// define used port for running aedes
const port = 1883 
// run the server
server.listen(port, () => {
    console.info(`Broker running! - localhost:${port}`)
})

// authentication logic
