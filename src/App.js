import { Route, Switch, useHistory } from 'react-router-dom';
import { useStoreon } from 'storeon/react';
import Combine from './pages/Combine';
import { PATHS, DEFAULT_CURRENCIES, ONE_YEARS, COOKIE_KEYS, ROLE } from './const';
import { IntlProvider } from 'react-intl';
import locales from './locales';
import api from './api';
import { checkLocalStorage, getCookie, setCookie } from './utils';

import '/node_modules/swiper/swiper.scss';
import '/node_modules/video-react/dist/video-react.css';
import '@garpix/garpix-web-components/dist/garpix-web-components/garpix-web-components.css';
import './styles/index.scss';
import { ReactNotifications } from 'react-notifications-component';
import "react-notifications-component/dist/theme.css";
import React, {useEffect, useState } from 'react';
import cogoToast from 'cogo-toast';




const App = ({ lang, pageServer }) => {

  const { dispatch } = useStoreon();
  const { stateCountRestart } = useStoreon('stateCountRestart');
  const { updateCurrenssies } = useStoreon('updateCurrenssies');
  const { stateUpdateBalance } = useStoreon('stateUpdateBalance');
  const { warrningGoToPath } = useStoreon('warrningGoToPath');
  const {notificationCount} = useStoreon('notificationCount');

  const history = useHistory();
  const { statusRequstOrderCountryPayment } = useStoreon('statusRequstOrderCountryPayment');
  const [notice, setNotice] = useState(null)
  api.setLanguage(lang);
  const { stateValuePoly } = useStoreon('stateValuePoly');
  let currency = getCookie(COOKIE_KEYS.CURRENCIES);
  let token = getCookie('ft_token');
  const [stateStatus, setStateStatus] = useState(null)
  const deleteTag = (data) => data.replace(/<a.*?>|<\/a>/isg,'');

  if(pageServer !== undefined){    
    dispatch('statuStorage/set',pageServer?.profile?.status)
    setCookie('id_profile',pageServer?.profile?.id)    
  }
  
  useEffect(()=>{
    warrningGoToPath?
      history.push(warrningGoToPath)
      : null
  },[warrningGoToPath])

  useEffect(()=>{
    if(pageServer?.profile?.role === ROLE.UNREGISTRED){
        setTimeout(()=>{
          if(!(checkLocalStorage('tourReg1') || checkLocalStorage('tour'))){
              return setNotice('Мы всегда на связи! Администратор будет сообщать Вам о любых изменениях в заказах, через уведомления на сайте')
          } 
        },500)
    }
  },[])

  useEffect(()=>{
    setStateStatus(pageServer?.profile?.status)
  },[pageServer])

  // useEffect(()=>{
  //   if( pageServer?.profile?.role !== ROLE.RETAIL || pageServer?.profile?.role !== ROLE.UNREGISTRED ){
  //     console.log('request active user 1', pageServer?.profile?.status)
  //     const timer = setInterval(()=>{
  //       console.log('request active stateStatus 2', stateStatus)
  //       if(stateStatus === 1){
  //         const params = {0: `/${window.location.pathname}`}
  //         api
  //           .updatePage(params)
  //           .then(res=>{
  //           console.log('res:', res.page)
  //           const result = {
  //             pageServer,
  //             ...res.page
  //           }
  //           console.log('result:', result)
  //           setStateStatus(res.page.profile.status)
  //           setUpdateData(result)
  //           let errMessage = {
  //             path: '/profile',
  //             success: 'Администратором было активирована учётнач запись',
  //             fail : null,
  //           };
  //           dispatch('warrning/set',errMessage);
  //           })
  //           .catch(err=>console.log('err update'))
  //       }
  //     // return clearInterval(timer);
  //     },2000)
  //   }
  // },[pageServer])

  useEffect(() => {
    console.log('notice------',notice)
      if(notice !== null){
       const { hide } = cogoToast.success(notice, {
          position: 'top-center',
          heading: `Уведомление `,
          hideAfter: 90,
          onClick: (e) => hide()
        }
        );
        if(pageServer.profile.role !== ROLE.UNREGISTRED){
          dispatch('stateUpdateBalance/update', !stateUpdateBalance)
        }
        setNotice(null)
      }
  },[notice]) 

  if (!!token){
// =========================================================================================

    useEffect(()=>{
      if (navigator.serviceWorker){
          const  listener =  event => {
            console.log('event: снаружи 1', event)
            if (event.data && event.data.type === 'SKIP_WAITING') {
              console.log('event: внутри 2', event)            
              self.skipWaiting();
            }
            const {msg} = event.data
            console.log('msg : 1', msg)
            setNotice(msg)
            }
          navigator.serviceWorker.addEventListener('message', listener)

          return removeEventListener('message', listener);
      }
    },[])
    
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
      stateUpdateBalance,
      notificationCount
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
    // console.log('unregister service worker')
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
