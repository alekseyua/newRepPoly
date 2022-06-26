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
  
  const closeModal = () => {
    setisShowModal(false);
    setModalContent({
      content: null,
    });
  };
  
  const getProductDetails = () => {
    const params = {
      role,
      id,
      url,
    }
    dispatch('getProductDetailsModal',params);  
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
