import React, { useEffect, useState } from 'react';
import { GxModal } from '@garpix/garpix-web-components-react';
import { defaultProductCard } from '../../images';
import { useStoreon } from 'storeon/react';
import modalStyle from '../../Views/ModalCreator/modalCreator.module.scss';
import { LOCAL_STORAGE_KEYS } from '../../const';
import { getLocalStorage, setLocalStorage } from '../../utils';
import ModalContentViews from '../../Views/ModalContentViews';
import AsyncComponent from '../../components/AsyncComponent';
import classNames from 'classnames';
import api from '../../api';
import {ROLE} from '../../const'
const defaultIamgesSet = [defaultProductCard]; 
const apiProfile = api.profileApi;
const apiContent = api.contentApi;

const AsyncContentModal = AsyncComponent(() => {
  return import('../ProductDetails/SectionProdPage');
});

const AsyncProductCard = AsyncComponent(() => {
  return import('../../Views/ProductCard');
});

const ProductCard = ({
  // profile, 
  url = '#',
  title = 'title',
  id = '0',
  brand = 'brand',
  grid = false,
  favorite,
  prices = {
    price: '124',
    old_price: '300',
  },
  stock = true,
  colors = [],
  images = [],
  isSales = true,
  isNew = true,
  isHit = true,
  sizes = [],
  product_rc = '90',
  swapperDisabled = false,
  disabledHover = false,
  is_collection = false,
  setCardIdproductFromSlider=Function.prototype,
  article,
}) => {

  const { currenssies } = useStoreon('currenssies'); //currenssies role_configuration
  const { stateValuePoly } = useStoreon('stateValuePoly');
  const { dataProductFromId } = useStoreon('dataProductFromId');
  const { role_configuration } = useStoreon('role_configuration'); //currenssies role_configuration
  const { updateWish } = useStoreon('updateWish');
  
  const { stateCountWish, dispatch }    = useStoreon('stateCountWish');

  const [isShowModal, setisShowModal]   = useState(false);
  const [newPrice, setNewPrice]         = useState(prices);
  const [modalContent, setModalContent] = useState({
    content: null,
  });
  const { userPage } = useStoreon('userPage');
  const { profile } = userPage;
  const { role } = profile;

  const setModalStates = () => {
    getProductDetails();
    setisShowModal(true);
  };
   const [nowFavorite, setNowFavorite] = useState(false);

   useEffect(()=>{
    setNowFavorite(favorite)
   },[favorite])
  // -****************************добавление/удаление в мои желания***********работает проверено*******************************************************
  const setLikeProductCard = () => {
   const params = {
      product: id,
    };

    if (!nowFavorite) {
      //setWishlistToLocalStorage(id);
      apiProfile
        .postWishlist(params)
        .then((res) => {
          //console.log(`ok add ${id}`);
          dispatch('stateCountWish/add', {...stateCountWish, count : stateCountWish.count + 1 })
          dispatch('stateInPreveiwGoods/add', { id : id , is_liked : !nowFavorite })
          setNowFavorite(!nowFavorite)
          //update(res);
        })
        .catch((err) => {
          console.log(`err no add ${id}`);
          console.log(`ERROR deleteWishlist(${err})`);
        });
    } else {
      apiProfile
        .deleteWishlist(id)
        .then((res) => {
          //console.log(`ok delete wish ${id}`);
          dispatch('stateCountWish/add', {...stateCountWish, count : stateCountWish.count - 1 })
          dispatch('stateInPreveiwGoods/add', { id : id , is_liked : !nowFavorite })
          setNowFavorite(!nowFavorite)
          //update(res)
        })
        .catch((err) => {
          console.log(`err no dell wish ${id}`);          
          console.log(`ERROR deleteWishlist(${err})`)
        });
    }
    dispatch('updateWish/add', !updateWish)

  };
  // *********************превю товара***********************************************
  const [productModalData, setproductModalData] = useState({
    productId: id,
    profileId: 0,
    adding_type: 'item',
    breadcrumbs: [],
    reviews_statistic: {},
    reviewsCount: 1,
    title: 'title',
    brand: 'brand',
    prices: {
      more_3_item_price: 100,
      more_5_item_price: 100,
      old_price: 100,
      price: 100,
    },
    recommended_price: 0,
    colors: [],
    sizes: [],
    is_new: false,
    in_stock_count: false,
    is_bestseller: false,
    is_in_stock: 0,
    role_configuration: { role: { number: 1 } },// role: { number: 1 } была указана 1 исправил на 0 если не регестрирован
    is_closeout: false,
    is_liked: false,
    media: [],
    in_cart_count: 0,
    site_configuration: {},
    product_rc:'90',
  });
  const closeModal = () => {
    setisShowModal(false);
    setModalContent({
      content: null,
    });
  };


  
  const getProductDetails = () => {
    apiContent
      .getProduct(id)
      .then((res) => {
        setModalContent({
          content: (
            <ModalContentViews.ModalWrapper customClassName={'modal-min_wrap'}>
              <ModalContentViews.CloseBtn closeModal={closeModal} />
              <ModalContentViews.ContentBlock>
                <AsyncContentModal
                  modalView
                  url={url}
                  productId={id}
                  profileId={productModalData.profileId}
                  adding_type={productModalData.adding_type}
                  breadcrumbs={productModalData.breadcrumbs}
                  reviews_statistic={productModalData.reviews_statistic}
                  reviewsCount={productModalData.reviewsCount}
                  title={res.title}
                  brand={ role !== ROLE.RETAIL && role !== ROLE.UNREGISTRED ? res.brand : ''}
                  prices={res.prices}
                  recommended_price={productModalData.recommended_price}
                  colors={res.colors} 
                  sizes={res.sizes}
                  review={res.review}
                  is_new={res.is_new}
                  in_stock_count={res.in_stock_count}
                  is_bestseller={res.is_bestseller}
                  is_in_stock={res.is_in_stock}
                  role_configuration={role_configuration}
                  is_closeout={res.is_closeout}
                  is_liked={res.is_liked}
                  media={res.media}
                  in_cart_count={res.in_cart_count}
                  site_configuration={{}}
                  profile={profile}
                  is_collection={res.is_collection}
                  product_rc={res.product_rc}
                  article={article}
                  product_rcAmount={res.minimum_rc}
                />
              </ModalContentViews.ContentBlock>
            </ModalContentViews.ModalWrapper>
          ),
        });
        // update();
      })
      .catch((err) => {
        closeModal();
      });
  };
  // *************************************************************************************
  useEffect(() => {
    setNewPrice(prices);
  }, [
    prices.old_price,
    prices.price,
  ])


  // *************************************************************************************
  return (
    <React.Fragment>
      <GxModal
        className={classNames({
          [modalStyle['modal_creator']]: true,
          [modalStyle['modal-product']]: true,
        })}
        onGx-after-hide={closeModal}
        open={isShowModal}
      >
        {modalContent.content}
      </GxModal>
      <AsyncProductCard
        swapperDisabled={swapperDisabled}
        disabledHover={disabledHover}
        url={url}
        title={title}
        id={id}
        brand={ role !== ROLE.RETAIL && role !== ROLE.UNREGISTRED ?brand : '' }
        grid={grid}
        favorite={nowFavorite}
        prices={newPrice}
        stock={stock}
        colors={colors}
        images={images.length ? images : defaultIamgesSet}
        isSales={isSales}
        isNew={isNew}
        isHit={isHit}
        setModalStates={setModalStates}
        setLikeProductCard={setLikeProductCard}
        sizes={sizes}
        product_rc={product_rc}
        currenssies={currenssies}
        profile={profile}
        is_collection={is_collection}
        setCardIdproductFromSlider={setCardIdproductFromSlider}
        article={article}
      />
    </React.Fragment>
  );
};

export default React.memo(ProductCard);
