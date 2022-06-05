import React, { useState } from 'react';
import OrderingViews from '../../Views/OrderingViews';

const OrderingPay = ({ payment_methods, setFieldValue, role, dataBalance, total_cost }) => {

  const [paymentsVariant, setpaymentsVariant] = useState(payment_methods);
  const [stateMarquee, setStateMarquee] = useState(true)
  const setActiveVariantPayments = (event) => {
    setStateMarquee(!stateMarquee)
    const id = Number(event.target.id);
 
    const newPaymentsVariant = paymentsVariant.map((el) => {
      if (el.id === id) {
        setFieldValue('payment_methods', el.id);
        return {
          ...el,
          active: true,
        };
      } else {
        if (el.id === payment_methods) setFieldValue('payment_methods', null);
        return {
          ...el,
          active: false,
        };
      }
    });
    setpaymentsVariant(newPaymentsVariant);
  };
  return (
    <OrderingViews.OrderingPaySection>
      <OrderingViews.OrderingPayHead />
      <OrderingViews.OrderingPayDescription 
        dataBalance={dataBalance}
        total_cost={total_cost}
      />
      <OrderingViews.OrderingPayButtons
        payment_methods={paymentsVariant}
        setActiveVariantPayments={setActiveVariantPayments}
        role={role}
        dataBalance={dataBalance}
        total_cost={total_cost}
      />
         {stateMarquee? <marquee scrollamount="10"><span className="marquee-btn">Выберите способ оплаты.</span></marquee> : <div style={{color: '	#7CFC00', fontSize: "14px"}}>Спасибо за Ваш выбор</div>}
    </OrderingViews.OrderingPaySection>
  );
};

export default React.memo(OrderingPay);
