import React from 'react';
import { ROLE, COOKIE_KEYS } from '../../const';
import { removeCookie, getCookie } from '../../utils';
import AccessCheck from './AccessCheck';
import RejectedAccount from './RejectedAccount';
import Unregistred from './Unregistred';
import Retailer from './Retailer';
import Dropshipper from './Dropshipper';
import Wholesale from './Wholesale';
import { useHistory} from 'react-router-dom'
import { useStoreon } from 'storeon/react';
import ModalContentViews from '../../Views/ModalContentViews';
import ModalSubmitCode from '../Auth/ModalSubmitCode';
import api from '../../api';
/**
 * на основе роли выберет нужный контент
 * @param {*} param0
 */
const ContentDropDownAccount = ({
  profile,
  cabinet_menu,
  page_type_account,
  page_type_auth,
  page_type_reg,
  page_home,
}) => {
  const apiUser = api.userApi;
  const { role, user = {}, shop = { is_has_shop: false }, status } = profile;
  const { first_name = 'Имя', last_name = 'Фамилия', email = '' } = user;
  console.log('user:', user)
  const history = useHistory();
  const {dispatch} = useStoreon();
  const logOut = () => {
    removeCookie(COOKIE_KEYS.AUTH);
  };

  const openModalKeyRegistration = () => {
    const initialValues = {}


    const closeModal = () => {
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
                <ModalSubmitCode initialValues={initialValues} path={'/catalog'} regist={true}/>
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
        cabinet_menu={cabinet_menu}
        logOut={logOut}
        page_type_auth={page_type_auth}
      />
    ),
    dropshipper: (
      <Dropshipper
        first_name={first_name}
        last_name={last_name}
        cabinet_menu={cabinet_menu}
        shop={shop}
        logOut={logOut}
      />
    ),
    wholesale: (
      <Wholesale
        first_name={first_name}
        last_name={last_name}
        cabinet_menu={cabinet_menu}
        shop={shop}
        logOut={logOut}
      />
    ),
  };
  switch (status) {
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
