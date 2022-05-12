import React from 'react';
import LayoutDropDownMenuAccount from '../../Views/LayoutDropDownMenuAccount';
import DefaultAuthText from '../../Views/DefaultAuthText';
import DropDownHeaderLK from '../../Views/DropDownHeaderLK';
import Text from '../Text';
import Button from '../../Views/Button';
import { ROLE } from '../../const';
import api from '../../api';
import { useStoreon } from 'storeon/react';

const AccessCheck = ({ first_name = 'first_name', last_name = 'last_name', logOut, page_type_auth, email, role }) => {
  const {dispatch} = useStoreon();

  const getKeyForAccess = () => {
    const params = {
      email: email,
    }
    dispatch('getNewSubmitCode', params)
  }
  
  return (
    <LayoutDropDownMenuAccount>
      <DropDownHeaderLK.PersonalInfo
        first_name={first_name}
        last_name={last_name}
        role={Text({ text: 'retailBuyer' })}
      />
      <DropDownHeaderLK.Line /> 
      <DefaultAuthText.HelpText>
      {role === ROLE.RETAIL? 'Для подтверждения регистрации введите код с почты' : 'Администратор проверяет введенные Вами данные. Дождитесь обновления статуса проверки'}
      </DefaultAuthText.HelpText>
      { role === ROLE.RETAIL?
        <Button full variant={'gray_full_width'} onClick={getKeyForAccess}>
          <DefaultAuthText.Spinner slot={'icon-left'} />
          Подтвердить
        </Button>
        :<Button full variant={'gray_full_width'} to={page_type_auth} onClick={()=>window.location.reload()}>
          <DefaultAuthText.Spinner slot={'icon-left'} />
          Проверка доступа
        </Button>      
      }
      <DropDownHeaderLK.Logout onClick={logOut} />
    </LayoutDropDownMenuAccount>
  );
};
export default React.memo(AccessCheck);
