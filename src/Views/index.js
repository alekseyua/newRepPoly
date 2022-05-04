import React, { useEffect, useState } from 'react';
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

// import { Document, Page } from 'react-pdf/dist/esm/entry.parcel';
//import { Document, Page } from 'react-pdf';
//  import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';



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
  cartUpdate,
}) => {
const { userPage, dispatch } = useStoreon('userPage');
let { profile } = userPage;
const [modalStates, setModalStates] = useState(Modal.defaultModalStates);


if ( profile === undefined ){
     window.location.reload()
}
  const cabinet_data = {
    cart: cartUpdate.in_cart,
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
        console.log('props:', props)
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
                        fileUrl={`https://cors-anywhere.herokuapp.com/${file}`}
                        renderPage={renderPage}
                        theme={{
                          theme: 'dark',
                        }}
                        // httpHeaders={{
                        //     key: value,
                        // }}
                        // withCredentials={true}
                      />
                    </div>
                </Worker>

              </ModalPreviewFile>
        )
    })
  }

const heandlerKey = () => {
  console.log('work click')
  const params = {
  }
  api
    .userApi
    .resetUserPassword(params)
    //.resendUserKey()
    .then(res=>{
      console.log('response', res)
    })
    .catch(err=>console.log(`ERROR ${err}`))
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