const mongoose = require('mongoose')
const MongoConfig = require('./MongoConfig');
const url = `mongodb+srv://${MongoConfig.host.dbUsername}:${MongoConfig.host.dbPassword}@${MongoConfig.host.cluster}/?retryWrites=true&w=majority`

module.exports.connect = async () => {
    mongoose.set('debug', true);
    console.log('Connecting to DB');

    if (mongoose.connection.readyState == 1) {

        console.log('Using old connection');

        return mongoose;
    }
    else {
        console.log('Creating new connection');
        await mongoose.connect(url, {
            dbName: MongoConfig.dbName
        });
        console.log(`New connection created  ${mongoose.connection.readyState}`);

        return mongoose;
    }

}

module.exports.close = async () => {


    if (mongoose.connection.readyState == 1) {

        console.log('Mongo Connection closed');

        mongoose.connection.close();

    }

}