import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import Footer from '../components/Footer';
import classNames from 'classnames';
import { GxIcon } from '@garpix/garpix-web-components-react';
import VidjetChatComponent from '../components/VidjetChatComponent';
import ButtonScrollTopComponent from '../components/ButtonScrollTopComponent';
import { useStoreon } from 'storeon/react';
import Modal from '../Views/ModalCreator';
import { useHistory } from 'react-router-dom';
import ModalPreviewFile from './ModalContentViews/ModalPreviewFile';

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
const history = useHistory();
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
    dispatch('modal/update', {
      show: true,
      addClass: 'modal-file_views',
      content: (
              <ModalPreviewFile closeModal={closeModal}>
                    {<iframe src={file}
                      className='noselect'
                      style={{
                        width: '100%',
                        height: '95vh',                    
                      }}
                    >              
                    </iframe>}
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
    </> 
  );
};


export default React.memo(Layout)