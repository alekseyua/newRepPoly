import React, { useEffect, useState } from 'react';
import { GxCol, GxRow } from '@garpix/garpix-web-components-react';
import CartViews from '../../Views/CartViews';
import Container from '../../Views/Container';
import Title from '../../Views/Title';
import AsyncComponent from '../AsyncComponent'
import api from '../../api'
import { useStoreon } from 'storeon/react';

const { contentApi } = api

const AsyncRecomendetProduct = AsyncComponent(() => {
  return import('../../components/RecomendetProduct');
});
const DefaultCartPreview = ({ page_type_catalog }) => {
  const [recomendetProduct, setrecomendetProduct] = useState([])
  const { currenssies, dispatch } = useStoreon('currenssies');
  const { updateWish } = useStoreon('updateWish');


  useEffect(() => {
    let cleanupRecomProducs = false;

    contentApi
      .getCatalogData()
      .then(res => {
        if(!cleanupRecomProducs){
          setrecomendetProduct(res.results)
        }
        })
        .catch(e => {
          console.error(e.message);
          if (!!e.message){
            let errMessage = {
              path: null,
              success: null,
              fail : 'ошибка доступа к серверу, проверьте соединение',
            };
            dispatch('warrning/set',errMessage);
          }
        }
        )

    return ()=>cleanupRecomProducs = true;
  }, [currenssies,updateWish]) 

  return (
    <Container>
      <GxRow>
        <GxCol className="cart__empty">
          <Title variant={'cart'} type={'h1'}>
            В вашей корзине пока ничего нет
          </Title>
          <CartViews.Text type={'text-under_title'}>
            Корзина ждёт, чтобы её наполнили. Желаем приятного шоппинга в мире моды!
          </CartViews.Text>
          <CartViews.LinkToCatalog to={page_type_catalog}>СМОТРЕТЬ ТОВАРЫ</CartViews.LinkToCatalog>
        </GxCol>
      </GxRow>
      <GxRow>
        <GxCol>
          <AsyncRecomendetProduct products={recomendetProduct} />
        </GxCol>
      </GxRow>
    </Container>
  );
};

export default React.memo(DefaultCartPreview);
