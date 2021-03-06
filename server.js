var express   = require('express');
var app         = express();
var bodyParser  = require('body-parser');

var mongoose    = require('mongoose');
var morgan = require('morgan');

var cors    = require('cors');

var compression = require('compression');

var CONFIG    = require('./config');

mongoose.Promise = Promise;

mongoose.Promise = global.Promise;
mongoose.Promise = require('bluebird');
//mongoose.connect('mongodb://10.7.0.3:27107/data/db');

// Override CONFIG variable for enabling or disabling testing 

CONFIG.isProductionEnvironment = false;
 
// Override CONFIG variable for enabling or disabling testing 
var port = process.env.PORT || CONFIG.APP_PORT; // App will run on port 3000

// connect to database
mongoose.connect( CONFIG.DB_CONN_STRING()); 

// use body parser so we can get info from POST request and/or URL parameters

app.use(compression());

app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json({limit: '50mb'}));

//app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// use cors to enable Cross Origin Resource Sharing - enable access from any domain/ip
app.use(cors());

//app.use('/api/beta/opm/pub/sub/subscription', require('./app/router/index_opm_pub_sub'));
app.use('/', require('./app/router/index'));
// opm Routing
// ---------------------------------------------------------
//app.use('/api/beta/opm', require('./app/router/index_opm'


app.options('*',cors());
//manual cors setup
app.use('/index.html',function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
// res.header("Access-Control-Allow-Methods", "GET");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});

//routing to home page
app.get('/',cors(), function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
   });
 
app.use("/", express.static(__dirname + "/public/"));


// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);

console.log('app listen on port'+port);
console.log(new Date());
