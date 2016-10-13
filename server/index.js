/**
 * Created by rick on 2016/10/11.
 */

'use strict';

import express from 'express';
import webpack from 'webpack';
import path from 'path';
import open from 'open';
import bodyParser from 'body-parser';
import config from '../config';
import webpackDevConfig from '../webpack/webpack-dev';

const app = express();

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackDevConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackDevConfig.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}

app.use(bodyParser.json({strict: false}));
app.use(bodyParser.urlencoded({extended: false}));

app.set('views', path.join(config.baseDir, 'client'));
app.engine('html', require('swig').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(config.baseDir, 'dist')));

//page
app.get('/', (req, res) => {
  res.render('index');
});

//exception
app.get('/*', (req, res) => {
  res.redirect("/");
});

app.listen(config.port);

open(`http://localhost:${config.port}`);
