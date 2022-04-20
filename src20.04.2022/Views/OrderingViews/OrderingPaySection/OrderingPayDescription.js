import React from 'react';
import style from '../styles/index.module.scss';

const OrderingPayDescription = ({}) => {
  return (
    <p className={style['ordering__desc']}>
      Оплата производится в выбранной Вами валюте.
      <br />
      Стоимость товаров с момента оплаты (оплатой считается появление суммы на балансе) фиксируется и не изменяется
    </p>
  );
};
//фиксируется и не изменяется.
export default React.memo(OrderingPayDescription);
