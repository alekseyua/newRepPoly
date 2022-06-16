import React, { useState } from 'react';
import { GxForm } from '@garpix/garpix-web-components-react';
import ModalContentViews from '../../Views/ModalContentViews';
import Input from '../../Views/Input';
import { Formik, ErrorMessage } from 'formik';
import { payModalScheme } from '../../utils/schemesFormic';
import ErrorField from '../../Views/ErrorField';
import Error from '../../Views/Error';
import Button from '../../Views/Button';
import Text from '../../components/Text';
import api from '../../api';
import { useHistory, Prompt } from 'react-router-dom';
import { useStoreon } from 'storeon/react';
import InfoBalanse from './InfoBalance/InfoBalanse';
import ErrMessageForm from '../Popupe/ErrMessageForm';

const orderApi = api.orderApi;

const PayModalContent = ({
  requisites = '',
  order_id = false,
  total_price,
  now_balance,
  currenssies,
  closeModal,
  OrderComponent = false,
}) => {
  const initialValues = {
    fio: null,
    cost: null,
    comment: null,
    receipt: null,
  };


  const { userPage, dispatch } = useStoreon('userPage');
  const { stateUpdateBalance } = useStoreon('stateUpdateBalance');

  const [stateClickSend, setStateClickSend] = useState(false)
  const [errClickSend, setErrClickSend] = useState(false)

  const history = useHistory();
  const { slug } = userPage


  const errorsMessenge = {
    symbol: 'Поле не должно содержать спец. символы',
    requiredField: Text({ text: 'requiredField' }),
    shortComments: Text({ text: 'short.comments' }),
    longComments: Text({ text: 'long.comments' }),
    receipt:  "файл не добавлен"
  };


    const onSubmit = (data, { setFieldError }) => {
      const fdPayments = new FormData();
    
      let res = +order_id.toString().split('-')[1]
      order_id.toString().includes('-') ? order_id = res : order_id;

      fdPayments.set('requisites_id', requisites.id);
      !!order_id?fdPayments.set('order_id', order_id):null;
      fdPayments.set('cost', data.cost);
      fdPayments.set('name', data.fio);
      fdPayments.set('comment', data.comment);
      fdPayments.set('receipt', data.receipt);

      if (fdPayments.get('receipt') === 'null'){
        setErrClickSend(true)
        
      }else{
        setStateClickSend(true)
        dispatch('spinner')
        orderApi
          .createPayments(fdPayments)
          .then((res) => {
            closeModal();
            dispatch('stateUpdateBalance/update', !stateUpdateBalance)
            // !(slug === 'balance') ? history.push('orders') : history.push('balance');
            let errMessage = {
              path: !(slug === 'balance') ? 'orders' : 'balance',
              success: 'Благодарим за оплату! Ваш баланс будет пополнен примерно в течении 2х рабочих дней.',
              fail : null,
            };
            dispatch('warrning/set',errMessage);
          })
          .catch((err) => {
            console.log('err:', err)
            const data = err?.response?.data;
            setStateClickSend(false)
            if (!!data) {
              for (const key in data) {
                const element = Array.isArray(data[key]) ? data[key][0] : data[key];
                if (initialValues.hasOwnProperty(key)) {
                  setFieldError(key, element);
                }
              }
              let errMessage = {
                path: null,
                success: null,
                fail : 'Произошла ошибка, проверте коректность введённых данных, или повторите операцию позже',
              };
              dispatch('warrning/set',errMessage);
            }
          });
      }
    };

  const setHistory=(path)=>{
    history.push(path)
  }



  return (
    <ModalContentViews.ModalWrapper customClassName={'modal-payments'}>
      {OrderComponent? null : <ModalContentViews.CloseBtn closeModal={closeModal} />}
      <ModalContentViews.HeaderBlock mb={'20px'} title={'Пополнение баланса для оплаты'} />
      {<>
        {total_price? 
            <>
              <InfoBalanse
                total_price={total_price}
                now_balance={now_balance}
                currenssies={currenssies}
              />
            </>
            : null
        }
      </>
      }

      {errClickSend ? <ErrMessageForm setErrClickSend={setErrClickSend} setHistory={setHistory}/>:null}

      <ModalContentViews.WarningBlock>
        <ModalContentViews.SubTitle>Реквизиты для пополнения баланса:</ModalContentViews.SubTitle>
        <div dangerouslySetInnerHTML={{ __html: requisites.requisites }}></div>
      </ModalContentViews.WarningBlock>
      
      <ModalContentViews.ContentBlock>
        <ModalContentViews.ContentBlock>
          <Formik
            validationSchema={payModalScheme(errorsMessenge)}
            initialValues={initialValues}
            onSubmit={onSubmit}
          >
            {({ handleSubmit, handleChange, values, errors, setFieldValue, touched, handleBlur }) => {

              return (
                <GxForm noValidate onGx-submit={handleSubmit}>
                  <Input
                    value={values.cost}
                    type={'number'}
                    variant={'largeCustomLabel'}
                    className={'input-mt_20'}
                    name={'cost'}
                    autocomplete={'off'}
                    onGx-input={handleChange}
                    onBlur={handleBlur}
                    helpText={errors.cost && touched.cost ? <ErrorField message={errors.cost} /> : null}
                    label={'Сумма к зачислению*'}
                  />
                  <Input
                    value={values.fio}
                    variant={'largeCustomLabel'}
                    className={'input-mt_20'}
                    name={'fio'}
                    autocomplete={'off'}
                    onGx-input={handleChange}
                    onBlur={handleBlur}
                    helpText={errors.fio && touched.fio ? <ErrorField message={errors.fio} /> : null}
                    label={'ФИО отправителя*'}
                  />
                  <Input
                    value={values.comment}
                    variant={'largeCustomLabel'}
                    className={'input-mt_20'}
                    name={'comment'}
                    autocomplete={'off'}
                    onBlur={handleBlur}
                    onGx-input={handleChange}
                    helpText={
                      errors.comment && touched.comment ? <ErrorField message={errors.comment} /> : null
                    }
                    label={'Комментарий'}
                  />
                  <ModalContentViews.FileInputCustom
                    label={'Прикрепить чек:'}
                    setFieldValue={setFieldValue}
                  />
                  {errors.receipt && touched? <Error message={errors.receipt} /> : null}

                  <Button type={'submit'} stateClickSend={stateClickSend} full variant={'black_btn'}>
                    ОПЛАТИТЬ
                  </Button>
                </GxForm>
              );
            }}
          </Formik>
        </ModalContentViews.ContentBlock>
        <ModalContentViews.CenterPosition></ModalContentViews.CenterPosition>
      </ModalContentViews.ContentBlock>
    </ModalContentViews.ModalWrapper>
  );
};

export default React.memo(PayModalContent);


