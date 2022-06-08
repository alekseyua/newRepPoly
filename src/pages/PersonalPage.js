import React, { useEffect, useState } from 'react';
import Layout from '../Views';
import PersonalPageComponent from '../components/PersonalPageComponent';
import PersonalPageViews from '../Views/PersonalPageViews';
import Modal from '../Views/ModalCreator';
import {ROLE} from '../const';
import { useHistory } from 'react-router-dom';
const PersonalPage = (props) => {
  const [modalStates, setModalStates] = useState(Modal.defaultModalStates);
  const {
    cabinet_menu,
    create_shop,
    cabinet_site_menu,
    profile_data,
    profile,
    site_configuration,
  } = props;
  const history = useHistory();  
  let  user = {}, shop = null, role, passport, organization, links, id, balance;
  let is_has_shop, shop_link ;
  let username; 
  if(profile === undefined){
    history.push('authorization')
  }else{
 
  //todo: можно пропсом кастрировать футер
     user = profile.user;
     shop = profile.shop;
     role = profile.role;
     passport = profile.passport;
     organization = profile.organization;
     links = profile.links;
     id = profile.id;
     balance = profile.balance;
     is_has_shop;
     shop_link = shop.shop_link;
     username = user.username;
  }

  return (
    <Layout responsive {...props}>
      <Modal.ModalCreator {...modalStates} setModalStates={setModalStates} />
      <Modal.StorControllerModal />
      <PersonalPageViews.WrapperPage
        leftChildComponent={
          <PersonalPageComponent.SidebarEntryPersonalPage
            shop={shop}
            create_shop={shop_link}
            is_has_shop={is_has_shop}
            cabinet_menu={cabinet_menu}
            cabinet_site_menu={cabinet_site_menu}
            balance={balance}
            username={username}
            role={role}
            setModalStates={setModalStates}
          />
        }
        rightChildComponent={
          <>
            <PersonalPageComponent.ContentEntryPersonalPage
              profile={profile}
              user={user}
              organization={organization}
              role={role}
              links={links}
              profileId={id}
              setModalStates={setModalStates}
              site_configuration={site_configuration}
            />
            <PersonalPageComponent.DeliveryAddresses
              profileId={id}
              setModalStates={setModalStates}
            />

            {!is_has_shop ? (
              <PersonalPageViews.CreateStore
                className={'mobile'}
                role={role}
                create_shop={'/sozdanie-internet-magazina'} //create_shop
              />
            ) : null}
          </>
        }
      ></PersonalPageViews.WrapperPage>
    </Layout>
  );
  
};

export default React.memo(PersonalPage);
