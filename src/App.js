import { Route, Switch, useHistory } from 'react-router-dom';
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
import { ReactNotifications } from 'react-notifications-component';
import "react-notifications-component/dist/theme.css";
import React, {useCallback, useEffect, useState } from 'react';
import cogoToast from 'cogo-toast';
//the function to call the push server: https://github.com/Spyna/push-notification-demo/blob/master/front-end-react/src/utils/http.js
import {
  isPushNotificationSupported,
  registerServiceWorker,
  createNotificationSubscription,
  getUserSubscription,
  pushManager,

} from "./#lifehack/Notification/push-notifications";



const App = ({ lang, pageServer }) => {

  const { dispatch } = useStoreon();
  const { stateCountRestart } = useStoreon('stateCountRestart');
  const { updateCurrenssies } = useStoreon('updateCurrenssies');
  const { stateUpdateBalance } = useStoreon('stateUpdateBalance');
  const { warrningGoToPath } = useStoreon('warrningGoToPath');
  const history = useHistory();
  const { statusRequstOrderCountryPayment } = useStoreon('statusRequstOrderCountryPayment');
  const [notice, setNotice] = useState(null)
  

  
  api.setLanguage(lang);
  const { stateValuePoly } = useStoreon('stateValuePoly');
  let currency = getCookie(COOKIE_KEYS.CURRENCIES);
  let token = getCookie('ft_token');
  const deleteTag = (data) => data.replace(/<a.*?>|<\/a>/isg,''); 
  if(pageServer !== undefined){
    setCookie('id_profile',pageServer?.profile?.id)    
  }
  
  useEffect(()=>{
    warrningGoToPath?
      history.push(warrningGoToPath)
      : null
  },[warrningGoToPath])

  if (!!token){
    // useEffect(() => {
    //   if (isPushNotificationSupported()) {
    //     registerServiceWorker().then(() => {
    //     });
    //   }
    // }, []);
    // подписываемся
    useEffect(() => {
      // const getExixtingSubscription = async () => {
      //   const existingSubscription = await getUserSubscription();
      //   if(!!existingSubscription){
      //    await console.log('Вы подписаны на уведомления ') 
      //   }else{
      //    const subscribe = await createNotificationSubscription();
      //    await pushManager(subscribe)
      //   }
      // };
      // getExixtingSubscription();
  
    }, []);


// =========================================================================================

    useEffect(()=>{    
      if(navigator.serviceWorker){
        navigator.serviceWorker.addEventListener('message', event => {
          const {msg} = event.data
          setNotice(deleteTag(msg))
          });
      }
    },[])
    useEffect(() => {
      console.log(notice)
      // const timerNotice = setTimeout(() => {
        //changeStatusNotyIsNew(notice.id)
        if(notice !== null){
          const { hide } = cogoToast.success(notice, {
            position: 'top-right',
            bar: {
              size: '2px',
              style: 'dotted',
              color: '#с3с3'
            },
            heading: `Уведомление `,
            hideAfter: 90,
            // toastContainerID: v4(),
            onClick: (e) => {
              // changeStatusNotyIsNew(notice.id)
              // changeStatusNotyIsRead(notice.id)
              hide();
            }
          }
          );
        }
      // }, [3000])
      // return clearTimeout(timerNotice);
    }, [notice])
    //********************************************************************************* */ 

    useEffect(() => {
      api
        .cartApi
        .getCartData()
        .then(res => {
          dispatch('stateCountCart/add', res)
      })
        .catch(err =>{ 
          console.log("ERROR CONNECT!!!!", err);
          let errMessage = {
            path: null,
            success: null,
            fail : 'ошибка доступа к серверу, проверьте соединение',
          };
          dispatch('warrning/set',errMessage);
        }
        )
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
        .catch(err => {
          console.error(`ERROR BALANCE ${err}`)
          let errMessage = {
            path: null,
            success: null,
            fail : 'ошибка доступа к серверу, проверьте соединение',
          };
          dispatch('warrning/set',errMessage);
        })
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
          let errMessage = {
            path: null,
            success: null,
            fail : 'ошибка доступа к серверу, проверьте соединение',
          };
          dispatch('warrning/set',errMessage);
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
          let errMessage = {
            path: null,
            success: null,
            fail : 'ошибка доступа к серверу, проверьте соединение',
          };
          dispatch('warrning/set',errMessage);
        })

    }, [statusRequstOrderCountryPayment])

    //********************************************************************************* */ 

    //********************************************************************************* */ 

    //********************************************************************************* */ 

    //********************************************************************************* */ 

  }else{
    console.log('unregister service worker')
    //serviceWorker.unregister();
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
