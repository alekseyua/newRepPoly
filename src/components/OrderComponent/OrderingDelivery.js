import React, { useState } from 'react';
import OrderingViews from '../../Views/OrderingViews';

const OrderingDelivery = ({
  delivery_methods = [],
  values,
  touched,
  errors,
  setFieldValue,
  role_configuration = {},
  role,
}) => {
  const {
    variant,
    lastname,
    firstname,
    patronomic,
    serias_and_number_passport,
    issued_passport,
    issued_date,
    comment,
    agree_personal_data,
    waitForCall,
    needPassport,
  } = values;
  const [deliveryVariant, setDeliveryVariant] = useState(delivery_methods);
  const [formEnabled, setFormEnabled] = useState(needPassport);
  const { delivery_condition } = role_configuration;
  const [stateMarquee, setStateMarquee] = useState(true)
  const [idEnableBtn, setIdEnableBtn] = useState(null)

  const setActiveVariantPayments = (event) => {
    const id = Number(event.target.id);
    setIdEnableBtn(id)
    const newDeliveryVariant = deliveryVariant.map((el) => {
      if (el.id === id) {
        if (el.need_passport) {
          setFieldValue('needPassport', true);
          setFormEnabled(true);
        } else {
          setFieldValue('needPassport', false);
          setFormEnabled(false);
        }
        setFieldValue('variant', el.id);
        return {
          ...el,
          active: true,
        };
      } else {
        if (el.id === variant) {
          setFieldValue('variant', el.id);
          if (el.need_passport) {
            setFieldValue('needPassport', true);
          } else {
            setFieldValue('needPassport', false);
          }
        }
        return {
          ...el,
          active: false,
        };
      }
    });
    setDeliveryVariant(newDeliveryVariant);
    setStateMarquee(false)

  };
  return (
    <OrderingViews.OrderingDeliverySection>
      <OrderingViews.OrderingDeliveryHead />
      <OrderingViews.OrderingDeliveryDescription 
        role={role}
      />
      <OrderingViews.OrderingDeliveryVariantsBtn
        deliveryVariant={deliveryVariant}
        delivery_condition={delivery_condition}
        setActiveVariantPayments={setActiveVariantPayments}
        idEnableBtn={idEnableBtn}
      />
      {/* {formEnabled ? (
        <React.Fragment>
          <OrderingViews.OrderingDeliveryHeadForm
            waitForCall={waitForCall}
            setFieldValue={setFieldValue}
          />
          {!waitForCall ? (
            <OrderingViews.OrderingDeliveryForm
              lastname={lastname}
              firstname={firstname}
              patronomic={patronomic}
              serias_and_number_passport={serias_and_number_passport}
              issued_passport={issued_passport}
              issued_date={issued_date}
              comment={comment}
              agree_personal_data={agree_personal_data}
              setFieldValue={setFieldValue}
              errors={errors}
              touched={touched}
            />
          ) : null}
        </React.Fragment>
      ) : null} */}
      {stateMarquee? <marquee scrollamount="8"><span class="marquee-btn">Выберите способ доставки.</span></marquee> : <div style={{color: '	#7CFC00', fontSize: "14px"}}>Спасибо за Ваш выбор</div>}

    </OrderingViews.OrderingDeliverySection>
  );
};

export default React.memo(OrderingDelivery);
