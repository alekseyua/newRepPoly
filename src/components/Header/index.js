import React, { useState, useEffect } from 'react';
import { useStoreon } from 'storeon/react';
import api from '../../api';
import MainPromotion from '../../Views/MainPromotion';
import TopHeader from '../../Views/TopHeader';
import BottomHeader from '../../Views/BottomHeader';
import classNames from 'classnames';
import usePushNotifications from '../../#lifehack/Notification/usePushNotifications';




export default ({
  headerModClosed,
  header_menu = [],
  main_menu = [],
  announce,
  cabinet_data,
  profile,
  cabinet_menu,
  site_configuration,
  currencies,
}) => {
  const { userPage } = useStoreon('userPage');
  const {role} = userPage.profile;
  const { promotionsAdds, dispatch } = useStoreon('promotionsAdds');
  const [offsetTop, setOffsetTop] = useState(124);
  const [isScrolled, setScrolled] = useState(false);
  const [isActiveSubmenuBg, setActiveSubmenuBg] = useState(false);
  const [searchState, setSearchState] = useState({
    search: '',
    results: [],
    openDropDown: false,
  });
// ==========================================================================================================
const {
  onClickAskUserPermission,
  onClickSusbribeToPushNotification,
} = usePushNotifications();

  useEffect(()=>{
    const startRegistration = async () =>{
     await onClickAskUserPermission();
     await onClickSusbribeToPushNotification();
   }
    startRegistration()
  },[])


// ==========================================================================================================
  const handleChangeSearchValue = (e) => {
    console.log('click 32')

    const value = e.target.value;
    setSearchState((prevState) => ({
      ...prevState,
      search: value,
      openDropDown: value === '' ? false : true,
    }));
    api
      .getSearch({ q: value, role: role })
      .then((res) => {
        setSearchState((prevState) => ({
          ...prevState,
          results: res,
        }));
      })
      .catch((error) => {
        console.log("error", {error});
      });
  };
  const handleClickSearchBtn = () => {
    console.log('click test')
    //  window.location.href = page_type_search;
  };
  const handleClickSearchRoot = () => {
    console.log('click 3')
    setSearchState((prevState) => ({
      ...prevState,
      search: '',
      openDropDown: false,
      results: [],
    }));
  };

  const decSetOffsetTop = (offset) => {
    setOffsetTop(offset);
  };

  useEffect(() => {
    if (headerModClosed) {
      setScrolled(true);
      decSetOffsetTop(62);
    }
  }, [headerModClosed]);

  return (
    <header>
      <MainPromotion announce={announce} role={role} />
      <div
        className={classNames({
          header: true,
          close__promoution: !promotionsAdds.isOpen,
          top: !promotionsAdds.isOpen,
          deactive: headerModClosed,
        })}
      >
        
        <TopHeader
          isActiveSubmenuBg={isActiveSubmenuBg}
          setActiveSubmenuBg={setActiveSubmenuBg}
          header_menu={header_menu}
          cabinet_data={cabinet_data}
          profile={profile}
          cabinet_menu={cabinet_menu}
          site_configuration={site_configuration}
          currencies={currencies}
        />
        <BottomHeader
          site_configuration={site_configuration}
          profile={profile}
          cabinet_menu={cabinet_menu}
          cabinet_data={cabinet_data}
          isScrolled={isScrolled}
          header_menu={header_menu}
          main_menu={main_menu}
          onChangeSearchInput={handleChangeSearchValue}
          onClickSearchBtn={handleClickSearchBtn}
          onClickSearchRoot={handleClickSearchRoot}
          searchResults={searchState.results}
          searchValue={searchState.search}
          openDropDown={searchState.openDropDown}
        />
      </div>
    </header>
  );
};
