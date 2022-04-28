import React from 'react';
import LayoutDropDownMenuAccount from '../../Views/LayoutDropDownMenuAccount';
import DefaultAuthText from '../../Views/DefaultAuthText';
import DropDownHeaderLK from '../../Views/DropDownHeaderLK';
import Text from '../Text';
import Button from '../../Views/Button';
import { ROLE } from '../../const';
import api from '../../api';

const AccessCheck = ({ first_name = 'first_name', last_name = 'last_name', logOut, page_type_auth, openModalKeyRegistration, role }) => {
  const apiUser = api.userApi;

  const getNewSubmitCode = () => {
    apiUser
      .resendUserKey()
      .then(res=>{
        console.log('response key', res)
      })
      .catch(err=>{          
        console.log(`ERROR `,err.response.data)
      }
      )
  };

  const getKeyForAccess = () => {
    getNewSubmitCode()
    openModalKeyRegistration()
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
        Администратор проверяет введенные Вами данные. Дождитесь обновления статуса проверки
      </DefaultAuthText.HelpText>
      { role === ROLE.RETAIL?
        <Button full variant={'gray_full_width'} onClick={getKeyForAccess}>
          <DefaultAuthText.Spinner slot={'icon-left'} />
          Получить код
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
