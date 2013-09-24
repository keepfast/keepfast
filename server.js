var express = require('express'),
    path = require('path'),
    os = require('os'),
    http = require('http'),
    swig = require('swig'),
    cons = require('consolidate');

// apps
var profile = require('./entities/profiles'),
    pagespeed = require('./entities/pagespeeds'),
    pagestats = require('./entities/pagestats'),
    yslow = require('./entities/yslow'),
    schedule = require('./entities/schedules'),
    app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.static(path.join(__dirname, 'public')));
});

var psHasKey = (require('./conf/pagespeed').key !== 'YOUR_KEY_HERE');

//config templates
var TEMPLATE_PATH = path.join(__dirname, 'public/templates');

app.engine('.html', cons.swig);
app.set('view engine', 'html');

//config swig
swig.init({
    root: TEMPLATE_PATH,
    allowErrors: true
});

//define path default for views
app.set('views', TEMPLATE_PATH);

app.get('/', function (req, res) {
    res.render('index.html', { foo: 'bar', pagespeed: psHasKey });
});

// profile : crud
app.get('/profile', function (req, res) {
    res.render('profile.html', { pagespeed: psHasKey });
});

// profile : dashboard
app.get('/dashboard/:urlProfile', function (req, res) {
    res.render('dashboard.html', { urlProfile: req.params.urlProfile, pagespeed: psHasKey });
});

// profile : api
app.get('/profile.json', profile.findAll);
app.get('/profile/:id.json', profile.findById);
app.post('/profile', profile.addProfile);
app.put('/profile/:id', profile.updateProfile);
app.delete('/profile/:id', profile.deleteProfile);

// page-speed
app.get('/pagespeed.json', pagespeed.findAll);
app.get('/pagespeed/:id.json', pagespeed.findById);
app.get('/pagespeed/url/:url/all.json', pagespeed.findByURL);
app.post('/pagespeed', pagespeed.addPagespeed);
app.put('/pagespeed/:id', pagespeed.updatePagespeed);
app.delete('/pagespeed/:id', pagespeed.deletePagespeed);

// page-stats
app.get('/pagestats.json', pagestats.findAll);
app.get('/pagestats/:id/all.json', pagestats.findById);
app.get('/pagestats/date/:date/all.json', pagestats.findByDate);
app.get('/pagestats/url/:url/all.json', pagestats.findByURL);
app.post('/pagestats', pagestats.addPagestats);
app.put('/pagestats/:id', pagestats.updatePagestats);
app.delete('/pagestats/:id', pagestats.deletePagestats);

// yslow
app.get('/yslow.json', yslow.findAll);
app.get('/yslow/:id.json', yslow.findById);
app.get('/yslow/url/:url/all.json', yslow.findByURL);
app.post('/yslow', yslow.addYslow);
app.put('/yslow/:id', yslow.updateYslow);
app.delete('/yslow/:url', yslow.deleteYslow);

// schedule
app.post('/schedule', schedule.addSchedule);
app.post('/schedule/:url', schedule.removeSchedulesByURL);

//api docs
app.get('/api', function (req, res) {
    res.render('api.html', { pagespeed: psHasKey });
});

app.listen(3000);
console.log('Listening on port 3000...');
