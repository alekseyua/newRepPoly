import React, { useState } from 'react';
import LivePhotosDetailsComponent from '../components/LivePhotosDetailsComponent';
import Layout from '../Views';
import Modal from '../Views/ModalCreator';

const LivePhotosDetailsPage = (props) => {
  const {
    cabinet_menu,
    create_shop,
    cabinet_site_menu,
    profile,
    breadcrumbs,
    location,
    created_at,
    id,
    site_configuration,
    album,
  } = props;

  const [modalStates, setModalStates] = useState(Modal.defaultModalStates);

  const { user = {}, shop = {}, role, passport, organization, links, balance } = profile;
  const { is_has_shop, shop_link } = shop;
  const { username = '' } = user;
  //todo: можно пропсом кастрировать футер
  return (
    <Layout profile={profile} {...props}>
      <Modal.ModalCreator {...modalStates} setModalStates={setModalStates} />
      <Modal.StorControllerModal />
      <LivePhotosDetailsComponent
        album={album}
        id={id}
        location={location}
        breadcrumbs={breadcrumbs}
        created_at={created_at}
        setModalStates={setModalStates}
        site_configuration={site_configuration}
      />
    </Layout>
  );
};

export default React.memo(LivePhotosDetailsPage);
