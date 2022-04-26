import React, { useState } from 'react';
import Layout from '../Views';
import HomeComponent from '../components/HomeComponent';
import Modal from '../Views/ModalCreator';
import api from '../api';
import { categoryCard1, categoryCard2, categoryCard3 } from '../images';
import { getCookie, setCookie } from '../utils';
import {useEffect} from 'react';
import { useStoreon } from 'storeon/react';
import { OrderCar } from '../#lifehack/OrderCar/OrderCar';

const Home = (props) => {
  const [modalStates, setModalStates] = useState(Modal.defaultModalStates);
  const {
    banners,
    partner_banners,
    first_screen,
    products,
    news,
    about_banner,
    live_photos,
    reviews,
    in_stock_product_filters,
    site_configuration,
    profile,
    cartUpdate,
  } = props;
  const {
    page_type_catalog,
    page_type_news,
    page_type_reviews,
    page_type_live_photos,
    page_type_404,
    page_type_500,
  } = site_configuration;
  return (
   <Layout {...props} cartUpdate={cartUpdate} >
<>
      <Modal.ModalCreator {...modalStates} setModalStates={setModalStates} />
      <Modal.StorControllerModal />
      
      <HomeComponent.TradingPlatform
        first_screen={first_screen}
        page_type_catalog ={page_type_catalog}
        front_admin = {props.profile.front_admin}
      />

      <HomeComponent.MainCategories 
        banners={banners}
        front_admin = {props.profile.front_admin}
      />
      {!!products.length?
      <HomeComponent.ProductsInStock
        profile={profile}
        front_admin = {props.profile.front_admin}
        in_stock_product_filters={in_stock_product_filters}
        setModalStates={setModalStates}
        products={products}
        catalog_url={page_type_catalog}
      /> 
      :null
      }
      <HomeComponent.Cooperation
        front_admin = {props.profile.front_admin}
        partner_banners={partner_banners} 
      />

      <HomeComponent.MainNews 
        front_admin = {props.profile.front_admin}
        news={news} 
        news_url={page_type_news} 
      />

      <HomeComponent.MainAbout 
        front_admin = {props.profile.front_admin}
        about_banner={about_banner} 
      />

{/* 
      <HomeComponent.LivePhotos 
        //Живые фото
        live_photos={live_photos} 
        live_photos_url={page_type_live_photos} 
      /> */}

      <HomeComponent.MainReviews
        front_admin = {props.profile.front_admin}
        reviews={reviews}
        reviews_url={page_type_reviews}
        setModalStates={setModalStates}
        {...modalStates}
      /> 
</>
   </Layout>
  );
};

export default React.memo(Home);


/*
      
*/