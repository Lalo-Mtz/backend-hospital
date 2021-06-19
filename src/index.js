require('dotenv').config();

// Modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Initializations
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Global Variables


// Routes
app.use('/doctor', require('./routes/doctor'));
app.use('/nurse', require('./routes/nurse'));
app.use('/staff', require('./routes/staff'));
app.use('/patient', require('./routes/patient'));
app.use('/authorization', require('./routes/authorization'));
app.use('/prescription', require('./routes/prescription'));

// Public

// Starting the Server
app.listen(app.get('port'), () => {
    console.log('Server on port:', app.get('port'));
});