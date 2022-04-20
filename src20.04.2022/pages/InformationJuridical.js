import React, { useState } from 'react';
import Layout from '../Views';
import Text from '../components/Text';
import InformationViews from '../Views/InformationViews';
import Title from '../Views/Title';
import Breadcrumbs from '../Views/Breadcrumbs';
import Container from '../Views/Container';
import Modal from '../Views/ModalCreator';
import Settings from '../#lifehack/Settings';
import { useStoreon } from 'storeon/react';
import ModalPreviewFile from '../Views/ModalContentViews/ModalPreviewFile';

import { ROLE } from '../const';

const InformationJuridical = (props) => {
  const { cabinet_menu, create_shop, cabinet_site_menu, profile, breadcrumbs = [], page_info, components } = props;
  const { user = {}, shop = {}, role, passport, organization, links, balance } = profile;

  console.log('page_info',profile.role);
  console.log('components***',page_info.components);



  const { is_has_shop, shop_link } = shop;
  const { username = '' } = user;
  const { dispatch } = useStoreon();
  const closeModal = () => {
    dispatch('modal/update', {
      show: false,
      content: null,
      addClass: false,
    });
  };
  const openModalFeedbackReedFile = (file) => {
    console.log('file pdf',file);
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
    

  const heandlerPolicy = (e) => {
    let valueList = e.target.attributes['data-name'].value;
    if(valueList === 'public_offer'){
      props.profile.role === ROLE.WHOLESALE? valueList = 'public_offer_2' : valueList = 'public_offer_1';
    }
    openModalFeedbackReedFile(props.site_configuration[valueList]);
  }


  return (
    <Layout profile={profile} {...props}>
      {/* <Modal.ModalCreator {...modalStates} setModalStates={setModalStates} /> */}
      <Modal.StorControllerModal />

      <Container>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <InformationViews.PaymentsConteiner>
          <Title variant={'information-payments__title'} type={'h1'}>
            {page_info?.title}
          </Title>
          <InformationViews.HowToWrapper>
            <InformationViews.BlockHowTo>
              <InformationViews.ContainerMin>
                <InformationViews.PaymentsDescription>
                  {page_info.components.map(el=>{
                    return (
                      // el.title === 'как пользоваться сайтом - дроппа'?
                      // el.title === 'как пользоваться сайтом - опта'?
                      (el.title === 'как пользоваться сайтом - не зарегистрированных' && profile.role === ROLE.UNREGISTRED )?                       
                        el.children.map(item=>{
                          const position = `juridical-block--${item.title}`;
                          return(
                            <div className={position}>
                              <div className='juridical-block__left' dangerouslySetInnerHTML={{ __html: item.content }}></div>
                              
                              <div className="juridical-block__right">
                                <div className="juridical-block__image">
                                  {item.image !== "#"? <img src={item.image} /> : null}
                                </div>
                              </div>
                            </div>
                          )
                        })
                        :(el.title === 'как пользоваться сайтом - дроппа' && profile.role === ROLE.DROPSHIPPER )?                       
                          el.children.map(item=>{
                            const position = `juridical-block--${item.title}`;
                            return(
                              <div className={position}>
                                <div className='juridical-block__left' dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                
                                <div className="juridical-block__right">
                                  <div className="juridical-block__image">
                                    {item.image !== "#"? <img src={item.image} /> : null}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                          :(el.title === 'как пользоваться сайтом - опта' && profile.role === ROLE.WHOLESALE )?                       
                            el.children.map(item=>{
                              const position = `juridical-block--${item.title}`;
                              return(
                                <div className={position}>
                                  <div className='juridical-block__left' dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                  
                                  <div className="juridical-block__right">
                                    <div className="juridical-block__image">
                                      {item.image !== "#"? <img src={item.image} /> : null}
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                            :(el.title === 'как пользоваться сайтом - розница' && profile.role === ROLE.RETAIL )?                       
                            el.children.map(item=>{
                              const position = `juridical-block--${item.title}`;
                              return(
                                <div className={position}>
                                  <div className='juridical-block__left' dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                  
                                  <div className="juridical-block__right">
                                    <div className="juridical-block__image">
                                      {item.image !== "#"? <img src={item.image} /> : null}
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                            :null
                    )
                })}
                </InformationViews.PaymentsDescription>
                <InformationViews.PaymentsDescription>
                  <div className='information-exchange__wrapper'>
                    <div onClick={heandlerPolicy} data-name="policy" className="information-exchange__link">
                      Политика конциденциальности
                    </div>

                    <div onClick={heandlerPolicy} data-name="public_offer" className="information-exchange__link">
                      Пользовательское соглашение
                    </div>

                    <div onClick={heandlerPolicy} data-name="terms" className="information-exchange__link">
                      Пользовательское соглашение о доставке
                    </div>

                    <div onClick={heandlerPolicy} data-name="statement_performance" className="information-exchange__link">
                      Заявление о некачественном выполнении услуги по подбору и выкупу
                    </div>                    
                  {props?.profile.front_admin?<Settings nameComponent={'InformationJuridical'} /> : null }
                    
                  </div>
                </InformationViews.PaymentsDescription>
              </InformationViews.ContainerMin>
            </InformationViews.BlockHowTo>
          </InformationViews.HowToWrapper>
        </InformationViews.PaymentsConteiner>
      </Container>
    </Layout>
  );
};

export default React.memo(InformationJuridical);
