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
import { ReactNotifications, Store } from 'react-notifications-component';
import "react-notifications-component/dist/theme.css";


const App = ({ lang, pageServer, ...props }) => {
  const notifications = pageServer?.notifications;
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

  const pushNotification = () =>{
    const countCookieNotification = +getCookie('notifications');

    //`************браузерные функции увидомления********************
    const deleteTag = (data) => data.replace(/<a>|<\/a>/isg, '');
    const notifSet = (message) => {
      if (!("Notification" in window))
        alert ("Ваш браузер не поддерживает уведомления.");
      else if (Notification.permission === "granted")
        setTimeout(notifyMe(message), 2000);
      else if (Notification.permission !== "denied") {
        Notification.requestPermission (function (permission) {
          if (!('permission' in Notification))
            Notification.permission = permission;
          if (permission === "granted")
            setTimeout(notifyMe(message), 2000);
        });
      }
      setCookie('notifications',notifications);
    }    
    const notifyMe = (message) => {  
      var notification = new Notification ("Увидомление", {
        // tag : "ache-mail",
        body : message,
        icon : "./images/logo/logo.svg"
      });
    }
    //`**************реакт функции увидомления********************
    const myNotification = (message) => {
      return (
        <div style={{
          // display: 'flex',
          // backgroundColor: '#c3c3c3',
          // borderRadius: 5,
          // position: 'absolute',
           zIndex: 9999,
        }}>
          {/* <AlligatorAvatar/> */}
          <div>
            <h4>Увидомление!!!</h4>
            <p>{message}</p>
          </div>
        </div>
      )
    }

    //`*****************************************************************

    apiProfile
    .getNotifications()
    .then(res=>{
      const newRes = res.results.map(el=>({
        ...el, message: deleteTag(el.message)
      })) 
      console.log('res:', newRes) 
      if (countCookieNotification !== res.count){
        //notifSet(message.message) // браузерные увидомления
        newRes.map(message=>{
           //const timer = setInterval(() => {
             const textMessage = message.message;
             console.log({textMessage})

              Store.addNotification({
                // content: ()=>myNotification(message.message),
                title: "Увидомление",
                id: message.id,
                message: 'ddddd',
                // message: newRes.map(message=>{message.message}),
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: { duration: 5000 },
                dismissable: { 
                  click: true, 
                  onScreen: true,
                },
                slidingExit: {
                  duration: 800,
                  timingFunction: 'ease-out',
                  delay: 0
                }
              })
              // return ()=>clearInterval(timer);
            // },2000)
          })      
      }
    })
    console.log({
      countCookieNotification,
      notifications
    })

    return console.log('not new notification ')
  }


  if (!!token){

    useEffect(()=>{
      setCountNotification(prev => {
        console.log(prev)
        console.log('notifications:', notifications)
        if(prev !== notifications) return notifications;
      })
    },[])

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
    //const [ arrNotifications, setArrNotifications ] = useState([]);
    useEffect(()=>{
     return pushNotification();
  
    }, [])

    //********************************************************************************* */ 
    useEffect(()=>{    
      const eventBlur = () => pushNotification();
      window.addEventListener('blur', eventBlur);
      return () => window.removeEventListener('blur',eventBlur);
    },[])
  
    useEffect(()=>{    
      const eventBlur = () => pushNotification();
      window.addEventListener('focus', eventBlur);
      return () => window.removeEventListener('focus',eventBlur);
    },[])
    //********************************************************************************* */ 

    //********************************************************************************* */ 

    //********************************************************************************* */ 
  console.log('notifications:', notifications)

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
      <ReactNotifications />
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
