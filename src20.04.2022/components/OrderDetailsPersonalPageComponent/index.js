import React, { useEffect, useMemo, useState } from 'react';
import Title from '../../Views/Title';
import OrderDetailsPersonalPageViews from '../../Views/OrderDetailsPersonalPageViews';
import Chat from './Chat';
import dayjs from '../../utils/dayjs';
import api from '../../api';
import { ROLE } from '../../const';
import { useStoreon } from 'storeon/react';
import { useHistory } from 'react-router-dom';
const orderApi = api.orderApi;
const OrderDetailsPersonalPageComponent = ({
  order,
  slug,
  currentCurrcensies,
  setModalStates,
}) => {
  const { userPage } = useStoreon('userPage');
  const history = useHistory()
  const { role } = userPage.profile;
  const {
    created_at,
    delivery_address,
    delivery_method,
    id,
    payment_method,
    status,
    comment,
    track_number,
    weight,
    discount,
    specification,
    delivery_cost, 
    order_cost,
    total_cost,
  } = order;
  
  const [orderItems, setOrderItems] = useState([]);
  const [dataOrder, setDataOrder] = useState({
    delivery_cost: delivery_cost, 
    order_cost: order_cost,
    total: total_cost,
    id : id,
    status : status,
  });
  const [orderItemLength, setOrderItemLength] = useState(0);
  const [enableBtn, setEnableBtn] = useState(true);
  const [ state, setState ] = useState(false);
  const { currenssies, dispatch } = useStoreon('currenssies');
  const { stateUpdateBalance } = useStoreon('stateUpdateBalance');

  const getOrderItem = () => {
    orderApi
      .getOrderItems({ order_id: id })
      .then((res) => {
        if (res.length === 0) history.push('orders')
        setOrderItems(res);
        !!res[0]?.items?getAmountGoods(res):null
      })
      .catch(err => console.log(`Ошибка получения списка товаров находящихся в заказе №${id}`, err));
  };

  const getAmountGoods = (res) => {
    const amount = res.reduce((acc,cur)=>{
      acc += cur?.items.length
      return acc
    },0)
    setOrderItemLength(amount);
  }

  useEffect(() => {
    getOrderItem();
  }, [slug, currenssies, enableBtn]);

  useEffect(()=>{
    if (role === ROLE.WHOLESALE) {
      let res = [];
      orderItems.map(items => {
        items.items.map(item => {
          res.push(item)
        })
      })
    }
  }, [orderItems, currenssies])
  // *****************************************************************************************
  const deleteElementOrder = (id_goods, order) => {
    const params = {
      order_id: order,
      id: id_goods,
    }
    api
      .orderApi
      .cancelOrderItem(params)
      .then(res => {
        setEnableBtn(!enableBtn)
        setState(!state)
      })
      .catch(err => console.log('ERROR btnDelOrder dont work', err));
  }

    useEffect(()=>{
      dispatch('stateUpdateBalance/update', !stateUpdateBalance)
    }, [state])
  // *****************************************************************************************
  useEffect(() => {
    orderApi
      .getOrders() 
      .then(res => {
        res.results.map(orders=>{
          if (orders.id === id){
            setDataOrder({
              ...dataOrder,
              ...orders
            })
          }
        });
      })
      .catch(err => console.error(`ERROR from request getOrders`, err))
  }, [currenssies, state])

  return (
    <>
      <OrderDetailsPersonalPageViews.Wrapper>
        <Title variant="cabinet_orders_details__title" type={'h1'}>
          Заказ № {slug}
          <OrderDetailsPersonalPageViews.SubTitleContent>
            от {dayjs(api.language, created_at).format('DD.MM.YYYY')}
          </OrderDetailsPersonalPageViews.SubTitleContent>
        </Title>
        {track_number ? (
          <OrderDetailsPersonalPageViews.TrackDetails nubmerTrack={track_number} />
        ) : null}
        <OrderDetailsPersonalPageViews.OrderBaseDetails
          delivery_address={delivery_address}
          payment_method={payment_method}
          delivery_method={delivery_method}
          comment={comment}
          status={status}
          weight={weight}
          discount={discount}
          currentCurrcensies={currentCurrcensies}
          setModalStates={setModalStates}
          numberOrder={slug}          
          delivery_cost={dataOrder.delivery_cost}
          order_cost={dataOrder.order_cost}
          total_cost={dataOrder.total}
        />
        <OrderDetailsPersonalPageViews.ListTable
          count={role !== ROLE.WHOLESALE ? orderItems.length : orderItemLength}
          specification={specification}
        />
        <OrderDetailsPersonalPageViews.CardSectionWrapper>
          <OrderDetailsPersonalPageViews.LeftSideCol>
            {role !== ROLE.WHOLESALE ? (
              orderItems.map((el, i) => {
                return ( 
                  <OrderDetailsPersonalPageViews.Card
                    {...el}
                    key={el.id}
                    title={el.title}
                    size={el.size}
                    color={el.color}
                    status={el.status}
                    prices={el.prices}
                    order={el.order}
                    brand={el.brand}
                    change_agreement={el.change_agreement}
                    comment={el.comment}
                    commentImage={el?.comment_image !== "-" ? el?.comment_image : null}
                    image={el.image}
                    deleteElementOrder={deleteElementOrder}
                    setModalStates={setModalStates}
                  />
                );
              })
            ) : (
              <React.Fragment>
                {orderItems.map((el, i) => {
                  return (
                    <OrderDetailsPersonalPageViews.WrapperWhoosaleCard key={i} brand={el.title}>
                      {el.items.map((item) => {
                        return (
                          <OrderDetailsPersonalPageViews.Card
                            {...item}
                            key={item.id}
                            title={item.title}
                            size={item.size}
                            color={item.color}
                            status={item.status}
                            prices={item.prices}
                            order={item.order}
                            brand={item.brand}
                            change_agreement={item.change_agreement}
                            comment={item.comment}
                            commentImage={item?.comment_image !== '-'? item?.comment_image:null}
                            image={item.image}
                            deleteElementOrder={deleteElementOrder}
                            id={item.id}
                            setModalStates={setModalStates}
                          />
                        );
                      })}
                    </OrderDetailsPersonalPageViews.WrapperWhoosaleCard>
                  );
                })}
              </React.Fragment>
            )}
          </OrderDetailsPersonalPageViews.LeftSideCol>
          <OrderDetailsPersonalPageViews.RightSideCol>
          <Chat order_id={order.id} setModalStates={setModalStates} />
            
          </OrderDetailsPersonalPageViews.RightSideCol>
        </OrderDetailsPersonalPageViews.CardSectionWrapper>
      </OrderDetailsPersonalPageViews.Wrapper>
    </>
  );
};

export default React.memo(OrderDetailsPersonalPageComponent);
