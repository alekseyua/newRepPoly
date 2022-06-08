
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import Footer from '../components/Footer';
import classNames from 'classnames';
import VidjetChatComponent from '../components/VidjetChatComponent';
import ButtonScrollTopComponent from '../components/ButtonScrollTopComponent';
import { useStoreon } from 'storeon/react';
import Modal from '../Views/ModalCreator';
import Cookie from './Cookie/Cookie';

import introJs from 'intro.js';
import 'intro.js/introjs.css';
import "intro.js/themes/introjs-dark.css";

import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import { checkLocalStorage, getCookie } from '../utils';
import ModalContentViews from '../Views/ModalContentViews';
import { Formik } from 'formik';
import { GxForm } from '@garpix/garpix-web-components-react';
import cogoToast from 'cogo-toast';
import ModalPreviewFile from './ModalContentViews/ModalPreviewFile';
import api from '../api'

import {PUSH_SERVER_PUBLICK_KEY} from '../const';
import {urlB64ToUint8Array, subscribeUser, pushManager} from '../#lifehack/Notification/push-notifications';


const Layout = ({
  headerModClosed = false,
  main = false,
  responsive = false,
  children,
  title = 'Main title',
  description = '',
  main_menu,
  cabinet_menu, 
  header_menu,
  footer_menu,
  announce,
  site_configuration,
  role_configuration,
  currencies,
  year,
  policy,
}) => {
const { userPage, dispatch } = useStoreon('userPage');
const { stateCountCart } = useStoreon('stateCountCart')
const { notice } = useStoreon('notice');

let { profile } = userPage;
const [modalStates, setModalStates] = useState(Modal.defaultModalStates);
const [ timerViewTour, setTimerViewTour ] = useState(false);


const ws = useRef(null);
const [isPaused, setIsPaused] = useState(false);
const [data, setData] = useState([]);
const [statusSocket, setStatusSocket] = useState("");



     const initialStateIntro = {
      // stepsEnabled: true,
      // initialStep: 0,
      steps: [
        {
          element: '[dataintro="step1"]',
          title: "здесь назовём наш слайд",
          intro: "Вот так будет выглядит инструкция для знакомства с сайтом",
          position: 'bottom-right-aligned',
          highlightClass: 'myHighlightClass',
        },
  
        {
          element: '[dataintro="step2"]',
          title: "сдесь ещё както назавём наш слайд",
          intro: <div><img
                  width="100%"
                  alt="pattern"
                  src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp"
                ></img>
                <p>здесь мы раскажем про выбор валюты</p>
                </div>
        },

        {
          element: '[dataintro="step3"]',
          intro: "Вот сдесь мы можем расказать что будет делать эта кнопка, и слайд к примеру без названия",
          position: 'top',
        },

      ],
      // disableInteraction: true,
      //hintsEnabled: true,
      // hints: [
      //   {
      //     element: '[data-py-id="step3"]',
      //     hint: "Hello hint",
      //     hintPosition: "middle-right"
      //   }
      // ]
    }
  
    const [state, setState] = useState({});
    useEffect(()=>{
      // const timerView = setTimeout(()=>{
        const tourFromsite = () => {
          introJs().setOptions({
            steps: [
              {
                element: '[dataintro="step1"]',
                title: "здесь назовём наш слайд",
                intro: "Вот так будет выглядит инструкция для знакомства с сайтом",
                position: 'bottom-right',
                highlightClass: 'dataintro-step1',
              },
        
              {
                element: '[dataintro="step2"]',
                title: "сдесь ещё както назавём наш слайд",
                intro: `<div><img
                        width="100%"
                        alt="pattern"
                        src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp"
                      ></img>
                      <p>здесь мы раскажем про выбор валюты</p>
                      </div>`,
                highlightClass: 'dataintro-step2',
              },
      
              {
                element: '[dataintro="step3"]',
                intro: "Вот сдесь мы можем расказать что будет делать эта кнопка, и слайд к примеру без названия",
                position: 'top',
                highlightClass: 'dataintro-step3',

              },
      
            ],
            overlayOpacity: 0.5,
            // dontShowAgain: true,
           

          }).onbeforeexit(function () {
            let questions = confirm("Ещё будете  знакомится с сайтом? В ЛК можно изминить статус");
            if(!!questions){
              return localStorage.setItem('tour',false)
            }
            return

          }).start();
        }  
        
        if(checkLocalStorage('tour')){
          if( JSON.parse(localStorage.getItem('tour').toLowerCase()) ){
            return  tourFromsite();
          }
          return
        } else {
          tourFromsite();
        }
      
      // },4000);
      // return () => clearTimeout(timerView);
    },[])

    const {
      stepsEnabled,
      steps,
      initialStep,
      hintsEnabled,
      hints
    } = state;
  
    const onExit = () => {
      setState(() => ({ 
        ...state,
        stepsEnabled: false 
      }));
    };

    useEffect(()=>{
      dispatch('modal/update', {
        show: false,
        content: null,
        addClass: false,
      });
    },[])

if ( profile === undefined ){
     window.location.reload()
}
  const cabinet_data = {
    cart: stateCountCart.in_cart,
    notifications: profile.notifications
  };
  const mainClassModufy = classNames({
    main: main,
    responsive: responsive,
  });

  const closeModal = () => {
    dispatch('modal/update', {
      show: false,
      content: null,
      addClass: false,
    });
  };
   
  const openModalFeedbackReedFile = (file) => { 
   
    const renderPage = (props) => {
        return (
            <>
                {props.canvasLayer.children}
                <div style={{ userSelect: 'none' }}>{props.textLayer.children}</div>
                {props.annotationLayer.children}
            </>
        );
    };

    dispatch('modal/update', {
      show: true,
      addClass: 'modal-file_views',
      content: (
              <ModalPreviewFile closeModal={closeModal}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456 /build/pdf.worker.min.js">
                    <div id="pdfviewer">
                      <Viewer 
                        fileUrl={`${file}`}
                        renderPage={renderPage}
                        defaultScale = {'PageWidth'}
                        theme={{
                          theme: 'dark',
                        }}
                        httpHeaders={{
                          Authorization: `Token ${getCookie('ft_token')}`,
                        }}
                        withCredentials={true}
                      />
                    </div>
                </Worker>
              </ModalPreviewFile>
        )
    })
  }


  const [statePushMamager, setStatePushManager] = useState(false)
  const options = {
    userVisibleOnly: true,
    applicationServerKey: PUSH_SERVER_PUBLICK_KEY,
  };
  //===============================================================================
  const heandlerKeyOn = async () => {

      const permissionNotice = await permission();
      if (permissionNotice !== 'denied') {
       const resSubscribe = await subscribePush();
       console.log({resSubscribe})
       if (!!resSubscribe) setStatePushManager(false)
      }      

  };
  const heandlerKeyOff = () => {
    const getSubscribeNotice = async () =>{
      try {
        const readyWork = await navigator.serviceWorker.ready
        const subscribe = await readyWork.pushManager.getSubscription();
        console.log('subscribe', !!subscribe)
        const unsubscribe = await subscribe.unsubscribe()
          console.log({unsubscribe})
          if (!!subscribe) {
            setStatePushManager(false)
          }else{
            setStatePushManager(true)
          }
        }catch(e){
          console.error(`Ошибка: ${e.name} = ${e.message}`);
        }
      }
      getSubscribeNotice()
  };

  async function permission (){
    try{
      const workerContainerInstance = await navigator.serviceWorker.getRegistration();
      return await workerContainerInstance.pushManager.permissionState(options)
    }
    catch(e){
      console.error(`Ошибка: ${e.name} = ${e.message}`);
    }
  }
  async function subscribePush(){
    try{
      const workerContainerInstance = await navigator.serviceWorker.getRegistration();
      console.log({workerContainerInstance})
      if (workerContainerInstance !== undefined){
        subscribeUser(workerContainerInstance)
      }
    }
    catch(e){
      console.error(`Ошибка: ${e.name} = ${e.message}`);
    }
  }

  useEffect(()=>{
    setStatePushManager(true)
    // const getSubscribeNotice = async () =>{
    // const readyWork = await navigator.serviceWorker.ready
    // const subscribe = await readyWork.pushManager.getSubscription();
    // console.log('subscribe', !!subscribe)
    //   if (!!subscribe) {
    //     setStatePushManager(false)
    //   }else{
    //     setStatePushManager(true)
    //   }
    // }
    // getSubscribeNotice()
  },[])

  useEffect(() => {
    // console.log('sheck render page header')
    // const subscribePush = async () => {
    //   const permissionNotice = await permission();
    //   if (permissionNotice !== 'denied') {
    //    const resSubscribe = await subscribe();
    //    if (!!resSubscribe) setStatePushManager(false)
    //   }      
    // }

    // console.log('statePushMamager', statePushMamager)

    // if (statePushMamager) {
    //   console.log('gogogogogogo')
    //   setTimeout(()=>subscribePush,3000)
    // }
  }, [statePushMamager])

  //===============================================================================



  return (
    <>
    
      <Header
        headerModClosed={headerModClosed}
        header_menu={header_menu}
        main_menu={main_menu}
        site_configuration={userPage.site_configuration}
        announce={announce}
        cabinet_data={cabinet_data}
        profile={profile}
        cabinet_menu={cabinet_menu} 
        currencies={currencies}
      />
      {/* <button onClick={heandlerKeyOn}> Включить уведомления</button>
      <button onClick={heandlerKeyOff}>Выключить уведомления</button> */}

      <Helmet>
        <title>{title}</title>
        {/* <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />   */}
        <meta name="description" content={description} />
      </Helmet>
      <main className={mainClassModufy}>
        <Modal.ModalCreator {...modalStates} setModalStates={setModalStates} />
        <Modal.StorControllerModal />
        <VidjetChatComponent />
        {children}
       <ButtonScrollTopComponent/>
      </main>
      <Footer
        year={year}
        policy_1={site_configuration?.public_offer_1}
        policy_2={site_configuration?.public_offer_1}
        footer_menu={footer_menu}
        role_configuration={role_configuration}
        site_configuration={site_configuration}
        profile={profile}
        openModalFeedbackReedFile={openModalFeedbackReedFile}
      />

      <Cookie openModalFeedbackReedFile={openModalFeedbackReedFile} policy={site_configuration.policy}/>
    </> 
  );
};


export default React.memo(Layout)