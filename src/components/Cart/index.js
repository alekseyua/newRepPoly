import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useStoreon } from 'storeon/react';
import { GxCol, GxRow, GxModal } from '@garpix/garpix-web-components-react';
import CartViews from '../../Views/CartViews';
import CheckBox from '../../Views/CheckBox';
import DefaultCartPreview from './DefaultCartPreview';
import Container from '../../Views/Container';
import ProductHorizontalCard from '../../Views/ProductHorizontalCard';
import ModalContentViews from '../../Views/ModalContentViews';
import ProductWhosaleHorizontalCard from '../../Views/ProductWhosaleHorizontalCard';
import ProductWhosaleIsPackHorizontalCard from '../../Views/ProductWhosaleHorizontalCard/ProductWhosaleIsPackHorizontalCard';
import ProductWhosaleInStockHorizontalCard from '../../Views/ProductWhosaleHorizontalCard/ProductWhosaleInStockHorizontalCard';
import classNames from 'classnames';
import api from '../../api';
import Text from '../../components/Text';
import Title from '../../Views/Title';
import { ROLE } from '../../const';
import styleModal from '../../Views/ModalCreator/modalCreator.module.scss';
import Button from '../../Views/Button';
import { cart } from '../../store';
import { initial } from 'lodash';
import { Link } from 'react-router-dom';
import { memo } from 'react';
import ProductWhosaleIsCollectionHorizontalCard from '../../Views/ProductWhosaleHorizontalCard/ProductWhosaleIsCollectionHorizontalCard';
import Settings from '../../#lifehack/Settings/Settings';

const apiCart = api.cartApi;
const initialCartData = {
  cartitem_set: [],
  delivery_price: 300,
  id: 14,
  in_cart: 4,
  in_stock: [],
  is_performed: true,
  selected: 4,
  total_discount: 692.45,
  total_price: '0',
};

const initialMassiveCart = {
  cartitem_set: [],
  is_pack: [],
  in_stock: [],
};

const serializeCardDataToFormValue = (data) => {
  let results = {};
  data.map((el) => {
    results[el.id] = {
      selected: el.selected,
      qty: el.qty,
      id: el.id,
    };
  });
  return results;
};
const serializeCardDataToFormValueWoosale = (data) => {
  let results = {};
  data.map((el) => {
    results[el.id] = {
      id: el.id,
      items: el.items,
      title: el.title,
    };
  });
  return results;
};
const Cart = ({ role, checkout_slug, page_type_catalog, components, front_admin }) => {

  const { currenssies, dispatch } = useStoreon('currenssies'); //currenssies
  const { valueStock } = useStoreon('valueStock');
  const { dataBalance } = useStoreon('dataBalance');
  const { stateCountCart } = useStoreon('stateCountCart');
  const { stateCountRestart } = useStoreon('stateCountRestart');
  const [goodsStateDropAndRetail, setGoodsStateDropAndRetail] = useState({});
  const [goodsStateOpt, setGoodsStateOpt] = useState({});
  const [in_cart, setIn_cart] = useState();
  const [is_performed, setIs_performed] = useState();
  const [total_price, setTotal_price] = useState();
  const [delivery_price, setDelivery_price] = useState();
  const [total_discount, setTotal_discount] = useState();
  const [selected, setSelected] = useState();
  const [getCart, setGetCart] = useState(stateCountCart);
  const [oneClick, setOneClick] = useState(false);
  const [enab, setEnab] = useState(); 
  const [fullItemCartChecked, setFullItemCartChecked] = useState();
  const [fullItemCartCheckedState, setFullItemCartCheckedState] = useState(false);
  const [agreeWitheRegulations, setAgreeWitheRegulations] = useState(true);
  const [cartData, setCartData] = useState(initialCartData);
  // const [selectElementInCartFromWhosale, setSelectElementInCartFromWhosale] = useState(initialCartData);
  const [values, setValue] = useState({});//количество в горизонтальной карточке товара между + и -
  const [tooltipNoSelectedProductsOpen, setTooltipNoSelectedProductsOpen] = useState(false);
  const [modalStates, setmodalStates] = useState({
    show: false,
    callback: null,
  });
  const currentCurrcensies = String(currenssies).toUpperCase();
  const rightSideWrapper = useRef(null);
  const [stateClickBtn, setStateClickBtn] = useState(false)

  // *****************************
  useEffect(()=>{
    setEnab((!!stateCountCart.in_cart === !!stateCountCart.selected) ? true : false);
  },[(stateCountCart.in_cart === stateCountCart.selected)])

  useEffect(()=>{
    setFullItemCartChecked((!!stateCountCart.in_cart === !!stateCountCart.selected) ? true : false);
  },[(stateCountCart.in_cart === stateCountCart.selected)])


  useEffect(() => {
    setIn_cart(stateCountCart.in_cart)
  }, [stateCountCart.in_cart])
  useEffect(() => {
    setIs_performed(stateCountCart.is_performed)
  }, [stateCountCart.is_performed])
  useEffect(() => {
    setTotal_price(stateCountCart.total_price)
  }, [stateCountCart.total_price])
  useEffect(() => {
    setDelivery_price(stateCountCart.delivery_price)
  }, [stateCountCart.delivery_price])
  useEffect(() => {
    setTotal_discount(stateCountCart.total_discount)
  }, [stateCountCart.total_discount])
  useEffect(() => {
    setSelected(stateCountCart.selected)
  }, [stateCountCart.selected])
  useEffect(() => {
    setGetCart(stateCountCart)
    setIs_performed(stateCountCart.is_performed)
  }, [])

  const setValuesDecoration = (res) => {
    if (role === ROLE.WHOLESALE) {
      setValue(serializeCardDataToFormValueWoosale(res.cartitem_set));
    } else {
      setValue(serializeCardDataToFormValue(res.cartitem_set));
    }
  };

  const closeModal = () => {
    setmodalStates({
      ...modalStates,
      callback: null,
      show: false,
    });
  };
  //***************************************************************** */

  useEffect(() => {

    if (role === ROLE.WHOLESALE) {//если опт
      debugger
      setIs_performed(stateCountCart.is_performed)
      let goods = {
        collectiion: [],
        is_pack: [],
        in_stock: [],
        other_goods: []
      }
  
       //*********************************************************************************** */
       // **********cartitem_set -> is_pack
      let resultsIs_pack = [];
       let goodsInPack = [];
      let resultsIn_stock_pack = [];
      let arrPack = stateCountCart.cartitem_set

      Object.keys(arrPack).length ?
        (resultsIs_pack = arrPack.reduce((prev, cur, i) => {
              prev.push(...cur.items.filter(el=>el.is_pack))
          return prev
        },[])
        ) : null;

      // **********in_stock -> is_pack в наличие но пачкой
      Object.keys(stateCountCart.in_stock).length ?
        resultsIn_stock_pack = stateCountCart.in_stock.filter(items => items.is_pack)
        : null

      //объеденяем пачки +
      if (!!Object.keys(resultsIs_pack).length && !!Object.keys(resultsIn_stock_pack).length) {
        goodsInPack = [...resultsIs_pack, ...resultsIn_stock_pack]
      } else if (!!Object.keys(resultsIs_pack).length && !(!!Object.keys(resultsIn_stock_pack).length)) {
        goodsInPack = [...resultsIs_pack]
      } else if (!(!!Object.keys(resultsIs_pack).length) && !!Object.keys(resultsIn_stock_pack).length) {
        goodsInPack = [...resultsIn_stock_pack]
      }

      //длелаем чтобы выделяло элементы +
      Object.keys(goodsInPack).length && fullItemCartCheckedState ?
        goodsInPack = goodsInPack.map(res => {
          let items = { ...res, selected: fullItemCartChecked }
          setFullItemCartCheckedState(false)
          return items
        }) : null
       // ----------------------------------------------
       // ----------------------------------------------
      //*********************************************************************************** */
      // ====================================================================================
       // **********cartitem_set -> is_collections +
      let resultsIs_collection = [];
      let collectionGoods = [];
      let arrCollec = stateCountCart.cartitem_set
      Object.keys(arrCollec).length ?
        (resultsIs_collection = arrCollec.reduce((prev, cur, i) => {
              prev.push(...cur.items.filter(el=>el.is_collection))
          return prev
        },[])
        ) : null;
       // **********in_stock -> is_collection в наличие но коллекцией +
      let resultsIn_stock_colec = [];
      Object.keys(stateCountCart.in_stock).length ?
        resultsIn_stock_colec = stateCountCart.in_stock.filter(items => items.is_collection)
        : null
 

      //объеденяем коллекцию +
      if (!!Object.keys(resultsIs_collection).length && !!Object.keys(resultsIn_stock_colec).length) {
        collectionGoods = [...resultsIs_collection, ...resultsIn_stock_colec]
      } else if (!!Object.keys(resultsIs_collection).length && !(!!Object.keys(resultsIn_stock_colec).length)) {
        collectionGoods = [...resultsIs_collection]
      } else if (!(!!Object.keys(resultsIs_collection).length) && !!Object.keys(resultsIn_stock_colec).length) {
        collectionGoods = [...resultsIn_stock_colec]
      }

       //длелаем чтобы выделяло элементы +
      Object.keys(collectionGoods).length && fullItemCartCheckedState ?
      collectionGoods = collectionGoods.map(res => {
        let items = { ...res, selected: fullItemCartChecked }
        setFullItemCartCheckedState(false)
        return items
      }) : null

      //        **********in_stock -> no_is_pack and no is_collection
      let inStockNoInpackNoInCollec = [];
      // Object.keys(stateCountCart.in_stock).length ?
      //   inStockNoInpackNoInCollec = stateCountCart.in_stock.filter(el => !el.is_pack && !el.is_collection)
      //   : null

        Object.keys(stateCountCart.in_stock).length ?
        inStockNoInpackNoInCollec = stateCountCart.in_stock.filter(el => el)
        : null
      //длелаем чтобы выделяло элементы нужно сделать условие GOOD!!!
      Object.keys(stateCountCart.in_stock).length && fullItemCartCheckedState ?
        inStockNoInpackNoInCollec = inStockNoInpackNoInCollec.map(el => ({ ...el, selected: fullItemCartChecked }))
        : null

      /*********************************************************************************** */
      //       **********cartitem_set -> Nois_pack and Nois_collection

      let resultsNoIs_packAndNoIsCollec = [];
      let finishResultNoIs_packNoIs_collection = [];
      let arrNoColAndNoPack = stateCountCart.cartitem_set
        // делаем первый вариант по желанию заказчика чтобы показывало товары по условиям выкупа

      // Object.keys(arrNoColAndNoPack).length ?
      //   (resultsNoIs_packAndNoIsCollec = arrNoColAndNoPack.reduce((prev, cur,i) => {
      //     let arr = cur.items.filter(el=>!el.is_collection && !el.is_pack)
      //     if(!!arr.length){
      //       prev.push({...cur, items:arr})
      //     }
      //     return prev
      //   },[])
      //   ) : null;

        // делаем второй вариант по желанию заказчика чтобы показывало товары по брендам   
        Object.keys(arrNoColAndNoPack).length ?
        (resultsNoIs_packAndNoIsCollec = arrNoColAndNoPack.reduce((prev, cur,i) => {
          let arr = cur.items.filter(el=>el)
          if(!!arr.length){
            prev.push({...cur, items:arr})
          }
          return prev
        },[])
        ) : null;
   
      Object.keys(resultsNoIs_packAndNoIsCollec).length && fullItemCartCheckedState ?
        resultsNoIs_packAndNoIsCollec = resultsNoIs_packAndNoIsCollec.map(res => {
          let items = res.items.map(el => ({ ...el, selected: fullItemCartChecked }))
          setFullItemCartCheckedState(false)
          return { ...res, items }
        }) : null
        //       // ----------------------------------------------
        collectionGoods = [];
        goodsInPack =  [];

        //       // *-*-*-*-*-*-*-*-*-*-*-*-*-*
      goods = {
        collectiion: collectionGoods,
        is_pack: goodsInPack,
        in_stock: inStockNoInpackNoInCollec,
        other_goods: resultsNoIs_packAndNoIsCollec //res.cartitem_set
      }
      
      setGoodsStateOpt(goods)
      // проверяем наличее чеков у всех карточек, создаём новый массив и отправляем запрос на бэк
      if (fullItemCartCheckedState) {
        let updateProduct = []
        let updateProduct1 = []
        let allArr1 = []
        let allArr2 = []
        let allArr3 = []
        let allArr4 = []

        //собираем в массив все элементы cartitem_set NoIs_pack

          updateProduct = resultsNoIs_packAndNoIsCollec.reduce((prev,cur) => {
            prev.push(...cur.items.filter(el=>el))
            return prev
          },[])

          updateProduct1 = updateProduct.filter(el => el.length)
          for (let i = 0; i < updateProduct1.length; i++) {
            allArr1 = [...allArr1, ...updateProduct1[i]]
          }

        allArr1 = updateProduct.filter(el=>el);
        allArr2 = collectionGoods.filter(el=>el);
        allArr3 = inStockNoInpackNoInCollec.filter(el=>el);
        allArr4 = goodsInPack.filter(el=>el);


        //собираем в массив все элементы cartitem_set NoIs_pack
        let updateProductAllArr = [...allArr1, ...allArr2, ...allArr3, ...allArr4]
        updateProductAllArr = updateProductAllArr.map(el => ({ id: el.id, selected: el.selected, qty: el.qty }))
        updateProductFromCart(updateProductAllArr),
        setFullItemCartCheckedState(!fullItemCartCheckedState)
      }


    } else {//если дроп/розница 

      let goods = {
        other_goods: [],
        in_stock: [],
      }
      let goodsInStock = [];
      let goodsOther = []
      stateCountCart.in_stock.length > 0
        ? goodsInStock.push(stateCountCart.in_stock)
        : stateCountCart.cartitem_set
          ? goodsOther = stateCountCart.cartitem_set.filter(item => item)
          : null

      let resultTurn = []
      fullItemCartCheckedState
        ? ((goodsInStock = goodsInStock.map((el) => ({ ...el, selected: fullItemCartChecked }))),
          (goodsOther = goodsOther.map((el) => ({ ...el, selected: fullItemCartChecked }))),
          (resultTurn = [...goodsInStock, ...goodsOther].map((el) => ({
            id: el.id,
            selected: el.selected,
            qty: el.qty,
          }))),
          updateProductFromCart(resultTurn),
          setFullItemCartCheckedState(!fullItemCartCheckedState))
        : null;

      goods = {
        other_goods: goodsOther,
        in_stock: goodsInStock,
      }
      setGoodsStateDropAndRetail(goods);

    }
    /**================================================================================================================= */
    setCartData(stateCountCart);
    newMassiveProducts(stateCountCart)

  }, [stateCountCart.in_cart, fullItemCartChecked, stateCountCart.total_price])

  const [massiveCart, setMassiveCart] = useState(initialMassiveCart);

  // ******************************************************************************************************
  // функция создания нового массива с товарами в карзине 
  /**
   * нужно проверить во всех возможных ролях
   * нужно проверить со всеми условиями выкупа
   */
  const newMassiveProducts = (produc) => {
    const newCartDataCartitem_set = [];
    const newCartDataIn_stock = [];
    let newIs_pack = [];
    produc.cartitem_set.filter(items => {
      items.is_pack ? newIs_pack.push(items.items) : newCartDataCartitem_set.push(items);
    })

    produc.in_stock.filter(items => {
      newCartDataIn_stock.push(items)
    })

    return setMassiveCart({
      cartitem_set: newCartDataCartitem_set,
      is_pack: newIs_pack,
      in_stock: newCartDataIn_stock,
    });
  };
  // **********готово*********************************************************************************
  const deleteProductFromCart = (id) => {
    
    apiCart
      .deleteCartData({
        item_id: id,
      })
      .then((res) => {
        dispatch('stateCountRestart/add', !stateCountRestart) ///???????????????
        // updateProductFromCart() нельзя циклится
      })
      .catch((err) => {
        console.log("err deleteProductFromCart", err);
        let errMessage = {
          path: null,
          success: null,
          fail : 'ошибка доступа к сервер, проверьте соединение',
        };
        dispatch('warrning/set',errMessage);
        
        
        
      });
  };

  // создание нового массива с єлементами которые выбраны для удаления
  // ***********`работает `*****************************/
  const getAllCartItemsFromWhoasale = (cartitem_set = [], in_stock = []) => {
    let results = [...in_stock];
    for (let i = 0; i < cartitem_set.length; i++) {
      const element = cartitem_set[i];
      results.push(...element.items);
    }
    return results;
  };

  const getEnabledCartItems = (items) => {
    let result = [];
    items.forEach((el) => {
      if (el.selected) result.push(el);
    });
    return result;
  };

  const multipleDeleteFromCart = () => {
    setOneClick(!oneClick)
    setTimeout(() => {
      setOneClick(false)
    }, 3000);
    let selectedCartItem;
    // условие для мульти удаления
    if (role === ROLE.WHOLESALE) {
      const allCartItems = getAllCartItemsFromWhoasale(stateCountCart.cartitem_set, stateCountCart.in_stock);
      selectedCartItem = getEnabledCartItems(allCartItems);
    } else {
      selectedCartItem = getEnabledCartItems(stateCountCart.cartitem_set);
    }
    if (!selectedCartItem.length) {
      return setTooltipNoSelectedProductsOpen(true);
    }
    confirmDeleteCartItem(() => {
      apiCart
        .multipleDeleteFromCart({ items: selectedCartItem })
        .then((res) => {
          dispatch('stateCountRestart/add', !stateCountRestart)
          closeModal();
          setOneClick(false)
        })
        .catch((err) => {
          closeModal();
          console.log('reject error', err);
          let errMessage = {
            path: null,
            success: null,
            fail : 'ошибка доступа к сервер, проверьте соединение',
          };
          dispatch('warrning/set',errMessage);
          
        });
    });
  };

  const confirmDeleteCartItem = (callback) => {
    setmodalStates({
      ...modalStates,
      show: true,
      callback: callback,
    });
  };
  // **********************************************************/

  // при нажатии + или - в корзине происходит добавление или удаление товара
  // ДОДЕЛАТЬ << is_performed >>
  const updateProductFromCart = (data = []) => {
    // обнавляем состояние карзины на сервере и в хранилище если обшибка допилить выдать попап и обновлять карзину
    apiCart
      .updateCartData([...data])
      .then((res) => {
        setIs_performed(res.is_performed)
        dispatch('stateCountCart/add', {
          ...stateCountCart,
          ...res
        })
      })
      .catch((err) => {
        console.error('ERROR обнавляем состояние карзины на сервере и в хранилище');
      });
  };

  //фунция обновления количества товараа " вкорзине -> карточке тоавара"
  const contextUpdateProductFromCard = (data) => {
    updateProductFromCart([data]);
    setTooltipNoSelectedProductsOpen(false);
  };

  if (!massiveCart.cartitem_set.length && !massiveCart.is_pack.length && !massiveCart.in_stock.length) {
    return <DefaultCartPreview page_type_catalog={page_type_catalog} />;
  }

  /********************************************************************** */
const textConditionPayPart_1 =  components[0].children[0].content.replace(/<p>|<\/p>/isg, '')
const textConditionPayPart_2 =  components[0].children[1].content.replace(/<p>|<\/p>/isg, '')
const {opt_minimum_price} = dataBalance;
console.log('dataBalance',opt_minimum_price);
  return (
    <Container>
      <GxModal
        onGx-after-hide={closeModal}
        open={modalStates.show}
        className={classNames({
          [styleModal['modal_creator']]: true,
          [styleModal['modal-confirm_delete']]: true,
        })}
      >
        <ModalContentViews.ModalWrapper customClassName={'modal-midle_wrap'}>
          <ModalContentViews.CloseBtn closeModal={closeModal} />
          <ModalContentViews.HeaderBlock mb={'5px'} title={'Удаление товаров'} />
          <ModalContentViews.Line />
          <ModalContentViews.ContentBlock>
            <ModalContentViews.ContentBlock>
              <ModalContentViews.SubText>
                Вы точно хотите удалить выбранные товары? Отменить действие будет невозможно
              </ModalContentViews.SubText>
            </ModalContentViews.ContentBlock>
            <ModalContentViews.CenterPosition>
              <Button onClick={modalStates.callback} variant={'cabinet_default'}>
                Удалить
              </Button>
            </ModalContentViews.CenterPosition>
          </ModalContentViews.ContentBlock>
        </ModalContentViews.ModalWrapper>
      </GxModal>

      <GxRow>
        <GxCol sizeLg={12} sizeMd={12} sizeSm={12} sizeXl={9} sizeXs={12} className="cart__left">

          <Title variant={'cart'} type={'h1'}>
            <Text text={'shopping.cart'} />: ({
              //****************************************************************************** */
              // здесь необходимо просчитать и показать общее количество товара
              // cartData.cartitem_set.length || cartData.in_stock.length
              // ?cartData.cartitem_set.length + cartData.in_stock.length
              // :0})
              in_cart})
          </Title>
          <CartViews.SelectedFilter
            multipleDeleteFromCart={multipleDeleteFromCart}
            tooltipOpen={tooltipNoSelectedProductsOpen}
            setFullItemCartChecked={setFullItemCartChecked}
            fullItemCartChecked = {fullItemCartChecked}
            enab={enab}
            setEnab={setEnab}
            setFullItemCartCheckedState={setFullItemCartCheckedState}
            oneClick={oneClick}
            countInCart ={stateCountCart.in_cart}
            countSelected={stateCountCart.selected}
          />
          <Title variant={'cart-min'} type={'h3'}>
            
            {(role === ROLE.WHOLESALE) ?
              <>
              {textConditionPayPart_1}{' '}
              {!!opt_minimum_price? opt_minimum_price.toFixed() : null}{' '}{currentCurrcensies}
              {textConditionPayPart_2}
              {front_admin?<Settings nameComponent={'opt_minimum_price'} /> : null }
              </>
              : null
            }
          </Title>
          <CartViews.WrapperCards>


            {/* ************************************************************************************************ */}


            {/* карточка товара в корзине для опта */}

            {(role === ROLE.WHOLESALE) ?

              (<>
                {Object.keys(goodsStateOpt.other_goods).length ?
                  goodsStateOpt.other_goods.map((el, i) => {
                    const isVisibleLine = goodsStateOpt.other_goods.length - 1 !== i;                  
                    return (
                      <ProductWhosaleHorizontalCard
                        key={el.id}
                        {...el}
                        currentCurrcensies={currentCurrcensies}
                        isVisibleLine={isVisibleLine}
                        deleteProductFromCart={deleteProductFromCart}
                        updateProductFromCart={contextUpdateProductFromCard}
                      />
                    );
                  })
                  : null}
                  {
                    Object.keys(goodsStateOpt.collectiion).length ?
                    <ProductWhosaleIsCollectionHorizontalCard
                      {...goodsStateOpt.collectiion}
                        currentCurrcensies={currentCurrcensies}
                        deleteProductFromCart={deleteProductFromCart}
                        updateProductFromCart={contextUpdateProductFromCard}
                      items={goodsStateOpt.collectiion}
                        is_collection={true}
                      />    
                    : null
                 }

                {Object.keys(goodsStateOpt.is_pack).length ?
                  <ProductWhosaleIsPackHorizontalCard
                    currentCurrcensies={currentCurrcensies}
                    deleteProductFromCart={deleteProductFromCart}
                    updateProductFromCart={contextUpdateProductFromCard}
                    items={goodsStateOpt.is_pack}
                    is_pack={true}
                  />
                  : null}

                {Object.keys(goodsStateOpt.in_stock).length ?
                  <ProductWhosaleInStockHorizontalCard
                    currentCurrcensies={currentCurrcensies}
                    deleteProductFromCart={deleteProductFromCart}
                    updateProductFromCart={contextUpdateProductFromCard}
                    items={goodsStateOpt.in_stock}
                  />
                  : null}
              </>)

              : (role === ROLE.DROPSHIPPER || role === ROLE.RETAIL) ?//если дроп
                // карточка товара в корзине для дропа и розницы
                goodsStateDropAndRetail.other_goods ?
                  goodsStateDropAndRetail.other_goods.map(el => {
                    return (

                      <ProductHorizontalCard
                        is_collection={el.is_collection}
                        key={el.id}
                        {...el}
                        role={role}
                        currentCurrcensies={currentCurrcensies}
                        values={values[el.id]}
                        deleteProductFromCart={deleteProductFromCart}
                        updateProductFromCart={contextUpdateProductFromCard}
                      />
                    )
                  })
                  : goodsStateDropAndRetail.in_stock ?
                    goodsStateDropAndRetail.in_stock.map(el => {
                      return (
                        <ProductHorizontalCard
                          is_collection={el.is_collection}
                          key={el.id}
                          {...el}
                          role={role}
                          currentCurrcensies={currentCurrcensies}
                          values={values[el.id]}
                          deleteProductFromCart={deleteProductFromCart}
                          updateProductFromCart={contextUpdateProductFromCard}
                        />
                      )
                    })
                    : null
                : null
            }

          </CartViews.WrapperCards>
        </GxCol>

        <GxCol
          ref={rightSideWrapper}
          sizeLg={12}
          sizeMd={12}
          sizeSm={12}
          sizeXl={3}
          sizeXs={12}
          className="cart__right"
        >
          <CartViews.WrapperRightSide>
            <CartViews.BlockRightSide mb={20}>
              <CartViews.Text type={'text-title'}>
                <Text text={'you.order'} />
              </CartViews.Text>
              <CartViews.Text type={'text-sub'}>
                {selected} <Text text={'product.s'} />
              </CartViews.Text>
            </CartViews.BlockRightSide>
            <CartViews.BlockRightSide>
              <CartViews.Text type={'text-default'}>
                <Text text={'order.cost'} />
              </CartViews.Text>
              <CartViews.Text type={'text-default_currency'}>
                {total_price ?? 0} {currentCurrcensies}
              </CartViews.Text>
            </CartViews.BlockRightSide>
            {ROLE.RETAIL === role ? (
              <div>
                <CartViews.BlockRightSide>
                  <CartViews.Text type={'text-default'}>
                    <Text text={'sale'} />
                  </CartViews.Text>

                  <CartViews.Text type={'text-red'}>
                    {total_discount} {currentCurrcensies}
                  </CartViews.Text>
                </CartViews.BlockRightSide>
              </div>
              ) : null
            }

            <CartViews.Line />
            <CartViews.BlockRightSide mb={20}>
              <CartViews.Text type={'text-title'}>
                <Text text={'total.payable'} />:
              </CartViews.Text>
              <CartViews.Text type={'text-title'}>
                {total_price ?? 0} {currentCurrcensies}
              </CartViews.Text>
            </CartViews.BlockRightSide>

            <CartViews.LinkToFirmalization
              enabled={agreeWitheRegulations && is_performed}
              to={checkout_slug}
            >
              <Text text={'go.to.registration'} />
            </CartViews.LinkToFirmalization>

            <CartViews.BlockRightSide mt={20} mb={20} fd={'column'}>
              <CheckBox
                variant={'informations_block'}
                checked={agreeWitheRegulations}
                onGx-change={(e) => {
                  const checked = e.target.checked;
                  if (checked === null) return;
                  setAgreeWitheRegulations(checked);
                }}
                label={
                  <CartViews.Text type={'text-label'}>
                    Согласен с{' '}
                    <Link
                      // target="_blank"

                      to={'/information/juridical'}>
                      условиями оформления заказа{' '}
                    </Link>
                    на торговой бизнес-платформе и с{' '}
                    <Link
                      // target="_blank"
                      to={'/information/exchange'}>
                      правилами возврата
                    </Link>
                  </CartViews.Text>
                }
              />
            </CartViews.BlockRightSide>

          </CartViews.WrapperRightSide>
        </GxCol>
      </GxRow>
    </Container>
  );
};

export default React.memo(Cart);

