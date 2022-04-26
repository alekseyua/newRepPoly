import React, { useState } from 'react';
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
import { Document, Page } from 'react-pdf';


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
const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  //const resumeLink ='https://raw.githubusercontent.com/prajeshy/Awesome-Profile-README-templates/master/CV.pdf';
  //const resumeLink = 'https://back.ftownpl.com//media/uploads/2022/4/1-dogovor-okazaniia-uslug-oferta.pdf';
  const file1 = '../files/1_ДОГОВОР_оказания_услуг_оферта_.docx';
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }


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
                    <Document file={file1} onLoadSuccess={onDocumentLoadSuccess}>
                      <Page pageNumber={pageNumber} />
                    </Document>
                    <p>
                      Page {pageNumber} of {numPages}
                    </p>
                    
                    {/* {<iframe src={file}
                      className='noselect'
                      style={{
                        width: '100%',
                        height: '95vh',                    
                      }}
                    >              
                    </iframe>} */}
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

      <Cookie openModalFeedbackReedFile={openModalFeedbackReedFile} policy={site_configuration.policy}/>
    </> 
  );
};


export default React.memo(Layout)