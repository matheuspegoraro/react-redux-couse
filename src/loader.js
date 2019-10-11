const app = require('./config/app');

require('./config/database');
require('./config/routes')(app);