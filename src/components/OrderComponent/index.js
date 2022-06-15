import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Title from '../../Views/Title';
import Text from '../Text';
import CartViews from '../../Views/CartViews';
import CheckBox from '../../Views/CheckBox';
import { Link, useHistory } from 'react-router-dom';
import { GxCol, GxModal, GxTooltip, GxButton } from '@garpix/garpix-web-components-react';
import OrderingCards from './OrderingCards';
import { Formik } from 'formik';
import OrderingPay from './OrderingPay';
import OrderingDelivery from './OrderingDelivery';
import OrderingAddress from './OrderingAddress';
import { orderCreatePasportAndDelivery } from '../../utils/schemesFormic';
import ModalContentViews from '../../Views/ModalContentViews';
import classNames from 'classnames';
import { useStoreon } from 'storeon/react';
import PayModalContent from '../BalanceComponent/PayModalContent';
import GoBackToCartModalContent from '../GoBackToCartModalContent';
import api from '../../api';
import dayjs from '../../utils/dayjs';
import { ROLE, STATUS_EQUARING } from '../../const';
import styleModal from '../../Views/ModalCreator/modalCreator.module.scss';
import OrderCar from '../../#lifehack/OrderCar/OrderCar';
import Item from '../../Views/NotificationsViews/Item';
import Select from '../../Views/Select';
import style from '../../Views/Select/select.module.scss';
import { checkLocalStorage } from '../../utils';

const OrderComponent = ({
  payment_methods,
  delivery_methods,
  cart_content,
  profile,
  role_configuration,
  site_configuration,
}) => {
  const initialState = {
    isLoad: false,
  };

  const initialValues = {
    payment_methods: null,
    variant: null,
    needPassport: false,
    lastname: null,
    firstname: null,
    patronomic: null,
    serias_and_number_passport: null,
    issued_passport: null,
    issued_date: null,
    comment: null,
    agree_personal_data: true,
    waitForCall: false,
    selectedAdress: null,
    comment_order: null,
  };

  //************************************** */
  const history = useHistory();
  const { stateCountCart, dispatch } = useStoreon('stateCountCart');
  const { stateCountRestart } = useStoreon('stateCountRestart');
  const { updateCurrenssies } = useStoreon('updateCurrenssies');
  const { stateUpdateBalance } = useStoreon('stateUpdateBalance');
  const { dataBalance } = useStoreon('dataBalance');
  const { currenssies } = useStoreon('currenssies'); //currenssies
  const { userPage } = useStoreon('userPage');
  const { orderFunc } = useStoreon('orderFunc');
  
  const [stateCreateOrder, setStateCreateOrder] = useState(false);
  const [cart_contentOrder, setCart_contentOrder] = useState({});
  const [styleCar, setStyleCar] = useState('orderCar disable');
  const [priceNowDilevery, setPriceNowDilevery] = useState(0);
  const [agreeWitheRegulations, setAgreeWitheRegulations] = useState(true);
  const [fieldCountryOut, setFieldCountryOut] = useState('country');
  const [valueStatePay, setValueStatePay] = useState(3);
  const [modalStates, setmodalStates] = useState({
    show: false,
    content: null,
    cusstomClassNameModalResize: null,
  });
  const [statusFildValue, setStatusFildValue] = useState(+window?.localStorage?.getItem('numOrder'));
  const [openTooltip, setOpenTooltip] = useState(false);
  const [listOrders, setlistOrders] = useState([
    {
      title: 'Не создан не один заказ',
      value: 1,
    },
  ]);
  //************************************** */
  const { cart_slug, page_type_cart } = site_configuration;
  const orderApi = api.orderApi;
  const { role } = userPage.profile;
  //************************************** */
  const hideModal = () => {
    dispatch('modal/update', {
      show: false,
      content: null,
      addClass: false,
    });
  }
  const errorsMessenge = {};


  //************************************** */
  useEffect(()=>{
    dispatch('stateUpdateBalance/update',!stateUpdateBalance)
    hideModal();
  },[])
  // список созданых заказов
  useEffect(() => {
    orderApi
      .listOrderItem()
      .then((res) => setlistOrders(res.results))
      .catch((err) => console.log('response list order ERROR', err));
  }, [updateCurrenssies]);

  let newListRes = listOrders.filter(el=>el.status?.status === 'in_process');// || el.status?.status === 'payment_waiting');
  const options = newListRes.map((el) => {
    return {
      title: `${el.order_number} (${el.total} ${currenssies})`,
      value: el.id,
    };
  });

  const focuseSelector = () => {
    setOpenTooltip(null);
  };
  options.push({
    title: 'Отменить выбор',
    value: null,
  });

  const changeStatusOrder = (e) => {
    window?.localStorage?.removeItem('numOrder')
    setStatusFildValue(+e.target.value);
  };

  
  const closeModal = () => {    
    setmodalStates({
      show: false,
      content: null,
    });
    const pathName = history.location.pathname.split("/");
    pathName[pathName.length - 1] === 'order' && stateCreateOrder ? 
      history.push('orders') 
        : null
  };

  const openModalAddAddress = (content = null) => {
    setmodalStates({
      show: true,
      content: content,
    });
  };

  const openModalPay = (order_id, now_balance = null, total_price = null) => {
    // hideModal();
    orderApi
      .getRandomRequizites()
      .then((res) => {
        setmodalStates({
          content: (
            <PayModalContent
              closeModal={closeModal}
              requisites={res}
              order_id={order_id}
              now_balance={now_balance}
              total_price={total_price}
              currenssies={currenssies}
              OrderComponent={true}
            />
          ),
          show: true,
          cusstomClassNameModalResize: 'modal-payments',
        });
      })
      .catch((err) => {
        console.error(`ERROR "OrderComponent" openModalPay ${err}`);
        //history.push('cart')
      });
  };

  const openModalGoBackToCart = (e) => {
    e.preventDefault();
    const gotoCartFunc = () => {
      history.push('cart');
    };
    setmodalStates({
      content: (
        <GoBackToCartModalContent
          closeModal={closeModal}
          page_type_cart={page_type_cart}
          gotoCartFunc={gotoCartFunc}
        />
      ),
      show: true,
      cusstomClassNameModalResize: 'modal-payments',
    });
  };

  // **************************************************************************************************************************************
  const getNowCurrencyNowCountry = (country) => {
      if (country === fieldCountryOut) {
        orderApi
          .getCountryDeliviry({ country: fieldCountryOut, currency: currenssies })
          .then((res) => {
            setPriceNowDilevery(res.price);
          })
          .catch((err) => console.error(`ERROR!!!!! ${err}`));
      }else{
        setPriceNowDilevery(0);
      }
  };
  // **********создаём заказ с отправкой на сервер***************************************************************************************************************
  const creteOrder = (values) => {
    const date = dayjs(api.language, values.issued_date).format('DD.MM.YYYY');
    checkLocalStorage('productId') ? localStorage.removeItem('productId') : null;

    let params = {
      payment_method: values.payment_methods,
      delivery_method: values.variant,
      delivery_address: values.selectedAdress,
      first_name: values.first_name,
      middle_name: values.patronomic,
      last_name: values.last_name,
      passport_number: values.serias_and_number_passport,
      passport_issued: values.issued_passport,
      passport_issue_date: date && date !== 'Invalid Date' ? date : null,
      agree_personal_data: values.agree_personal_data,
      wait_call: values.waitForCall,
      comment_passport: values.comment,
      comment_order: values.comment_order,

      order_cost: cart_contentOrder.price,
      discount: cart_contentOrder.discount,
      total_cost: cart_contentOrder.price,
      currency: currenssies,
      add_goods_order_id: statusFildValue,
    };
      role === ROLE.RETAIL ? 
      params = {
        ...params,
        delivery_cost: priceNowDilevery,
      }
      :null 

        dispatch('spinner');
        if(!(!!statusFildValue)){
          if (role === ROLE.DROPSHIPPER) {
            //если дробшипер списание со счета при достаточном количестве денег на счету
              if (params.total_cost < dataBalance.balance) {
                //если достаточно денег на счету
                orderApi
                  .createOrder(params)
                  .then((res) => {
                    dispatch('stateCountRestart/add', !stateCountRestart);
                    dispatch('stateUpdateBalance/update', !stateUpdateBalance)
                    history.push('orders');
                  })
                  .catch((err) => {
                    console.log(`ERROR creteOrder pay BALANCE, ${err}`);
                    openModalRejectedOrdering('cart');
                  });
              } else {
                //создаём заказ когда нет деньг на счету
                orderApi
                  .createOrder(params)
                  .then((res) => {
                    const order_id = res.id;
                    // setStateCreateOrder(true)
                    openModalPay(order_id, dataBalance.balance, params.total_cost);
                    dispatch('stateCountRestart/add', !stateCountRestart);
                  })
                  .catch((err) => {
                    console.log(`ERROR creteOrder pay ONLINE, ${err}`);
                    openModalRejectedOrdering('cart');
                  });
              }
            //***************************************************************************** */
          } else if (ROLE.RETAIL === role) {
            //если розничный
            //если оплата с баланса
            if (params.total_cost < dataBalance.balance) {
              //создаём заказ когда списуют деньги со счёта
              orderApi
                .createOrder(params) 
                .then((res) => {
                  dispatch('stateCountRestart/add', !stateCountRestart);
                  dispatch('stateUpdateBalance/update', !stateUpdateBalance)
                    history.push('orders');
                })
                .catch((err) => {
                  console.log(`ERROR creteOrder pay BALANCE, ${err}`);
                  openModalRejectedOrdering('cart');
                });
            } else {
              orderApi
                .createOrder(params)
                .then((res) => {
                  const order_id = res.id;
                  // setStateCreateOrder(true)
                  openModalPay(order_id, dataBalance.balance, params.total_cost + priceNowDilevery);
                  dispatch('stateCountRestart/add', !stateCountRestart);
                })
                .catch((err) => {
                  console.log(`ERROR creteOrder pay BALANCE, ${err}`);
                  openModalRejectedOrdering('cart');
                });
            }
          } else if (ROLE.WHOLESALE === role) {
            //если оптовик
              if (params.total_cost < dataBalance.balance) {
                orderApi
                  //создаём заказ когда списуют деньги со счёта
                  .createOrder(params)
                  .then((res) => {
                    dispatch('stateCountRestart/add', !stateCountRestart);
                    dispatch('stateUpdateBalance/update', !stateUpdateBalance)
                    history.push('orders');
                  })
                  .catch((err) => {
                    console.log(`ERROR creteOrder pay BALANCE, ${err}`);
                    openModalRejectedOrdering('cart');
                  });
              } else {
                orderApi
                  .createOrder(params)
                  .then((res) => {
                    const order_id = res.id;
                    //диалоговое окно оплаты по реквизитам
                    // setStateCreateOrder(true)
                    openModalPay(order_id, dataBalance.balance, params.total_cost);
                    dispatch('stateCountRestart/add', !stateCountRestart);
                  })
                  .catch((err) => {
                    dispatch('stateCountRestart/add', !stateCountRestart);
                    console.log(`ERROR creteOrder pay ONLINE, ${err}`);
                    openModalRejectedOrdering('cart');
                  });
              }
          } else {
            alert('HZ who are you');
          }
        }else{
          // dispatch('spinner');
          orderApi
          .createOrder(params) 
          .then((res) => {
            dispatch('stateCountRestart/add', !stateCountRestart);
            dispatch('stateUpdateBalance/update', !stateUpdateBalance)
              history.push('orders');
          })
          .catch((err) => {
            console.log(`ERROR creteOrder pay BALANCE, ${err}`);
            openModalRejectedOrdering('cart');
          });
        // history.push('orders');
        }

  }

  // **************************************************************************************************************************************
    const getEnabledToPayments = (values, errors) => {
    //устанавливаем состояние как делать оплату online(1) или с баланса(3)
    if (!statusFildValue) {
      values.payment_methods === 1 ? setValueStatePay(1) : setValueStatePay(3);
      if (
        values.payment_methods &&
        values.variant &&
        values.selectedAdress &&
        agreeWitheRegulations
      ) {
        styleCar === 'orderCar disable' ? setStyleCar('orderCar'):null
        //?если нужен паспорт то проверим валидность введённых данных
        if (values.needPassport && !values.waitForCall) {
          if (Object.keys(errors).length == 0 && values.agree_personal_data) {
            return true;
          }
          //?В случае если выбрана опция дождаться звонка мы игнорируем проверку паспортных данных
        } else if (values.waitForCall) {
          return true;
        } else {
          // делает октивной кнопку перейти к оформлению
          return true;
        }
      } else {
        return false;
      }
    } else {
      styleCar === 'orderCar disable' ? setStyleCar('orderCar'):null
      return true;
    }
  };
  // **************************************************************************************************************************************
  const openModalRejectedOrdering = (funcGoTo) => {
    setmodalStates({
      show: true,
      cusstomClassNameModalResize: 'modal-success_error',
      content: (
        <ModalContentViews.ModalWrapper>
          <ModalContentViews.CloseBtn closeModal={closeModal} />
          <ModalContentViews.ContentBlock>
            <ModalContentViews.CenterPosition>
              <ModalContentViews.SuccessOrError
                closeModal={closeModal}
                success={false}
                funcGoTo={funcGoTo}
                content={
                  <>
                    <div>Упс...</div>
                    <div>Не удалось оформить заказ!</div>
                    <div>Попробуйте позже</div>
                  </>
                }
              />
            </ModalContentViews.CenterPosition>
          </ModalContentViews.ContentBlock>
        </ModalContentViews.ModalWrapper>
      ),
    });
  };

  // создадим новый моссив с товарами для отрисовки
  useEffect(() => {
    if (stateCountCart !== 0) {
      let newCartAlPerfomed = {};
      if (stateCountCart.is_performed) {
        let res_cartitem_set = [];
        let res_in_stock = [];
        const createDataItemsOptDrop = (data) => {
          let res = [];
          data.items.map((el) => {
            // условия сборки выброных позиций
            if (el.selected) {
              el = {
                brand: el.product.brand,
                change_agreement: el.change_agreement,
                color: el.color,
                comment: '',
                discount: 1,
                id: el.id,
                image: el.product.image,
                is_pack: el.is_pack,
                old_price: el.old_price,
                price: el.price,
                qty: el.qty,
                size: el.size,
                title: el.product.title,
                total_price: el.total_price,
                url: el.url,
              };
              res.push(el);
            }
          });
          return {
            id: data.id,
            is_performed: data.is_performed,
            items: res,
            title: data.title,
            condition: data.condition,
          };
        };
        // здесь мы перебираем все элементы в массиве которые имеют отметку и соответствуют условиям збора
        if (role === ROLE.WHOLESALE) {
          stateCountCart.cartitem_set.map((el) => {
            el.is_performed ? res_cartitem_set.push(createDataItemsOptDrop(el)) : null;
          });
        } else {
          stateCountCart.cartitem_set.map((el) => {
            el.selected ? res_cartitem_set.push(el) : null;
          });
        }
        //************************************ */
        const creteDataInstock = (data) => {
          let res = [];
          return (res = {
            color: data.color,
            discount: 1,
            id: data.product.id,
            old_price: data.old_price,
            price: data.price,
            brand: data.product.brand,
            qty: data.qty,
            image: data.product.image,
            size: data.size,
            title: data.product.title,
            change_agreement: data.change_agreement,
            total_price: data.total_price,
            currenssies: currenssies,
            url: data.url,
          });
        };
        //собираем данные по категории товар в наличии
        stateCountCart.in_stock.map((el) => {
          el.selected ? res_in_stock.push(creteDataInstock(el)) : null;
        });
        //************************************ */
        /**
         * is_pack не предусмотрен пока в заказах если что добавить
         */
        //************************************ */
        newCartAlPerfomed = {
          cartitem_set: res_cartitem_set,
          created_at: stateCountCart.created_at,
          delivery_price: stateCountCart.delivery_price,
          id: stateCountCart.id,
          in_cart: stateCountCart.in_cart,
          in_stock: res_in_stock,
          is_performed: stateCountCart.is_performed,
          selected: stateCountCart.selected,
          total_discount: stateCountCart.total_discount,
          total_order_price: stateCountCart.total_order_price,
          total_price: stateCountCart.total_price,
          updated_at: stateCountCart.updated_at,
          cart_items: res_cartitem_set,
          price: stateCountCart.total_price,
          delivery: { price: 0 },
          render: true,
        };
      }
      setCart_contentOrder(newCartAlPerfomed);
    }
  }, [stateCountCart.in_cart, priceNowDilevery, fieldCountryOut, stateCountCart.total_price, currenssies]);
  const onSubmit = (values) => {
    creteOrder(values)
  };


  return (
    <React.Fragment>
      <GxModal
        // onGx-after-hide={closeModal}
        open={modalStates.show}
        className={classNames({
          [styleModal['modal_creator']]: true,
          [styleModal[modalStates.cusstomClassNameModalResize]]:
            modalStates.cusstomClassNameModalResize,
        })}
      >
        <ModalContentViews.CloseBtn closeModal={closeModal} />
        {modalStates.content}
      </GxModal>

      <Formik
        validationSchema={orderCreatePasportAndDelivery(errorsMessenge)}
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, handleChange, values, errors, setFieldValue, touched }) => {
          const [fieldCountry, setFieldCountry] = useState('country');
          handleChange = (data) => {
            fieldCountryOut !== data ? null : getNowCurrencyNowCountry(data);
          };
          setFieldCountryOut(fieldCountry);
            //запускаем анимацию кнопки создания заказа и отправка на бэк запроса
          if (orderFunc) {
            if(!stateCreateOrder){
              setStateCreateOrder(true)
              const timerBtn = setTimeout(() => {
                onSubmit(values)
                dispatch('orderFunc/state', false);
                return () => clearTimeout(timerBtn);
              }, 7000);
            }
          } else {
            null;
          }

          return (
            <React.Fragment>
              <GxCol
                sizeLg={12}
                sizeMd={12}
                sizeSm={12}
                sizeXl={9}
                sizeXs={12}
                className="ordering__left"
              >
                <Link onClick={openModalGoBackToCart} to={cart_slug} className="linkblue">
                  {'<'} Назад в корзину
                </Link>
                <Title variant={'cart'} type={'h1'}>
                  <Text text="ordering" />
                </Title>
                {statusFildValue ? <h4>Заказ № {listOrders.filter(item => item.id === statusFildValue)[0]?.order_number}</h4>:null}
                {
                  cart_contentOrder.render ? ( 
                    <>
                      <OrderingCards
                        currenssies={currenssies}
                        cart_content={cart_contentOrder}
                        role_configuration={role_configuration}
                      />

                      {!statusFildValue ? (
                        <> 
                          <OrderingPay
                            setFieldValue={setFieldValue}
                            values={values.payment_methods}
                            payment_methods={payment_methods}
                            role={role}
                            dataBalance={dataBalance.balance} 
                            total_cost={cart_contentOrder.price}
                          />

                          <OrderingDelivery
                            values={{
                              variant: values.variant,
                              lastname: values.lastname,
                              firstname: values.firstname,
                              patronomic: values.patronomic,
                              serias_and_number_passport: values.serias_and_number_passport,
                              issued_passport: values.issued_passport,
                              issued_date: values.issued_date,
                              comment: values.comment,
                              agree_personal_data: values.agree_personal_data,
                              waitForCall: values.waitForCall, 
                              needPassport: values.needPassport,
                            }}
                            role_configuration={role_configuration}
                            role={role_configuration.role.number}
                            errors={errors}
                            touched={touched}
                            delivery_methods={delivery_methods}
                            setFieldValue={setFieldValue}
                          />

                          <OrderingAddress
                            role={role_configuration.role.number}
                            selectedAdress={values.selectedAdress}
                            profileId={profile.id}
                            closeModal={closeModal}
                            setFieldValue={setFieldValue}
                            openModalAddAddress={openModalAddAddress}
                            setFieldCountry={setFieldCountry}
                            handleChange={handleChange}
                          />
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <>
                      <Title variant={'cart'} type={'h1'}>
                        <Text text={"dont_one_order"} />
                      </Title>
                    </>
                  )
                }
              </GxCol>
              <GxCol
                sizeLg={12}
                sizeMd={12}
                sizeSm={12}
                sizeXl={3}
                sizeXs={12}
                className="ordering__right"
              >
                <CartViews.WrapperRightSide>
                  <CartViews.BlockRightSide mb={20}>
                    <CartViews.Text type={'text-title'}>
                      <Text text={'you.order'} />
                    </CartViews.Text>
                    <CartViews.Text type={'text-sub'}>
                      {cart_contentOrder.render ? cart_contentOrder.selected : null}&nbsp;
                      <Text text={'product.s'} />
                    </CartViews.Text>
                  </CartViews.BlockRightSide>
                  <CartViews.BlockRightSide>
                    <CartViews.Text type={'text-default'}>
                      <Text text={'order.cost'} />
                    </CartViews.Text>
                    <CartViews.Text type={'text-default_currency'}>
                      {cart_contentOrder.price}&nbsp;
                      {currenssies}
                    </CartViews.Text>
                  </CartViews.BlockRightSide>

                 { ROLE.RETAIL === role ? (
                    <>
                      <CartViews.BlockRightSide>
                        <CartViews.Text type={'text-default'}>
                          <Text text={'sale'} />
                        </CartViews.Text>

                        <CartViews.Text type={'text-red'}>
                          {cart_contentOrder.total_discount
                            ? `${cart_contentOrder.total_discount} 
                          ${currenssies}`
                            : null}
                        </CartViews.Text>
                      </CartViews.BlockRightSide>

                      {fieldCountry !== 'country' ? (
                      
                        <CartViews.BlockRightSide>
                          {cart_contentOrder.delivery ? (
                            <>
                              <CartViews.Text type={'text-default'}>
                                <Text text={'shipping'} />
                              </CartViews.Text>
                              <CartViews.Text type={'text-default_currency'}>
                                {priceNowDilevery
                                  ? `${priceNowDilevery}
                            ${currenssies}`
                                  : null}
                              </CartViews.Text>
                            </>
                          ) : null}
                        </CartViews.BlockRightSide>
                      ) : null}
                    </>
                  ) : ROLE.WHOLESALE === role ? (
                    <div>
                      Доставка: <span>По тарифам КАРГО</span>
                    </div>
                  ) : ROLE.DROPSHIPPER === role ? (
                    <div>
                      Доставка: <span>По весу, рассчитывается при упаковке</span>
                    </div>
                  ) : null}
                  <CartViews.Line />
                  <CartViews.BlockRightSide mb={20}>
                    <CartViews.Text type={'text-title'}>
                      <Text text={'total.payable'} />:
                    </CartViews.Text>
                    <CartViews.Text type={'text-title'}>
                      {/* добавляем к сумме стоимость доставки */}
                      {
                        <>
                          {ROLE.RETAIL === role
                            ? priceNowDilevery
                              ? (cart_contentOrder.price + priceNowDilevery).toFixed(2)
                              : cart_contentOrder.price
                            : cart_contentOrder.price}
                            &nbsp;
                          {currenssies}
                        </>
                      }
                    </CartViews.Text>
                  </CartViews.BlockRightSide>
                  <div className={style['old-order']}>
                    <GxTooltip
                      content="Добавить товары к существующему заказу "
                      placement="top"
                    >
                      <Select
                        onFocus={focuseSelector}
                        autoFocus
                        variant="black"
                        value={statusFildValue}
                        placeholder="Добавить товары к существующему заказу"
                        options={options}
                        onGx-change={changeStatusOrder}
                        className='old-order__list'
                      ></Select>
                    </GxTooltip>
                  </div>
                  <OrderCar  
                    enabled={getEnabledToPayments(values, errors)} 
                    setStyleCar={setStyleCar} 
                    styleCar={styleCar}
                    selectedAdress={values.selectedAdress}
                    variant={values.variant}
                    payment_methods={values.payment_methods}
                  />

                  <CartViews.BlockRightSide mt={20} mb={20}>
                    <CheckBox
                      checked={agreeWitheRegulations}
                      onGx-change={() => {
                        setAgreeWitheRegulations(!agreeWitheRegulations);
                      }}
                      label={
                        <CartViews.Text type={'text-label'}>
                          Согласен с <Link to={'#'}>условиями оформления заказа </Link>
                          на торговой бизнес-платформе и с <Link to={'#'}>правилами возврата</Link>
                        </CartViews.Text>
                      }
                    />
                  </CartViews.BlockRightSide>
                </CartViews.WrapperRightSide>
              </GxCol>
            </React.Fragment>
          );
        }}
      </Formik>
    </React.Fragment>
  );
};
export default React.memo(OrderComponent);
