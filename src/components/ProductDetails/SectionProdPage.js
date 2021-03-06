import React, { useState, useEffect, useRef } from 'react';
import { labelHit, labelNew, labelSale, labelOnsale, defaultProductCard } from '../../images/index';
import { Formik } from 'formik';
import Container from '../../Views/Container';
import ProductDetailsViews from '../../Views/ProductDetailsViews';
import Breadcrumbs from '../../Views/Breadcrumbs';
import ModalContentViews from '../../Views/ModalContentViews';
import PreviewSlider from '../PreviewSlider';
import SceletonBlock from '../../Views/SceletonBlock';
import Title from '../../Views/Title';
import classNames from 'classnames';
import { GxModal, GxForm } from '@garpix/garpix-web-components-react';
import api from '../../api';
import { ERROR_STATUS } from '../../const';
import { useStoreon } from 'storeon/react';
import AsyncComponent from '../AsyncComponent';
import styleModal from '../../Views/ModalCreator/modalCreator.module.scss';
import { useHistory } from 'react-router-dom';
import Popupe from '../Popupe';
import { ROLE } from '../../const'
import { checkLocalStorage } from '../../utils';

const AsyncWorldStandardSizesChart = AsyncComponent(() => {
  return import('../../Views/WorldStandardSizesChart');
});
const AsyncControlButtons = AsyncComponent(() => {
  return import('../../Views/ProductDetailsViews/ProductData/ControlButtons');
});
const AsyncColorsButton = AsyncComponent(() => {
  return import('../../Views/ProductDetailsViews/ProductData/ColorsItems');
});
const AsyncSizesButton = AsyncComponent(() => {
  return import('../../Views/ProductDetailsViews/ProductData/SizesItems');
});
const AsyncPricesContainer = AsyncComponent(() => {
  return import('../../Views/ProductDetailsViews/ProductData/PriceContainer');
});
const AsyncLabels = AsyncComponent(() => {
  return import('../../Views/ProductDetailsViews/ProductData/Labels');
});

const apiProfile = api.profileApi;
const apiContent = api.contentApi;
const apiCart = api.cartApi;

const SectionProdPage = ({
  modalView,
  url,
  productId,
  profileId,
  adding_type,
  breadcrumbs,
  reviews_statistic,
  reviewsCount,
  title,
  brand,
  prices,
  recommended_price,
  colors = [],
  sizes = [],
  review,
  is_new,
  in_stock_count,
  is_bestseller,
  is_in_stock,
  is_closeout,
  is_liked,
  media = [],
  in_cart_count,
  is_collection,
  collections,
  product_rc,
  role_configuration,
  site_configuration,
  product_sku,
  article,
  product_rcAmount,
  ...props
}) => {
  
  const history = useHistory();
  const {statuStorage} = useStoreon('statuStorage');
  const { stateCountCart, dispatch } = useStoreon('stateCountCart');
  const { stateCountRestart } = useStoreon('stateCountRestart')
  const { stateCountWish } = useStoreon('stateCountWish')
  const { currenssies } = useStoreon('currenssies'); //currenssies
  const { userPage } = useStoreon('userPage');
  const { role, status } = userPage.profile;
  const shereRef = useRef();
  const [listCollectionsHook, setListCollectionsHookHook] = useState([]);//Array data
  const [recommended_priceHook, setRecommended_priceHook] = useState();
  const [in_stock_countHook, setIn_stock_countHook] = useState(false);
  const [is_bestsellerHook, setIs_bestsellerHook] = useState(false);
  const [styleSocialItems, setStyleSocialItems] = useState(false)
  const [collectionsHook, setCollectionsHook] = useState();//boolen
  const [is_in_stockHook, setIs_in_stockHook] = useState(is_in_stock);
  const [is_closeoutHook, setIs_closeoutHook] = useState(false);
  const [changeColorBtn, setChangeColorBtn] = useState({ red: false, green: false });
  const [modalStates, setmodalStates] = useState({ show: false });
  const [in_cart_countHook, setIn_cart_countHook] = useState();
  const [is_likedHook, setIs_likedHook] = useState(false);
  const [product_rcHook, setProduct_rcHook] = useState();
  const [mediaFirstHook, setMediaFirstHook] = useState();
  const [is_newHook, setIs_newHook] = useState(false);
  const [pricesHook, setPricesHook] = useState();
  const [reviewHook, setReviewHook] = useState();
  const [brandHook, setBrandHook] = useState([]);
  const [mediaHook, setMediaHook] = useState();
  const [titleHook, setTitleHook] = useState();
  const [urlHook, setUrlHook] = useState([]);
  const [colorsn, setColorsn] = useState([]);
  const [sizesn, setSizesn] = useState([]);
  const [isOpen, setIsOpen] = useState();
  const [ product_skuHook, setProduct_skuHook ] = useState([])
  const [showPopapInfoColection, setShowPopapInfoColection] = useState({
    show: false,
    content: null
  })
  const [customModalStates, setCustomModalStates] = useState({
    show: false,
    addClass: 'modal-add_to_cart',
    content: null,
  });
  let newProduct_sku = [];//Array.from(product_sku);

  //   //???????????????? ?????????????????? ???????????????? 
  //?????????????????????? ???????? ?????? ?????????? ??????????????????
  useEffect(() => {
    const clickOut = (e) => shereRef.current.contains(e.target) || setStyleSocialItems(false);
    document.addEventListener('click', clickOut);
    return () => document.removeEventListener('click', clickOut);
  }, []);

  // ????????????
  useEffect(() => {
    let size = sizes.filter(el => el.selected)
    sizes.length ? setSizesn(size[0]) : null
  }, [sizes.length])
  // ?????????? brand
  useEffect(() => {
    brand ? setBrandHook(brand) : null
  }, [brand])
  // ???????????????????? ?? ?????????????? ???????????? in_cart_count
  useEffect(() => {
    in_cart_count ? setIn_cart_countHook(in_cart_count) : null
  }, [in_cart_count])
  // ???????????????????????????? ???????? ???????????? recommended_price
  useEffect(() => {
    recommended_price ? setRecommended_priceHook(recommended_price) : null
  }, [recommended_price])
  // ???????????? ???? Url
  useEffect(() => {
    url ? setUrlHook(url) : null
  }, [url])
  // ?????????????? ???????????????? ???????????? Title
  useEffect(() => {
    title ? setTitleHook(title) : null
  }, [title])
  // ?????????? Prices ?????????????????????????????????
  useEffect(() => {
    prices ? setPricesHook(prices) : null
  }, [prices])
  // ?? ?????????????????? ?????????? Is_new
  useEffect(() => {
    setIs_newHook(is_new)
  }, [is_new])
  // Is_closeout
  useEffect(() => {
    setIs_closeoutHook(is_closeout)
  }, [is_closeout])
  // ???????????????????? ?????????????? ?? ?????????????? In_stock_count
  useEffect(() => {
    in_stock_count ? setIn_stock_countHook(in_stock_count) : null
  }, [in_stock_count])
  // ???????????????? Is_bestseller
  useEffect(() => {
    setIs_bestsellerHook(is_bestseller)
  }, [is_bestseller])
  // ???????????????? ???????????????? Product_rc
  useEffect(() => {
    product_rc ? setProduct_rcHook(product_rc) : null
  }, [product_rc])
  // ?? ?????? ?????????????? Is_liked
  useEffect(() => {
    setIs_likedHook(is_liked)
  }, [is_liked])
  //  Review
  useEffect(() => {
    review ? setReviewHook(review) : null//????????????????????????
  }, [review])
  // ???????? ???????????? Media
  useEffect(() => {
    let newSku = [];
    let color = colors.filter(el => el.selected)
    colors.length ? setColorsn(color[0]) : null;

    media = media.filter(item=>item !== null);

    !!product_sku?(
      product_sku = product_sku.filter(item=>item !== null),
      setProduct_skuHook(product_sku),
      newSku =  product_sku.map(item=>({
        image: item.image,
        image_thumb: item.image_thumb,
        type: item?.type? item.type : 'image',
        color: item.color,
      })),
      newSku = newSku.filter(item=>item !== null),
      newSku = newSku.filter(item=>(item?.image || item?.video) !== '-'),
      newSku = newSku.filter(item=>item.color === color[0].id)
    ):null
    
    let allNewSku = newSku;
    media = media.filter(item=>(item?.image || item?.video) !== '-');
    allNewSku = allNewSku.filter(item=>(item?.image || item?.video) !== '-');

    media = [...newSku, ...media, ...allNewSku];
    !!media.length ? 
      setMediaHook(media) : null
  }, [media.length])

  useEffect(() => {
    setCollectionsHook(is_collection)
  }, [is_collection])
  useEffect(() => {
    setListCollectionsHookHook(collections)
  }, [collections])

  //    ?????????????? ???????????? ?????? ???????????? ?????? ?????????????????? ?????????? ?????? ??????????????
  //    //****************************************************************** */
  useEffect(() => {
    let params = {
      color: colorsn.id,
      size: sizesn.id,
      id: productId,
      collection: null,
      // pack ??????
    }
    colorsn.id || sizesn.id ? (
      apiContent
        .getProduct(productId, params)
        .then((res) => {
          let color = res.colors.filter(el => el.selected)
          let size = res.sizes.filter(el => el.selected)
          setColorsn(color[0])
          setSizesn(size[0])
          setIn_cart_countHook(res.in_cart_count)
          setIn_stock_countHook(res.in_stock_count)
          setIs_likedHook(res.is_liked)
          setIs_in_stockHook(res.is_in_stock)
        })
        .catch(err => console.error(`ERROR getProduct(productId, params) ${err}`))
    ) : null

  }, [colorsn.id, sizesn.id])
  // //****************************************************************** */
  const openTableModal = () => {
    setmodalStates({
      ...modalStates,
      show: true,
    });
  };
  const closeModal = () => {
    setmodalStates({
      ...modalStates,
      show: false,
    });
  };
  const closeCustomModal = () => {
    setCustomModalStates({
      ...customModalStates,
      show: false,
    });
  };

  const submitProduct = (data) => {
    console.log(`submitProduct`, data);
  };

  //   ?????????????????? ???????????????? ???????????????? ???????? ???????????????? ?? ???????????? ???????????? ???????????????????? ???????????????? ???????????????? ????
  //   //*************************************************************** */
  const addWishlistProduct = (productId, profileId) => {
    if (!is_likedHook) {
      apiProfile
        .postWishlist({
          product: productId,
          profile: profileId,
        })
        .then(res => {
          dispatch('stateCountWish/add', { ...stateCountWish, count: stateCountWish.count + 1 })
          dispatch('stateInPreveiwGoods/add', { id: productId, is_liked: !is_likedHook })
          setIs_likedHook(!is_likedHook)
        })
        .catch(err => {
          console.log(`err no add ${productId}`);
          console.log(`ERROR response ${err}`)
        });
    } else {
      apiProfile
        .deleteWishlist(productId, {
          product: productId,
          profile: profileId,
        })
        .then(res => {
          setIs_likedHook(!is_likedHook)
          dispatch('stateInPreveiwGoods/add', { id: productId, is_liked: !is_likedHook })
          dispatch('stateCountWish/add', { ...stateCountWish, count: stateCountWish.count - 1 })
        })
        .catch(err => {
          console.log(`err no dell wish ${productId}`);
          console.log(`ERROR response ${err}`)
        })
    }
  };
  // ?????????????? 
  const openModalSuccessAddToCart = (currentColor, currentSize, prices) => {
    setCustomModalStates({
      ...customModalStates,
      show: true,
      content: (
        <ModalContentViews.ModalWrapper>
          <ModalContentViews.CloseBtn closeModal={closeCustomModal} />
          <ModalContentViews.ContentBlock>
            <ModalContentViews.AddToCartBlock
              title={title}
              product_rcHook={product_rcHook}
              size={`????????????: ${currentSize.title}`}
              priceOneProduct={recommended_priceHook}
              allPrice={pricesHook.old_price}
              currentPrice={pricesHook.price}
              image={mediaHook[0].image.includes('https://') || mediaHook[0].image.includes('http://') ? mediaHook[0].image : mediaFirstHook[0].image}
              handleClose={closeCustomModal}
              product_rcAmount={product_rcAmount}
              is_collection={is_collection}
            />
          </ModalContentViews.ContentBlock>
        </ModalContentViews.ModalWrapper>
      )
    });
  };

  // ******************************************************************************************************
  newProduct_sku = mediaHook;
  const getColorForMedia = (colorData) => {
    setMediaFirstHook(media)
    let arr = Array.from(product_skuHook);

    let newArr = arr.map(item => ({
      type: "image",
      image: item.image,
      image_thumb: item.image_thumb,
    }));
    let filterArr = arr.filter(item => item.color === colorData);
    let newFilterArr = filterArr.map(item => ({
      type: "image",
      image: item.image,
      image_thumb: item.image_thumb,
    }));
    filterArr = [...newFilterArr, ...mediaHook, ...newArr]
    filterArr = Array.from(new Set(filterArr))
    setMediaHook(filterArr);
  }
  // ******************************************************************************************************
  const addToCart = ({ count = 1, openModalSucces, color, size }) => {
    let realColor = color ? color : colorsn.id;
    let realSize = size ? size : sizesn.id;
    let params = {
      product: productId,
      color: realColor,
      size: realSize,
      qty: count || 1,
      is_collection: collectionsHook,
    };

    console.log('params: 1 - ', params)
    if (checkLocalStorage('numOrder')){
        const addItemInNumOrder = localStorage.getItem('numOrder'); 
        console.log('addItemInNumOrder:', addItemInNumOrder)
        role === ROLE.WHOLESALE? params = Object.assign({},params, {add_product: true}) : null;
        console.log('params:2 - ', params)
    }
    apiCart
      .addToCart(params)
      .then((res) => {
        localStorage.setItem('productId',productId);
        setChangeColorBtn({
          red: false,
          green: false
        });
        setIn_cart_countHook(count)
        
        if (collectionsHook) dispatch('stateCountRestart/add', !stateCountRestart)

        if (openModalSucces ) {
          openModalSuccessAddToCart(colorsn, sizesn);
        }
      })
      .catch((err) => {
        // ?????????? ?????????????? ?????????? ?????? ???????????? ???????????????????? ?? ???????????????? ???????????????????? ???????????? ?? ????????????
        const response = err.response;
        // if (response) {
        //   if (response.status === ERROR_STATUS.FORBIDDEN) {
        //     return (history.push(site_configuration.page_type_reg));
        //   }
        // }
        dispatch('stateCountRestart/add', !stateCountRestart)
      });
  };

  const lables = [{
    icon: labelSale,
    isVisible: is_closeoutHook,
  },
  {
    icon: labelNew,
    isVisible: is_newHook,
  },
  {
    icon: labelHit,
    isVisible: is_bestsellerHook,
  },
  {
    icon: labelOnsale,
    isVisible: is_in_stockHook,
    modifyClass: 'long',
  },
  ];

  const heandlerAddCollections = (qty = 1, openModalSucces = false, color, size,) => {
    let params = {
      color: color,
      size: size,
      productId: productId,
    }
    apiContent
      .getProduct(productId, params)
      .then((res) => {
        let count = res.in_cart_count + 1;
        addToCart({
          count,
          openModalSucces,
          color,
          size
        })
      })
      .catch(err => console.error(`ERROR getProduct(productId, params) ${err}`))
  }

  const heandlerPopup = () => {
    {
      setShowPopapInfoColection({
        ...showPopapInfoColection,
        show: true,
        content: <Popupe
          dataPopup={listCollectionsHook}
          title={titleHook}
          colorsn={colorsn}
          setShowPopapInfoColection={setShowPopapInfoColection}
          showPopapInfoColection={showPopapInfoColection}
          mediaHook={mediaHook}
          brandHook={brandHook}
          product_rcHook={product_rcHook}
          setIsOpen={setIsOpen}
          closeModal={closeModal}
          site_configuration={site_configuration}
          styleModal={styleModal}
          AsyncWorldStandardSizesChart={AsyncWorldStandardSizesChart}
          AsyncLabels={AsyncLabels}
          lables={lables}
          AsyncPricesContainer={AsyncPricesContainer}
          pricesHook={pricesHook}
          role_configuration={role_configuration}
          currenssies={currenssies}
          recommended_priceHook={recommended_priceHook}
          in_cart_countHook={in_cart_countHook}
          heandlerAddCollections={heandlerAddCollections}
          styleSocialItems={styleSocialItems}
          modalStates={modalStates}
        >
        </Popupe>
      })
    }
  }

  useEffect(() => {
    const body = document.querySelector('body');
    body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen])

  return (
    <Formik enableReinitialize onSubmit={submitProduct}>
      {({ handleSubmit, setFieldValue, handleChange, values, errors }) => {
        return (
          <GxForm noValidate onGx-submit={handleSubmit}>
            <ProductDetailsViews.SectionProdPage modalView={modalView}>
              <GxModal
                onGx-after-hide={closeCustomModal}
                open={customModalStates.show}
                className={classNames({
                  [styleModal['modal_creator']]: true,
                  [styleModal[customModalStates.addClass]]: true,
                })}
              >
                {customModalStates.content}
              </GxModal>

              <Container>
                <GxModal
                  onGx-after-hide={closeModal}
                  open={modalStates.show}
                  className={classNames({
                    [styleModal['modal_creator']]: true,
                    [styleModal['modal-how_to']]: true,
                  })}
                >
                  <ModalContentViews.ModalWrapper>
                    <ModalContentViews.CloseBtn closeModal={closeModal} />
                    <ModalContentViews.ContentBlock>
                      <AsyncWorldStandardSizesChart
                        site_configuration={site_configuration}
                        productTableVariant={false}
                      />
                    </ModalContentViews.ContentBlock>
                  </ModalContentViews.ModalWrapper>
                </GxModal>

                {!modalView ? <Breadcrumbs breadcrumbs={breadcrumbs} /> : null}
                <ProductDetailsViews.DataProductRow modalView={modalView}>
                  {showPopapInfoColection.show ? showPopapInfoColection.content : null}

                  <ProductDetailsViews.DataProductLeft>
                    <PreviewSlider
                      imageOrVideoSet={mediaHook}
                      defaultImage={defaultProductCard}
                    />
                  </ProductDetailsViews.DataProductLeft>
                  <ProductDetailsViews.DataProductRigth>
                    <ProductDetailsViews.RatingProduct
                      productId={productId}
                      profileId={profileId}
                      is_liked={is_likedHook}
                      addWishlistProduct={addWishlistProduct}
                      reviews_statistic={reviewHook}
                      title={titleHook}
                      site_configuration={site_configuration}
                      shereRef={shereRef}
                      setStyleSocialItems={setStyleSocialItems}
                      styleSocialItems={styleSocialItems}
                      media={mediaHook}
                    />
                    {
                      role === ROLE.RETAIL || role === ROLE.UNREGISTRED ?
                        null
                        : <ProductDetailsViews.BrandName name={brandHook} />
                    }
                    {titleHook && titleHook !== 'title' ? (
                      <Title variant={'prodpage__title'} type={'h1'}>
                        {titleHook}
                      </Title>
                    ) : (
                      <SceletonBlock />
                    )}

                    <AsyncLabels items={lables} />
                    <AsyncPricesContainer
                      prices={pricesHook}
                      recommended_price={recommended_priceHook}
                      in_cart_count={in_cart_countHook}
                    />
                    <AsyncColorsButton
                      items={colors}
                      setColorsn={setColorsn}
                      colorsn={colorsn}
                      getColorForMedia={getColorForMedia}
                    />
                    <AsyncSizesButton
                      modalView={modalView}
                      openTableModal={openTableModal}
                      product_rc={product_rcHook}
                      in_stock_count={in_stock_countHook}
                      collections={collectionsHook}
                      sizes={sizes}
                      listCollectionsHook={listCollectionsHook}
                      setSizesn={setSizesn}
                      sizesn={sizesn}
                      heandlerPopup={heandlerPopup}
                      setIsOpen={setIsOpen}
                      currenssies={currenssies}
                      pricesHook={pricesHook}
                      product_rcAmount={product_rcAmount}
                      status={statuStorage}
                    />
                    <AsyncControlButtons
                      countProduct={in_stock_countHook}
                      is_in_stock={is_in_stockHook}
                      in_stock_count={in_stock_countHook}
                      in_cart_count={in_cart_countHook}
                      addToCart={addToCart}
                      modalView={modalView}
                      collections={collectionsHook}
                      is_collection={is_collection}
                      sizes={sizes}
                      url={urlHook}
                      changeColorBtn={changeColorBtn}
                      setChangeColorBtn={setChangeColorBtn}
                      role={role}
                      productId={productId}
                      status={statuStorage}
                    />
                    {!modalView ? (
                      <ProductDetailsViews.DeliveryInfo
                        role={role}
                        description={role_configuration.delivery_condition}
                      />
                    ) : null}
                  </ProductDetailsViews.DataProductRigth>
                </ProductDetailsViews.DataProductRow>
              </Container>
            </ProductDetailsViews.SectionProdPage>
          </GxForm>
        );
      }}
    </Formik>
  );
};

export default SectionProdPage;
