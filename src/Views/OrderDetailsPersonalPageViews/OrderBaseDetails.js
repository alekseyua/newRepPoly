import React, { useState } from 'react';
import CartViews from '../../Views/CartViews';
import Text from '../../components/Text';
import { ROLE } from '../../const'
import {
  addressIcon,
  wallet,
  truck,
  statusWait,
  statusSend,
  statusWork,
  statusOrdered,
  statusPackage,
  statusClosed,
  statusReturn,
  statusCancel,
  toolTipIcon,
} from '../../images';
import { GxButton, GxIcon } from '@garpix/garpix-web-components-react';
import { useStoreon } from 'storeon/react';
import style from './styles/index.module.scss';
import ModalContentViews from '../../Views/ModalContentViews';
import PayModalContent from '../../components/BalanceComponent/PayModalContent';
import api from '../../api';
import Button from '../../Views/Button';
import { findAllByDisplayValue } from '@testing-library/react';

const OrderBaseDetails = ({
  payment_method,
  delivery_method,
  delivery_address,
  comment,
  discount,
  weight,
  status,
  currentCurrcensies,
  setModalStates,
  numberOrder,
  delivery_cost = 0,
  order_cost = 0,
  total_cost = 0, 
}) => {
  const {
    city,
    country,
    first_name,
    flat,
    house,
    id,
    last_name,
    middle_name,
    phone,
    post_code,
    profile,
    street,
  } = delivery_address;

  const getIconFromStatus = (id) => {
    const statusIcons = {
      work: statusWork,
      created: statusOrdered,
      sended: statusSend,
      payment_waiting: statusSend,
      in_process: statusWork,
      packaging: statusPackage,
      delivery_payment_waiting: statusWait,
      closed: statusClosed,
      canceled: statusCancel,
      return: statusReturn,
      default: statusWait,
    };


    if (statusIcons.hasOwnProperty(id)) {
      return statusIcons[id];
    } else {
      return statusIcons.default;
    }
  };
  const { userPage }  = useStoreon('userPage');
  const { role }      = userPage.profile;
  const orderApi = api.orderApi;
  const closeModal = () => {
    setModalStates({
      content: null,
      show: false,
      addClass: null,
    });
  };


  // const sumFromDilivery = (delivery_cost + order_cost).toFixed(2);
  const heandlerClickInfo = () => {
    setModalStates({
      content: (<>
        <ModalContentViews.CloseBtn closeModal={closeModal} />
            <p
              style={
                {
                  fontSize: '18px',
                  padding: '10px 25px',

                }
              }
            >
          {
          status.id === 'payment_waiting'?
              `?????? ?????????? ???${numberOrder} ?????? ?????????????? ????????, ?????????????? ?????????????????????? ???????????? ???? ??????????. ?? ?????????????? ?????????? ???????????????????? ???????????????????? ?????? ????????????, ???????? ?????????? ?????????? ??????????????.`
              : status.id === 'in_process' ?
                <>?????? ?????????? ???{numberOrder} ?????????????? ?? ?????????????? ?? ???????????? ?????????????????? ???? ????????????????. ?????? ?????????? ?????????????????????????? ?? ???????? ??????????????. ???????? ?????????? ?? ?????????????? "????????????????"-?????????? ?????????????? ?? ????????????????????. ?????????????? ?????????????????????? ???? ??????????. {role === ROLE.RETAIL ? '' : ' ???????? ?????????? ?? ?????????????? "?? ??????????" ?????? ????????????, ?????? ???????? ???????? ???? ?????????????????? ??????. ?????? ???????????? ?????? ?????????? ???????????? ?????????????????? ?????????? ?????????????????????? ??????????, ???????????? ???????????? ?????????????????? ???? "?????????? ??????????????". ?? ?????????? ?????????????? ???????????? ?????????? ???????????? ???????????????? ???????????? ?????????? ?????????????????????????? ??????????'} </>
                  : status.id === 'packaging' ?
                    `?????? ???????????? ???${numberOrder} ?????????????????? ???? ???????????????? ?? ?????????? ?????????????????? ?? ?????????????? ???????? ?????????????? ????????`
                    : status.id === 'delivery_payment_waiting' && role === ROLE.DROPSHIPPER ?
                      `???? ?????????? ?????????????? ???? ?????????????? ?????????????? ?????? ???????????? ?????????????????? ???????????????? ???????????? ???${numberOrder}. ????????????????????, ?????????????????? ????????????.`
                      : status.id === 'delivery_paid' ?
                        `?????? ?????????? ???${numberOrder} ?????????? ?? ????????????????.`
                        : status.id === 'sended' ?
                          `?????? ?????????? ???${numberOrder} ??????????????????. ???????? ?????????? ???????????????? ?? ???????????? ????????????????`
                          : status.id === 'canceled' ?
                            `?????????? ???${numberOrder} ?????? ?????????????? ${comment ? comment : ''}.`
                            : status.id === 'return' ?
                              `???? ???????????? ???${numberOrder} ???????????????? ??????????????`
                            :role === ROLE.WHOLESALE? `?????? ?????????? ???${numberOrder} ???????????????? ?? ?????????????? ???? ????????????????. ???????????????? ?????????????????????? ???????????? ???? ?????????? ?? ????????????` : `?????? ?????????? ???${numberOrder} ???????????????? ?? ?????????????? ???? ????????????????. ???????????????? ?????????? ?????????????????????? ?? ?????????????? ???????? ?????????????? ????????`
          }
            </p>

      </>),
      show: true,
      addClass: 'modal-info-order',
    });
  }

    const openModalPay = (e) => {
      e.preventDefault()
      orderApi.getRandomRequizites().then((res) => {
          setModalStates({
            content: <PayModalContent 
                        closeModal={closeModal} 
                        requisites={res} 
                        order_id={numberOrder}
                      />,
            show: true,
            addClass: 'modal-payments',
          });
        });
    };
  return (
    <div className={style['cabinet_orders_details__ordercard']}>
      <div className={style['cabinet_orders_details__wrapper']}>
        <div className={style['cabinet_orders_details__leftside']}>
          <div className={style['cabinet_orders_details__paystatus']}>
            <GxIcon
              src={getIconFromStatus(status.id)}
              className={style['cabinet_orders_details__icon']}
            />
            {status.title}
            <div className='inner-areon'>
              <button
                circle
                size="sm"
                variant="info"
                className={style['cabinet_orders_details__tooltipicon']}
                onClick={heandlerClickInfo}
              >
                <GxIcon src={toolTipIcon} />
              </button>
            </div>
            {status.id === 'payment_waiting'?
              <Button onClick={openModalPay} variant={'cabinet_default'}>
                ???????????????? ?????????? 
              </Button>
              :null
            }
          </div>
          <div className={style['cabinet_orders_details__middle']}>
            <div className={style['cabinet_orders_details__pay']}>
              <GxIcon src={wallet} className={style['cabinet_orders_details__icon']} />
              {payment_method}
            </div>
            <div className={style['cabinet_orders_details__delivery']}>
              <GxIcon src={truck} className={style['cabinet_orders_details__icon']} />
              {delivery_method}
            </div>
          </div>
          <div className={style['cabinet_orders_details__address']}>
            <GxIcon src={addressIcon} alt="address" className={style['cabinet-address__icon']} />
            <div className={style['cabinet-address__desc']}>
              <div className={style['cabinet-address__value']}>
                {country}, {post_code} {city}, {street},{house}, {flat}
              </div>
              <div className={style['cabinet-address__name']}>
                {last_name} {first_name} {middle_name}
              </div>
              <div className={style['cabinet-address__phone']}>{phone}</div>
            </div>
          </div>
        </div>
        <CartViews.WrapperRightSide>
          <CartViews.BlockRightSide>
            <CartViews.Text type={'text-default'}>?????? ??????????????:</CartViews.Text>
            <CartViews.Text type={'text-default_currency'}>{weight} ????</CartViews.Text>
          </CartViews.BlockRightSide>
          <CartViews.BlockRightSide>
            <CartViews.Text type={'text-default'}>
              <Text text={'order.cost'} />&nbsp;
            </CartViews.Text>
            <CartViews.Text type={'text-default_currency'}>
            {order_cost.toFixed(2)}&nbsp;{currentCurrcensies}
            </CartViews.Text>
          </CartViews.BlockRightSide>

          {(role === ROLE.RETAIL)
          ?( <>  
            <CartViews.BlockRightSide>
            {
              !!discount?
                (<>
                  <CartViews.Text type={'text-default'}>
                    <Text text={'sale'} />
                  </CartViews.Text>
                  <CartViews.Text type={'text-red'}>
                      {discount.toFixed(2)} {currentCurrcensies}
                  </CartViews.Text>
                </>
                )
                :null 
            }
            </CartViews.BlockRightSide>
            <CartViews.BlockRightSide>
              <CartViews.Text type={'text-default'}>
                <Text text={'shipping'} />
              </CartViews.Text>
              <CartViews.Text type={'text-default_currency'}>
                              {!!delivery_cost ? (  
                                <>
                                &nbsp;                                
                                  {delivery_cost.toFixed(2)}&nbsp;
                                  {currentCurrcensies}{' '}
                                </>
                              ):( 
                                <>
                                  {null}
                                </>
                              )}
                            
              </CartViews.Text>
            </CartViews.BlockRightSide>
          </>)
          :(role === ROLE.DROPSHIPPER)
          ?( <>  
            <CartViews.BlockRightSide>
              <CartViews.Text type={'text-default'}>
                <Text text={'shipping'} />
              </CartViews.Text>
              <CartViews.Text type={'text-default_currency'}>
                              {!!delivery_cost ? (
                                <>
                                &nbsp;                                
                                  {delivery_cost.toFixed(2)}&nbsp;
                                  {currentCurrcensies}{' '}
                                </>
                              ):( 
                                <>
                                  {'0.00'}&nbsp;{currentCurrcensies}
                                </>
                              )}
                            
              </CartViews.Text>
            </CartViews.BlockRightSide>
          </>)
          :null
        }   
          <CartViews.Line />
          <CartViews.BlockRightSide mb={20}>
            <CartViews.Text type={'text-title'}>
              ??????????:
            </CartViews.Text>
            <CartViews.Text type={'text-title'}>
              {' '}
                  {total_cost.toFixed(2)}&nbsp;{currentCurrcensies}                         
            </CartViews.Text>
          </CartViews.BlockRightSide>
        </CartViews.WrapperRightSide>
      </div>
      {comment ? (
        <div className={style['cabinet_orders_details__comment']}>
          <div className={style['cabinet_orders_details__commentleft']}>??????????????????????:</div>
          <div className={style['cabinet_orders_details__commentright']}>
            <div dangerouslySetInnerHTML={{ __html: comment }}></div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(OrderBaseDetails);
