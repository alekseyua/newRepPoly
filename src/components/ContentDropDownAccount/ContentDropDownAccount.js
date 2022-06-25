import React from 'react';
import { ROLE, COOKIE_KEYS } from '../../const';
import { removeCookie } from '../../utils';
import AccessCheck from './AccessCheck';
import RejectedAccount from './RejectedAccount';
import Unregistred from './Unregistred';
import Retailer from './Retailer';
import Dropshipper from './Dropshipper';
import Wholesale from './Wholesale';
import { useStoreon } from 'storeon/react';
import ModalContentViews from '../../Views/ModalContentViews';
import ModalSubmitCode from '../Auth/ModalSubmitCode';

const ContentDropDownAccount = ({
  profile,
  cabinet_menu,
  page_type_auth,
  page_type_reg,
}) => {
  const { role, user = {}, shop = { is_has_shop: false }} = profile;
  const { first_name = 'Имя', last_name = 'Фамилия', email = '', checkEmail = false } = user;
  const {dispatch, statuStorage} = useStoreon('statuStorage');
  const {userPage} = useStoreon('userPage');

  const logOut = () => {
    removeCookie(COOKIE_KEYS.AUTH);
    removeCookie(COOKIE_KEYS.POLICY);
    window.location.href='/';
  };

  const openModalKeyRegistration = (email) => {
    const initialValues = {}
    const closeModal = (email) => {
      dispatch('modal/update', {
        show: false,
        content: null,
        addClass: false, 
      });
    };

    return  dispatch('modal/update', {
      content: (
      <ModalContentViews.ModalWrapper>
        <ModalContentViews.CloseBtn closeModal={closeModal} />
        <ModalContentViews.CenterPosition>
          <ModalContentViews.ContentBlock>
                <ModalSubmitCode initialValues={initialValues} path={'/catalog'} regist={true} emailUser={email}/>
          </ModalContentViews.ContentBlock>
        </ModalContentViews.CenterPosition>
      </ModalContentViews.ModalWrapper>
      ),
      show: true,
      addClass: 'modal-success_error',
    });
  };

  
  const variantDropDown = {
    accessCheck: (
      <AccessCheck
        first_name={first_name}
        last_name={last_name}
        logOut={logOut}
        page_type_auth={page_type_auth}
        role={role}
        email={email}
        openModalKeyRegistration={openModalKeyRegistration}
        checkEmail={checkEmail}
      />
    ),
    rejectedAccount: (
      <RejectedAccount
        first_name={first_name}
        last_name={last_name}
        logOut={logOut}
        page_type_auth={page_type_auth}
      />
    ),
    unregistred: <Unregistred page_type_auth={page_type_auth} page_type_reg={page_type_reg} />,
    retail: (
      <Retailer
        first_name={first_name}
        last_name={last_name}
        cabinet_menu={userPage.cabinet_menu}        
        logOut={logOut}
        page_type_auth={page_type_auth}
      />
    ),
    dropshipper: (
      <Dropshipper
        first_name={first_name}
        last_name={last_name}
        cabinet_menu={userPage.cabinet_menu}
        shop={shop}
        logOut={logOut}
      />
    ),
    wholesale: (
      <Wholesale
        first_name={first_name}
        last_name={last_name}
        cabinet_menu={userPage.cabinet_menu}
        shop={shop}
        logOut={logOut}
      />
    ),
  };
  switch (statuStorage) {
    case 0:
      return variantDropDown.unregistred;
    case 1:
      return variantDropDown.accessCheck;
    case 2:
      return variantDropDown.rejectedAccount;
  }
  switch (role) {
    case ROLE.UNREGISTRED:
      return variantDropDown.unregistred;
    case ROLE.RETAIL:
      return variantDropDown.retail;
    case ROLE.DROPSHIPPER:
      return variantDropDown.dropshipper;
    case ROLE.WHOLESALE:
      return variantDropDown.wholesale;
    default:
      return null;
  }
};
export default React.memo(ContentDropDownAccount);
