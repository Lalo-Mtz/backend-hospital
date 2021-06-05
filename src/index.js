require('dotenv').config();
const express = require('express');
const morgan = require('morgan');


// Initializations
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Global Variables


// Routes
app.use('/doctor', require('./routes/doctor'));
app.use('/nurse', require('./routes/nurse'));



// Public

// Starting the Server
app.listen(app.get('port'), () => {
    console.log('Server on port:', app.get('port'));
});