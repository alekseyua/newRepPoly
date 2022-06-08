import App from './App';
import React from 'react';
import { StaticRouter as Router, matchPath, Redirect, Route, Switch } from 'react-router-dom';
import express from 'express';
import ReactDOMServer from 'react-dom/server';
import { StoreContext } from 'storeon/react';
import { createStoreon } from 'storeon';
import Helmet from 'react-helmet';
import { PATHS } from './const';
import api from './api';
import { storeonParams } from './store';
import { determineUserLang, supportedLangs } from './i18n';
import webpush from 'web-push';


const cookieParser = require('cookie-parser');

const store = createStoreon(storeonParams);

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
console.log("process",'./manifest.json')

const document = require('global/document');

const server = express();

// for remote deployment set to build folder, otherwise use the public folder
const publicFolder = process.env.NODE_ENV==='production' ? process.env.RAZZLE_PUBLIC_DIR : process.env.RAZZLE_PUBLIC_DIR;
// NativeModules.ReactLocalization = {
//   language: 'en',
// };
const dummyDb = { subscription: null } //dummy in memory store
const saveToDatabase = async subscription => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription
}
// The new /save-subscription endpoint

server
  .disable('x-powered-by')
  .use(express.static(publicFolder))
  .use(express.static('public'))
  .use('/static', express.static(__dirname + '/public'))  
  .use(cookieParser())
  .get('/*', (req, res, next) => {
    global.document = document;
    global.document.cookie = req.headers.cookie;
    global.localStorage = { getItem: () => '' };
    global.window = {};
    const url = req.originalUrl;
    const query = req.query;
    const activeRoute = Object.entries(PATHS).find(([key, value]) => matchPath(url, value))[1];
    const auth_token = req.cookies[api.AUTH_TOKEN_KEY];
    const axiosParams = auth_token 
    ? {       
      headers: { Authorization: `Token ${auth_token}` } 
    } 
    : {};
    
   const lang = determineUserLang(req.acceptsLanguages(), req.path);
   let currentLangs = Object.keys(supportedLangs).filter((lang) => lang === url.split('/')[1]);
   let currentLang = currentLangs[0] ? currentLangs[0] : lang;
    api.setLanguage(currentLang);
    // let lang = "ru"
    // let currentLang='ru';
  //  currentLang= language
    const promise =
      activeRoute && activeRoute.fetchInitialData
        ? activeRoute.fetchInitialData(matchPath(url, activeRoute).params, query, axiosParams)
        : Promise.resolve();
    promise
      .then(initData => {
        const context = { initData, query };
         const markup = ReactDOMServer.renderToString(
          <StoreContext.Provider value={store}>
            <Router location={url} query={query} context={context}>
              <Switch>
                <Route path="/:locale">
                  <App lang={currentLang} />
                   {/* <BaseApp lang={currentLang}/> */}
                </Route>
                <Redirect to="/ru" />
              </Switch>
            </Router>
          </StoreContext.Provider>,
         );

         const helmet = Helmet.renderStatic();
         if (context.url) {
           res.redirect(context.url);
        } else {
           res.status(200).send(
            `<!doctype html>
            <html lang="${currentLang}">
              <head>
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta charset="utf-8" />

                  ${helmet.title.toString()}
                  ${helmet.meta.toString()}
                  ${helmet.link.toString()}
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  ${`<script>window.__INITIAL_DATA__ = ${JSON.stringify(initData)
                    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '')
                    .replace(/</g, '\\\u003c')}</script>`}
                  ${`<script>window.__initLang__ = ${JSON.stringify({
                    lang: currentLang,
                    defaultLang: lang,
                  })}</script>`}
        
                   ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
                  ${
                    process.env.NODE_ENV === 'production'
                      ? `<script src="${assets.client.js}" defer></script>`
                      : `<script src="${assets.client.js}" defer crossorigin></script>`
                  }
              </head>
              <body>
                  <div id="root">${markup}</div>
              </body>
            </html>`,
          );
        }
      })
      .catch((error) => {
        //  console.log(`error.response`, error.response);
        if (error?.response?.status === 401) {
          return res.status(200).send( `<!doctype html>
            <html lang="${currentLang}">
              <head>
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta charset="utf-8" />       
              </head>
              <style>
                .text__admin{
                  padding: 20px;
                  font-size:20px;
                  font-weight: 900;
                }
              </style>
                         
              <body>
                  <div id="root">
                  <div style="margin: 0 auto"; font-size:18px;>Continue ... 
                 
              <div class="text__admin">Администратором сайта был удалён Ваш аккаунт для продолжения пользования необходимо заново зарегистрироваться </div>
                  </div><button onClick="CookiesDelete()">продолжить</button>
                  </div>
              </body>
              <script>
              function CookiesDelete() {
                var cookies = document.cookie.split(";");
                for (var i = 0; i < cookies.length; i++) {
                  var cookie = cookies[i];
                  var eqPos = cookie.indexOf("=");
                  var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                  document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                window.location.reload();
                }
              }
              </script>  
            </html>`);
       }
        // console.log('res:', res)
        return res.status(500).send(`Возникла ошибка со стороны сервера, наши специалисты уже занимаются решением этой проблемы ${error.stack}, ${error}`);
      });
  })


export default server;


// function CookiesDelete() {
//   var cookies = document.cookie.split(";");
//   for (var i = 0; i < cookies.length; i++) {
//     var cookie = cookies[i];
//     var eqPos = cookie.indexOf("=");
//     var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//     document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
//     document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//   }
// }

// Ответ прост, хотя лежит не совсем на поверхности. Куки могут задаваться не только с помощью JavaScript, 
// но в и заголовках ответа сервера. И когда этот ответ приходит с флагом HttpOnly, 
// данная кука перестаёт быть доступной для изменения с помощью JavaScript. 
// Для удаления таких кук нужно либо лезть в настройки браузера и ручками их вычищать, 
// либо лезть на сервер и генерировать страницу с очисткой кук по HTTP-протоколу.

//                  <link rel="manifest" href="/manifest.json">