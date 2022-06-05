import { useState, useEffect } from "react";
import api from "../../api";
//the function to call the push server: https://github.com/Spyna/push-notification-demo/blob/master/front-end-react/src/utils/http.js

import {
  isPushNotificationSupported,
  askUserPermission,
  registerServiceWorker,
  createNotificationSubscription,
  getUserSubscription,
  loadVersionBrowser,
} from "./push-notifications";
//import all the function created to manage the push notifications

// const pushNotificationSupported = isPushNotificationSupported();
//first thing to do: check if the push notifications are supported by the browser

export default function usePushNotifications() {
  const [userConsent, setSuserConsent] = useState();
  //to manage the user consent: Notification.permission is a JavaScript native function that return the current state of the permission
  //We initialize the userConsent with that value
  const [userSubscription, setUserSubscription] = useState(null);
  //to manage the use push notification subscription
  const [pushServerSubscriptionId, setPushServerSubscriptionId] = useState();
  //to manage the push server subscription
  const [error, setError] = useState(null);
  //to manage errors
  const [loading, setLoading] = useState(true);
  //to manage async actions

  // регим СВ
  useEffect(() => {
    setSuserConsent(Notification.permission)
    if (isPushNotificationSupported()) {
      setLoading(true);
      setError(false);
      registerServiceWorker().then(() => {
        setLoading(false);
      });
    }
  }, []);
  //if the push notifications are supported, registers the service worker
  //this effect runs only the first render
  // подписываемся
  useEffect(() => {
    setLoading(true);
    setError(false);
    const getExixtingSubscription = async () => {
      const existingSubscription = await getUserSubscription();
      console.log('!!existingSubscription',!!existingSubscription)
      if(!!existingSubscription){
       await console.log('Вы подписаны на уведомления ') 
      }else{
       const subscribe = await createNotificationSubscription();
       await pushManager(subscribe)
      }
      setUserSubscription(existingSubscription);

      setLoading(false);
    };
    getExixtingSubscription();

  }, []);
  //Retrieve if there is any push notification subscription for the registered service worker
  // this use effect runs only in the first render

  /**
   * define a click handler that asks the user permission,
   * it uses the setSuserConsent state, to set the consent of the user
   * If the user denies the consent, an error is created with the setError hook
   */
  const onClickAskUserPermission = () => {
    setLoading(true);
    setError(false);
    askUserPermission().then(consent => {
      setSuserConsent(consent);
      if (consent !== "granted") {
        setError({
          name: "Consent denied",
          message: "You denied the consent to receive notifications",
          code: 0
        });
      }
      setLoading(false);
    });
  };
  //

  /**
   * define a click handler that creates a push notification subscription.
   * Once the subscription is created, it uses the setUserSubscription hook
   */
  const onClickSusbribeToPushNotification = () => {
    setLoading(true);
    setError(false);
    createNotificationSubscription()
      .then(function(subscrition) {
        setUserSubscription(subscrition);
        setLoading(false);
      })
      .catch(err => {
        console.error("Couldn't create the notification subscription", err, "name:", err.name, "message:", err.message, "code:", err.code);
        setError(err);
        setLoading(false);
      });
  };

  /**
   * define a click handler that sends the push susbcribtion to the push server.
   * Once the subscription ics created on the server, it saves the id using the hook setPushServerSubscriptionId
   */
  const onClickSendSubscriptionToPushServer = async () => {
    setLoading(true);
    setError(false);
    // await pushManager();
    // api.profileApi
    // .gettNotificationsServiceWorker(userSubscription)
    // .then(response=>{
    //   setPushServerSubscriptionId(response.id);
    //     setLoading(false);
    // })
    // .catch(err=>{
    //   console.error(err)
    //   setLoading(false);
    //     setError(err);
    // });

    // http
    //   .get("https://back.ftownpl.com/api/v1/ajax/device/wp/", userSubscription)
    //   .then(function(response) {
    //     setPushServerSubscriptionId(response.id);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     setLoading(false);
    //     setError(err);
    //   });
  };

  /**
   * define a click handler that request the push server to send a notification, passing the id of the saved subscription
   */
  const onClickSendNotification = async () => {
    setLoading(true);
    setError(false);
    
    // await 
    
    // http.get(`/subscription/${pushServerSubscriptionId}`).catch(err => {
    //   setLoading(false);
    //   setError(err);
    // });
    // setLoading(false);
  };

  /**
   * returns all the stuff needed by a Component
   */



  async function pushManager(subscribe) {
      var endpointParts = subscribe.endpoint.split('/');
      var registration_id = endpointParts[endpointParts.length - 1];
      const browser = loadVersionBrowser();
      var data = {
        'browser': browser.name.toUpperCase(),
        'p256dh': btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('p256dh')))),
        'auth': btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('auth')))),
        'name': 'XXXXX',
        'registration_id': registration_id,
      };
      console.log('----------------подписываемся на указаный сервер----------------')
        const response = await saveSubscription(data)
  }
  
  async function saveSubscription(data) {
      console.log('                     Делаем запрос на сервер                          ')
     await api.profileApi
            .gettNotificationsServiceWorker(data)
            .then(res=>{
              console.log('----------------------------------------------------------------')
              console.log(`      --------------подписка прошла успешно---------------      `)
              console.log('----------------------------------------------------------------')
            })
            .catch(err=>console.error(err))
  }
  return {
    onClickAskUserPermission,
    onClickSusbribeToPushNotification,
    onClickSendSubscriptionToPushServer,
    pushServerSubscriptionId,
    onClickSendNotification,
    userConsent,
    userSubscription,
    error,
    loading
  };
}
