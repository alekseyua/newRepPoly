import React from 'react';
import style from '../styles/index.module.scss';

const OrderingPayDescription = ({dataBalance, total_cost}) => {
  console.log(total_cost)
  console.log(dataBalance)
  return (

    <div className={style['ordering__desc']}>
      {dataBalance < total_cost?
        <p>
            Кнопка «Пополнить баланс» - Вы сможете пополнить баланс после оформления заказа, сайт предложит Вам заполнить форму с реквизитами. Также, пополнить баланс можно «внутри» самого заказа, и в разделе «Баланс и платежи»
        </p>
        :null
      }
      Оплата производится в выбранной Вами валюте.
      <br />
      Стоимость товаров с момента оплаты (оплатой считается появление суммы на балансе) фиксируется и не изменяется
    </div>
  );
};
//фиксируется и не изменяется.
export default React.memo(OrderingPayDescription);
