import React, { useEffect, useState } from 'react';
import LayoutDropDownMenuAccount from '../../Views/LayoutDropDownMenuAccount';
import DefaultAuthText from '../../Views/DefaultAuthText';
import DropDownHeaderLK from '../../Views/DropDownHeaderLK';
import Text from '../Text';
import Button from '../../Views/Button';
import { ROLE } from '../../const';
import api from '../../api';
import { useStoreon } from 'storeon/react';

const AccessCheck = ({ 
  openModalKeyRegistration,
  first_name = 'first_name', 
  last_name = 'last_name', 
  logOut, page_type_auth, 
  email, 
  role,
  checkEmail,
  }) => {
  const {notificationCount, dispatch} = useStoreon('notificationCount');
  const [timerAccess, setTimerAccess] = useState(true);
  const [activeSpinner, setActiveSpinner] = useState('')
  const getKeyForAccess = () => {
    const params = {
      email: email,
      type: 'resend',
    }
    dispatch('getNewSubmitCode', params)

  }

  const checkAccessToAccount = () => {
    setActiveSpinner('spinner-line');
    if(checkEmail){
      handlerCheckAccess();
    }else{
      getKeyForAccess();
      openModalKeyRegistration(email);
    }
  }
  
  const handlerCheckAccess = async () => {
    let errMessage = {};
        await api
        .getCurrentUser()
        .then(response=>{
          setActiveSpinner('');
          dispatch('statuStorage/set',response?.status);
          !(response?.status === 0 || response?.status === 1 || response?.status === 2)?
            ( errMessage = {
                path: 'catalog',
                success: 'Аккаунт активирован Желаем приятного шоппинга в мире моды!',
                fail :null,
              },
              dispatch('warrning/set',errMessage)
            )
            : (
              errMessage = {
                path: null,
                success: 'Администратор проверяет введенные Вами данные. Что бы воспользоваться всеми возможностями сотрудничества, дождитесь обновления статуса или свяжитесь с нами через форму "Обратной связи"',
                fail: null,
              },
              dispatch('warrning/set',errMessage)
            )
        })
        .catch(err=>console.log('err to ', err))
  }

  useEffect(()=>{
    let timer = 0;
    console.log('timerAccess:', timerAccess)
    timerAccess?(
      timer = setInterval(async () => {
       const params = {0: `/${window.location.pathname}`} 
       try{
       const getDataPage = await api.updatePage(params)
       console.log('getDataPage:', getDataPage)
       dispatch('userPage/add', getDataPage.page)
       }catch(err){
         console.log(err) 
       }
          const response = await api.getCurrentUser();
          dispatch('statuStorage/set',response?.status);
          console.log('response:', response)
          !(response?.status === 0 || response?.status === 1 || response?.status === 2)?
            (
              setTimerAccess(false),
              clearInterval(timer)
            )
            :null
      }, 30000),    
      console.log('timerAccess:', timerAccess),
      !timerAccess? clearInterval(timer): null
      )
      :null
    // console.log('response?.status:', response?.status)
  },[notificationCount])

  return (
    <LayoutDropDownMenuAccount>
      <DropDownHeaderLK.PersonalInfo
        first_name={first_name}
        last_name={last_name}
        titleRole={
          role === ROLE.RETAIL?
            Text({ text: 'retailBuyer' })
            : role === ROLE.DROPSHIPPER?
              Text({ text: 'dropshipper' })
              : role === ROLE.WHOLESALE?
                Text({ text: 'wholesaleBuyer' })
                : null
        }
      />
      <DropDownHeaderLK.Line /> 
      <DefaultAuthText.HelpText>
      {role === ROLE.RETAIL? 
        'Для подтверждения регистрации введите код с почты' 
        : !checkEmail? 
          'Что бы воспользоваться всеми возможностями сотрудничества, подтвердите почту и дождитесь проверки администратора' 
          :'Администратор проверяет введенные Вами данные. Дождитесь обновления статуса проверки'
      }
      </DefaultAuthText.HelpText>
      { role === ROLE.RETAIL?
        <Button full variant={'gray_full_width'} onClick={getKeyForAccess} className={activeSpinner}>
          <DefaultAuthText.Spinner slot={'icon-left'} />
          Подтвердить
        </Button>
        :<Button full variant={'gray_full_width'} to={'#'} onClick={checkAccessToAccount} className={activeSpinner}>
          <DefaultAuthText.Spinner slot={'icon-left'} />
          {!checkEmail? 'Подтвердить почту' : 'Проверка доступа'}
        </Button>
      }
      <DropDownHeaderLK.Logout onClick={logOut} />
    </LayoutDropDownMenuAccount>
  );
};
export default React.memo(AccessCheck);
