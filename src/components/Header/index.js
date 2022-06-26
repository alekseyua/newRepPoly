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

  const handleClickSearchRoot = () => {
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
          setActiveSubmenuBg={setActiveSubmenuBg}
          cabinet_data={cabinet_data}
          site_configuration={site_configuration}
          currencies={currencies}
        />
        <BottomHeader 
          cabinet_data={cabinet_data}
          isScrolled={isScrolled}
          main_menu={main_menu}
          site_configuration={site_configuration}
          onChangeSearchInput={handleChangeSearchValue}
          // onClickSearchBtn={handleClickSearchBtn}
          onClickSearchRoot={handleClickSearchRoot}
          searchResults={searchState.results}
          searchValue={searchState.search}
          openDropDown={searchState.openDropDown}
          offsetTop={offsetTop}
        />
      </div>
    </header>
  );
};
