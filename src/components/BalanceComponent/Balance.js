import React from 'react';
import { statusSend, statusWait } from '../../images';
import Button from '../../Views/Button';
import Text from '../Text';
import api from '../../api';
import PersonalPageViews from '../../Views/PersonalPageViews';
import PayModalContent from './PayModalContent';
import { useStoreon } from 'storeon/react';
import { ROLE } from '../../const';
import { useHistory } from 'react-router-dom';


const orderApi = api.orderApi;
const Balance = ({ setModalStates, role }) => {
  const { currenssies } = useStoreon('currenssies'); //currenssies
  const { dataBalance } = useStoreon('dataBalance'); // данные баланса настроены
  const history = useHistory();
  
  
  const closeModal = () => { 
    setModalStates({
      content: null,
      show: false,
      addClass: false,
    });
 };

  const openModalPay = (e) => {
    e.preventDefault()
    orderApi
      .getRandomRequizites()
      .then((res) => {
        setModalStates({
          content: <PayModalContent 
                      closeModal={closeModal} 
                      requisites={res} 
                      order_id={false}
                    />,
          show: true,
          addClass: 'modal-payments',
        });
      })
      .catch(err=>{
        console.log('ERROR', err);
        let errMessage = {
          path: null,
          success: null,
          fail : 'Возникла проблема с отправкой данных, попробуйте немного позже',
        };
        dispatch('warrning/set',errMessage);
      });
  };

  return (
    <PersonalPageViews.WrapperForm>
      <PersonalPageViews.HeadingBlock title={Text({ text: 'balance' })} />
      <PersonalPageViews.ContentBlock>
        <PersonalPageViews.SmallTextGray>
          В данном разделе Вы можете пополнять баланс.  <strong>После подтверждения </strong>зачисления денежных средств, администратор переводит их в статус <strong>«доступно»</strong>.
        </PersonalPageViews.SmallTextGray>
        <PersonalPageViews.BalanceItemsWrapper>
          <PersonalPageViews.BalanceItem
            greenText
            icon={statusSend}
            value={`${dataBalance.balance} ${String(currenssies).toUpperCase()}`}
            text={'Доступно'}
          />

            <PersonalPageViews.BalanceItem
              icon={statusWait}
              value={`${dataBalance.passive_balance} ${String(currenssies).toUpperCase()}`}
              text={'К зачислению'}
            />
           </PersonalPageViews.BalanceItemsWrapper>
   
        <Button onClick={openModalPay} variant={'cabinet_default'}>
          пополнить баланс 
        </Button>
      </PersonalPageViews.ContentBlock>
    </PersonalPageViews.WrapperForm>
  );
};

export default React.memo(Balance);
