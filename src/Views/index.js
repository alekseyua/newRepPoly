
import React, { useState, useCallback, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import Footer from '../components/Footer';
import classNames from 'classnames';
import VidjetChatComponent from '../components/VidjetChatComponent';
import ButtonScrollTopComponent from '../components/ButtonScrollTopComponent';
import { useStoreon } from 'storeon/react';
import Modal from '../Views/ModalCreator';
import ModalPreviewFile from './ModalContentViews/ModalPreviewFile';
import Cookie from './Cookie/Cookie';


// import { Steps, Hints } from 'intro.js-react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import "intro.js/themes/introjs-dark.css";

// import { Document, Page } from 'react-pdf/dist/esm/entry.parcel';
//import { Document, Page } from 'react-pdf';
//  import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import { checkLocalStorage, getCookie } from '../utils';


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
let { profile } = userPage;
const [modalStates, setModalStates] = useState(Modal.defaultModalStates);
const [ timerViewTour, setTimerViewTour ] = useState(false);

    const [isPaused, setIsPaused] = useState(false);
    const [data, setData] = useState(null);
    const [status, setStatus] = useState("");
    const ws = useRef(null);

    // useEffect(() => {
    //     if (!isPaused) {
     //         ws.current = new WebSocket(socketUrl); // создаем ws соединение
    //         ws.current.onopen = () =>{ 
    //           ws.current.send(options);
    //           setStatus("Соединение открыто");}  // callback на ивент открытия соединения
    //         ws.current.onclose = () => setStatus("Соединение закрыто"); // callback на ивент закрытия соединения

    //         gettingData();
    //     }

    //     return () => ws.current.close(); // кода меняется isPaused - соединение закрывается
    // }, [ws, isPaused]);

    // const gettingData = useCallback(() => {
    //     if (!ws.current) return;

    //     ws.current.onmessage = e => {                //подписка на получение данных по вебсокету
    //         if (isPaused) return;
    //         const message = JSON.parse(e.data);
    //         setData(message);
    //     };
    // }, [isPaused]);

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
      console.log('onExit', state)
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

const heandlerKey = () => {
  console.log('check work click',getCookie('ft_token'))
  dispatch('spinner');

}

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
        // console.log('props:', props)
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
         {/* <button
          onClick={heandlerKey}
          style={{
            border: '1px solid red',
            padding: '5px',
            margin: '10px',
            cursor: 'pointer',
          }}
         >get key</button> */}
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