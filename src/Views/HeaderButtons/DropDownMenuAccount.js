import React from 'react';
import classNames from 'classnames';
import { GxButton, GxIcon, GxDropdown } from '@garpix/garpix-web-components-react';
import { userIcon } from '../../images/index';
import Text from '../../components/Text';
import ContentDropDownAccount from '../../components/ContentDropDownAccount';
import style from './headerButtons.module.scss';
import styleDropDown from './dropDownAccountMenu.module.scss';
import { useStoreon } from 'storeon/react';

const DropDownMenuAccount = ({
  profile,
  cabinet_menu,
  page_type_account,
  page_type_auth,
  page_type_reg,
  page_home,
}) => {
  const { notificationCount } = useStoreon('notificationCount');

  return (              
    <GxDropdown className={styleDropDown['wrapper']} hoist distance={20} skidding={-138} dataintro={"step7"}>
      <GxButton
        dataintro="step2"
        slot="trigger"
        variant="text"
        className={classNames({
          [style['header-buttons__icon']]: true,
          [style['dark']]: true,
        })}
        data-cy={'header_profile_drop_down'}
      >
        <GxIcon src={userIcon} label={Text({ text: 'account' })} />
        {!!notificationCount ? (
          <div
            className={classNames({
              [style['header-buttons__badge']]: true,
              [style['empty']]: !(!!notificationCount),
            })}
          >
            {notificationCount}
          </div>
        ) : null}
      </GxButton>
      {/* //!content */}
      <ContentDropDownAccount
        profile={profile}
        cabinet_menu={cabinet_menu}
        page_type_account={page_type_account}
        page_type_auth={page_type_auth}
        page_type_reg={page_type_reg}
        page_home={page_home}
      />
    </GxDropdown>
  );
};
export default React.memo(DropDownMenuAccount);
