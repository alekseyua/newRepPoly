import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useStoreon } from 'storeon/react';
import Combine from './pages/Combine';
import { PATHS, DEFAULT_CURRENCIES, ONE_YEARS, COOKIE_KEYS } from './const';
import { IntlProvider } from 'react-intl';
import locales from './locales';
import api from './api';
import { getCookie, setCookie } from './utils';

import '/node_modules/swiper/swiper.scss';
import '/node_modules/video-react/dist/video-react.css';
import '@garpix/garpix-web-components/dist/garpix-web-components/garpix-web-components.css';
import './styles/index.scss';
import { array } from 'yup';
import { fakeServer } from 'cypress/types/sinon';

const App = ({ lang, pageServer, ...props }) => {
  const notifications = pageServer?.notifications;
  console.log('notifications:', notifications)
  const { dispatch } = useStoreon();
  const { stateCountRestart } = useStoreon('stateCountRestart');
  const { updateCurrenssies } = useStoreon('updateCurrenssies');
  const { stateUpdateBalance } = useStoreon('stateUpdateBalance');
  const [listNotification, setListNotification] = useState(null);
  const [countNotification, setCountNotification] = useState(null);

  const { statusRequstOrderCountryPayment } = useStoreon('statusRequstOrderCountryPayment');

  



  // в диспач закидываем все функуии
  const apiProfile = api.profileApi;
  
  api.setLanguage(lang);
  const { stateValuePoly } = useStoreon('stateValuePoly');
  let currency = getCookie(COOKIE_KEYS.CURRENCIES);
  let token = getCookie('ft_token');

  { if ( notifications !== undefined){
     apiProfile
          .getNotifications()
          //.postNotificationsReed()
          .then(res=>{
           // console.log('res:', res)          
          setListNotification(res.results)
          })
    }
  }



  if (!!token){

    useEffect(()=>{
      setCountNotification(prev => {
        console.log(prev)
        console.log('notifications:', notifications)
        if(prev !== notifications) return notifications;
      })
    },[notifications])

    //********************************************************************************* */ 
    useEffect(() => {
      api
        .cartApi
        .getCartData()
        .then(res => {
          dispatch('stateCountCart/add', res)
      })
        .catch(err => console.log("ERROR CONNECT!!!!", err))
    }, [stateCountRestart, updateCurrenssies])
    // consollis.log('stateValuePoly.stateCart**********', stateValuePoly.stateCart);

    //********************************************************************************* */ 

    useEffect(() => {
      api
        .getUserBalance({
          "currency": currency
        })
        .then(res => {
          dispatch('dataBalance/set', res)
          dispatch('stateValuePoly/change', {
            stateCurrency: false,
            statePayment: false,
          })
          // setBalance(res)
        })
        .catch(err => console.error(`ERROR BALANCE ${err}`))
    }, [
      updateCurrenssies,
      stateValuePoly.statePayment,
      stateUpdateBalance
    ])

    //********************************************************************************* */ 
    useEffect(() => {
      api
        .profileApi
        .getWishlist()
        .then((res) => {
          dispatch('stateCountWish/add', res);
        })
        .catch((err) => { 
          console.log('ERROR getWishList');
        })
    }, [])
    //********************************************************************************* */ 
    useEffect(() => {

      api
        .orderApi
        .getCountry()
        .then(res => {
          dispatch('orderCountryPayment/add', res)
        })
        .catch(err => {
          console.error(`ERROR ${err}`);
        })

    }, [statusRequstOrderCountryPayment])

    //********************************************************************************* */ 
    useEffect(()=>{
      const countCookieNotification = getCookie('notifications');
      console.log('countCookieNotification:', countCookieNotification)
      
      function notifyMe () {
        // console.log('увидомление отправлено',listNotification.length)
        var notification = new Notification ("Все еще работаешь?", {
          tag : "ache-mail",
          body : "Пора сделать паузу и отдохнуть",
          icon : "https://itproger.com/img/notify.png"
        });
      }
      
      //function notifSet 

      (() => {
        if (!("Notification" in window))
          alert ("Ваш браузер не поддерживает уведомления.");
        else if (Notification.permission === "granted")
          setTimeout(notifyMe, 2000);
        else if (Notification.permission !== "denied") {
          Notification.requestPermission (function (permission) {
            if (!('permission' in Notification))
              Notification.permission = permission;
            if (permission === "granted")
              setTimeout(notifyMe, 2000);
          });
        }
        setCookie('notifications',notifications);
      })()
  
    }, [notifications])

    //********************************************************************************* */ 

    //********************************************************************************* */ 

    //********************************************************************************* */ 

    //********************************************************************************* */ 
  }
  useEffect(() => {
    if (!currency) {
      //сохраняем в куки текущую валюту
      setCookie(COOKIE_KEYS.CURRENCIES, DEFAULT_CURRENCIES, ONE_YEARS);
      // обращаемся к функции currenssies/update и меняем состояние DEFAULT_CURRENCIES: "USD"
      dispatch('currenssies/update', DEFAULT_CURRENCIES);
    } else {
      dispatch('currenssies/update', currency); 
    }
  }, [currency]);
  //********************************************************************************* */ 

  // console.log('+++IntlProvider+++ RENDER',stateValuePoly);
  return (
    <IntlProvider
      locale={lang}
      messages={locales[lang]}
      defaultLocale="ru"
    >
      <Switch>
        <Route
          path={PATHS.ALL.path}
          render={(props) => <Combine {...props} {...PATHS.ALL} />}
        />
      </Switch>
    </IntlProvider>
  );
}

export default React.memo(App);
