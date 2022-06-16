import React from 'react';
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
  const {dispatch} = useStoreon();

  const getKeyForAccess = () => {
    const params = {
      email: email,
      type: 'resend',
    }
    dispatch('getNewSubmitCode', params)

  }

  const checkAccessToAccount = () => {
    if(checkEmail){
      let errMessage = {};
      api
        .getCurrentUser()
        .then(response=>{
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
      //window.location.reload()
    }else{
    console.log({email})
      getKeyForAccess()
      openModalKeyRegistration(email)
    }
  }
  
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
        <Button full variant={'gray_full_width'} onClick={getKeyForAccess}>
          <DefaultAuthText.Spinner slot={'icon-left'} />
          Подтвердить
        </Button>
        :<Button full variant={'gray_full_width'} to={page_type_auth} onClick={checkAccessToAccount}>
          <DefaultAuthText.Spinner slot={'icon-left'} />
          {!checkEmail? 'Подтвердить почту' : 'Проверка доступа'}
        </Button>      
      }
      <DropDownHeaderLK.Logout onClick={logOut} />
    </LayoutDropDownMenuAccount>
  );
};
export default React.memo(AccessCheck);
