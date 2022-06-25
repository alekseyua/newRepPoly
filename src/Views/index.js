
import React, { useState, useEffect, useRef, useCallback} from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import Footer from '../components/Footer';
import classNames from 'classnames';
import VidjetChatComponent from '../components/VidjetChatComponent';
import ButtonScrollTopComponent from '../components/ButtonScrollTopComponent';
import { useStoreon } from 'storeon/react';
import Modal from '../Views/ModalCreator';
import Cookie from './Cookie/Cookie';
import {ROLE} from '../const';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import "intro.js/themes/introjs-modern.css";
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import { checkLocalStorage, getCookie } from '../utils';
import ModalPreviewFile from './ModalContentViews/ModalPreviewFile';
import { useHistory } from 'react-router-dom';
import api from '../api';


const Layout = ({...props}) => {
const {headerModClosed = false,
  main = false,
  responsive = false,
  children,
  title = 'Main title',
  description = '',
} = props;
const { userPage, dispatch } = useStoreon('userPage');
const { stateCountCart } = useStoreon('stateCountCart')
let { profile } = userPage;
const history = useHistory()
const {role, id} = profile;
const [modalStates, setModalStates] = useState(Modal.defaultModalStates);
const [contentPage, setContentPage] = useState(props);
// ******************************************************************************
const urlChatItem = `wss://back.ftownpl.com:8443/ws/notifications/${id}/?token=$${getCookie('ft_token')}`;
const ws = useRef(null);
const [isState, setIsState] = useState(false);
useEffect(() => {
  if ( role !== ROLE.UNREGISTRED){
    const newWS = () => {
      ws.current = new WebSocket(urlChatItem); // создаем ws соединение
    } 
    if(!!getCookie('ft_token')){
      newWS()
      ws.current.onopen = () =>{                  
        setIsState(!isState)
        gettingData();
      }
      ws.current.onclose = () => {
        setTimeout(newWS(),3000);
        setIsState(!isState)        
      }
    }
    return () => {
      const fd = new FormData()
      fd.set('disconnect', true)
      ws.current.send(fd);
      ws.current.close(); // кода меняется isState - соединение закрывается
    }
  }
}, [ws]);

const gettingData = useCallback(() => {
  if (!ws.current) return;    
  ws.current.onmessage = e => {                //подписка на получение данных по вебсокету
    const message = JSON.parse(e.data);
    if(message?.notifications !== undefined){
      dispatch('notification/set', message?.notifications)
    }
    if(message?.notification !== undefined){
      dispatch('notificationCount/update', 1); //message?.notification?.all_count); 
    }   
  }; 
  return ()=>{
      const fd = new FormData();
      fd.set('disconnect', true)
      ws.current.send(fd);
    ws.current.close(); // кода меняется isState - соединение закрывается
  }
}, [isState]);
// ws://91.218.229.240:8001/ws/notifications/(id юзера)/"
// ******************************************************************************
    useEffect(()=>{
      
      if (role === ROLE.UNREGISTRED && (history.location.pathname === '/ru'  || history.location.pathname === '/en')){
        const timerView = setTimeout(()=>{
          const tourFromsite = () => {
            introJs().setOptions({
              steps: [
                {
                  element: '[dataintro="step1"]',
                  intro: "Нажмите, чтобы посмотреть коллекцию",
                  position: 'bottom-left',
                  highlightClass: 'dataintro-step1',
                },

                {
                  element: '[dataintro="step2"]',
                  intro: "Стань обладательницей личного кабинета. Регистрация на сайте.",
                  position: 'bottom-right',
                  highlightClass: 'dataintro-step2',
                },

                {
                  element: '[dataintro="step3"]',
                  intro: "Узнай, как работаем сегодня",
                  position: 'bottom-right',
                  highlightClass: 'dataintro-step3',
                },

                {
                  element: document.querySelector('.ct-toast'),
                  intro: "Мой потрясающий админ с прекрасным чувством  юмора",
                  position: 'bottom-right',
                  highlightClass: 'dataintro-step4',
                },

                {
                  element: '[dataintro="step5"]',
                  intro: "Выбирай удобную валюту",
                  position: 'bottom-right',
                  highlightClass: 'dataintro-step5',
                },
       
              ],
              overlayOpacity: 0.8,
              nextLabel: 'вперёд',
              prevLabel: 'назад',
            })
            .onchange(()=>{
              if (introJs.instances[0]._currentStep == "0") {
                !!document.querySelector('.ct-toast')? document.querySelector('.ct-toast').style = 'opacity: 0' : null;
              }
              if (introJs.instances[0]._currentStep == "2") {
                dispatch('toggleBurgerMenu/set', 1)
                dispatch('toggleBurgerMenu/set', 0)
              } 
              if (introJs.instances[0]._currentStep == "3") {
                dispatch('toggleBurgerMenu/set', 2)
                !!document.querySelector('.ct-toast')? document.querySelector('.ct-toast').style = 'opacity: 1' : null;
                dispatch('toggleBurgerMenu/set', 0)
              }
              if (introJs.instances[0]._currentStep == "4") {
                dispatch('toggleBurgerMenu/set', 0)
                !!document.querySelector('.ct-toast')? document.querySelector('.ct-toast').style = 'opacity: 0' : null;
              } 
            })
            .onbeforeexit(function () {
              let questions = confirm("Приятного шопинга в мире моды");
              if(!!questions){
                !!document.querySelector('.ct-toast')? document.querySelector('.ct-toast').style = 'opacity: 0' : null;
                return localStorage.setItem('tour',false)
              }else{

              }
              return //localStorage.setItem('tour',false)
            })
            .start();

          }  
          const tourFromsiteReg1 = () => {
            introJs().setOptions({
              steps: [
                {
                  element: '[dataintro="step1"]',
                  intro: "Нажмите, чтобы посмотреть коллекцию",
                  position: 'bottom-left',
                  highlightClass: 'dataintro-step1',
                },

                {
                  element: '[dataintro="step2"]',
                  intro: "Стань обладательницей личного кабинета. Регистрация на сайте.",
                  position: 'bottom-right',
                  highlightClass: 'dataintro-step2',
                },

                {
                  element: '[dataintro="step3"]',
                  intro: "Узнай, как работаем сегодня",
                  position: 'bottom-right',
                  highlightClass: 'dataintro-step3',
                },

                {
                  element: document.querySelector('.ct-toast'),
                  intro: "Мой потрясающий админ с прекрасным чувством  юмора",
                  position: 'bottom-right',
                  highlightClass: 'dataintro-step4',
                },

                {
                  element: '[dataintro="step5"]',
                  intro: "Выбирай удобную валюту",
                  position: 'bottom-right',
                  highlightClass: 'dataintro-step5',
                },

                {
                  element: '[dataintro="step6"]',
                  intro: "Нажмите, чтобы выбрать и купить",
                  position: 'bottom-left',
                  highlightClass: 'dataintro-step1',
                },
      
              ],
              overlayOpacity: 0.5,
              nextLabel: 'вперёд',
              prevLabel: 'назад',
              doneLabel: 'закрыть',
            })
            .onchange(()=>{
              if (introJs.instances[0]._currentStep == "0") {
                !!document.querySelector('.ct-toast')? document.querySelector('.ct-toast').style = 'opacity: 0' : null;
                !!document.querySelector('.index-module__cookie__wrapper___3W46b')? document.querySelector('.index-module__cookie__wrapper___3W46b').style = 'opacity: 0' : null;
                
              } 
              if (introJs.instances[0]._currentStep == "2") {
                dispatch('toggleBurgerMenu/set', 1)
                dispatch('toggleBurgerMenu/set', 0)

              } 
              if (introJs.instances[0]._currentStep == "3") {
                dispatch('toggleBurgerMenu/set', 2)
                !!document.querySelector('.ct-toast')? document.querySelector('.ct-toast').style = 'opacity: 1' : null;
                dispatch('toggleBurgerMenu/set', 0)

              }
              if (introJs.instances[0]._currentStep == "4") {
                dispatch('toggleBurgerMenu/set', 0)

                !!document.querySelector('.ct-toast')? document.querySelector('.ct-toast').style = 'opacity: 0' : null;
              } 
            })
            .onbeforeexit(function () {
              let questions = confirm("Приятного шопинга в мире моды");
              !!document.querySelector('.ct-toast')? document.querySelector('.ct-toast').style = 'opacity: 0' : null;
              !!document.querySelector('.index-module__cookie__wrapper___3W46b')? document.querySelector('.index-module__cookie__wrapper___3W46b').style = 'opacity: 1' : null;

              if(!!questions){
                return localStorage.setItem('tourReg1',false)
              }
            }).start();
          }  
          if(!(checkLocalStorage('tourReg1') || checkLocalStorage('tour'))){
            return window.visualViewport.width <= 1366 ? tourFromsiteReg1() : tourFromsite();
          }        
        },2000);
      }

      if (role !== ROLE.UNREGISTRED  && history.location.pathname === '/information/juridical'){
        const timerView = setTimeout(()=>{

          const tourFromsiteReg2 = () => {
            introJs().setOptions({
              steps: [
                {
                  element: '[dataintro="step7"]',
                  intro: "Назад в Нарнию.",
                  position: 'left',
                  highlightClass: 'dataintro-step2',
                },
      
              ],
              overlayOpacity: 0.5,
            }).onbeforeexit(function () {
              let questions = confirm("Приятного шопинга в мире моды");
              if(!!questions){
                return localStorage.setItem('tourReg2',false)
              }
            }).start();
          } 

          if(!checkLocalStorage('tourReg2')){
            return tourFromsiteReg2();
          }
        
        },2000);
      }

      if (role !== ROLE.UNREGISTRED  && history.location.pathname === '/profile'){
          setTimeout(()=>{
          const tourFromsiteReg3 = () => {
            introJs().setOptions({
              steps: [
                {
                  element: '[dataintro="step8"]',
                  intro: "Доступный баланс в выбранной валюте",
                  position: 'bottom-left',
                  highlightClass: 'dataintro-step1',
                },
                
                {
                  element: '[dataintro="step9"]',
                  intro: "Посмотри разделы управления личным кабинетом",
                  position: 'bottom-right',
                  highlightClass: 'dataintro-step2',
                },
                
                {
                  element: '[dataintro="step10"]',
                  intro: "Здесь можешь создавать адреса доставки своих заказов",
                  position: 'bottom-right',
                  highlightClass: 'dataintro-step2',
                },
      
              ],
              overlayOpacity: 0.5,
            }).onbeforeexit(function () {
              let questions = confirm("Приятного шопинга в мире моды");
              if(!!questions){
                return localStorage.setItem('tourReg2',false)
              }
            }).start();
          }  

          if(!checkLocalStorage('tourReg3')){
            tourFromsiteReg3();
          }        
        },2000);
      }
    },[])

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
  const heandlerKeyOn = () => {
    const params = {0: `/${window.location.pathname}`}

          api
            .updatePage(params)
            .then(res=>{
            console.log('res:', res.page) 
            const result = {
              ...userPage,
              ...res.page,
              ...{title: "WOW?"},
              title_ru: "WOW 2?",
              cart: 25,
            }
            dispatch('userPage', result)
            setContentPage(result)
            // let errMessage = {
            //   path: '/profile',
            //   success: 'Администратором было активирована учётнач запись',
            //   fail : null,
            // };
            // dispatch('warrning/set',errMessage);            
            })
            .catch(err=>console.log('err update'))

            // console.log('userPage', userPage);

  }

  return (
    <>
    
      <Header
        headerModClosed={headerModClosed}
        header_menu={contentPage.header_menu}
        main_menu={contentPage.main_menu}
        site_configuration={contentPage.site_configuration}
        announce={contentPage.announce}
        cabinet_data={contentPage.cabinet_data}
        profile={contentPage.profile}
        cabinet_menu={contentPage.cabinet_menu} 
        currencies={contentPage.currencies}
      />
      {/* <button onClick={heandlerKeyOn}> Включить уведомления</button> */}
      {/* <button onClick={heandlerKeyOff}>Выключить уведомления</button> */}

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
        year={contentPage.year}
        policy_1={contentPage.site_configuration?.public_offer_1}
        policy_2={contentPage.site_configuration?.public_offer_1}
        footer_menu={contentPage.footer_menu}
        role_configuration={contentPage.role_configuration}
        site_configuration={contentPage.site_configuration}
        profile={contentPage.profile}
        openModalFeedbackReedFile={openModalFeedbackReedFile}
      />

      <Cookie openModalFeedbackReedFile={openModalFeedbackReedFile} policy={contentPage.site_configuration.policy}/>
    </> 
  );
};


export default React.memo(Layout)