import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { GxButton, GxIcon } from '@garpix/garpix-web-components-react';
import LangAndCurrencies from './LangAndCurrencies';
import DropDownMenuAccount from './DropDownMenuAccount';
import { NavLink, useHistory } from 'react-router-dom';
import style from './headerButtons.module.scss';
import Logo from '../Logo';
import { searchIcon, favoriteIcon, cartIcon, catalogIcon } from '../../images/index';
import Text from '../../components/Text';
import SearchPageViews from '../SearchPageViews';
import { useStoreon } from 'storeon/react';
import styleWish from './style/styleWish.module.scss';

const HeaderButtons = ({
  lang,
  navigation,
  isScrolled = false,
  cabinet_data,
  openDropDown,
  onChangeSearchInput,
  onClickSearchBtn,
  onClickSearchRoot,
  searchResults,
  searchValue,
  setCurrenciesData,
  currenciesData,
}) => {
 
  const { stateCountRestart, dispatch } = useStoreon('stateCountRestart');
  const {statuStorage} = useStoreon('statuStorage');
  const { stateCountWish } = useStoreon('stateCountWish');
  const { stateCountCart } = useStoreon('stateCountCart');
  const { userPage } = useStoreon('userPage');
  const history = useHistory();
  const [searchInputShow, setSearchInputShow] = useState(false);
  const searchBgRef = React.createRef(null);
  const {cabinet_menu, profile, site_configuration} = userPage;
  const { role, user}        = profile;
  const {in_cart} = stateCountCart;
  const {
    page_type_account = '#',
    page_type_auth = '#',
    page_type_reg = '#',
    page_type_wishlist = '#',
    page_type_catalog = '#',
    page_home = '#',
   } = site_configuration;
 

  const handleClickSearchBtn = () => {
    setSearchInputShow((prevState) => !prevState);
  };
  const handleClickSearchRoot = (e) => {
    if (searchBgRef.current === e.target) {
      setSearchInputShow(false);
      onClickSearchRoot();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      setSearchInputShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress, false);
    return () => {
      document.removeEventListener('keydown', handleKeyPress, false);
    };
  }, []);

  const onChangeHandler = () =>{
    dispatch('stateCountRestart/add', !stateCountRestart)
    let params = {};
      if (statuStorage === 1){
        if (user.checkEmail){
          params = {
            path: null,
            success: 'Администратор проверяет введенные Вами данные. Что бы воспользоваться всеми возможностями сотрудничества, дождитесь обновления статуса или свяжитесь с нами через форму "Обратной связи"',
            fail: null,
          }
        }else{
          params = {
            path: null,
            success: null,
            fail: 'Что бы воспользоваться всеми возможностями сотрудничества, подтвердите почту и дождитесь проверки администратора',
          }
        }
        dispatch('warrning/set', params)
    } else if(statuStorage === 0){
      params = {
        path: 'authorization',
        success: null,
        fail: 'Что бы воспользоваться всеми возможностями сотрудничества, необходимо зарегистрироваться',
      }
      dispatch('warrning/set', params)
    }else if(statuStorage === 2){
      params = {
        path: 'registration',
        success: null,
        fail: 'Вам отказано в регистрации, пользование сайтом ограничено',
      }
      dispatch('warrning/set', params)
    }else{
      history.push('cart');
    }
  }

  return (
    <div
      className={classNames({
        [style['header-buttons']]: true,
        [style['scrolled']]: isScrolled,
      })}
    >
      {lang ? (
        <div className={style['header-buttons-dropdowns']}>
          <LangAndCurrencies
            currenciesData={currenciesData}
            isScrolled={isScrolled}
            setCurrenciesData={setCurrenciesData}

          />
        </div>
      ) : null}

      {navigation ? (
        <>
          {isScrolled ? <Logo 
            isLight={!isScrolled} 
            siteLocation={'head'}
          /> : null}
          {/* //!button */}

          <SearchPageViews.SearchWrapper
            openSearchInput={searchInputShow}
            onClickSearchRoot={handleClickSearchRoot}
            bgRef={searchBgRef}
          >
            <SearchPageViews.SearchInput
              searchInputShow={searchInputShow}
              onChangeSearchInput={onChangeSearchInput}
              search={searchValue}
              onClickSearchBtn={onClickSearchBtn}
            />
            <SearchPageViews.SearchResultsDropdown
              open={openDropDown && searchInputShow}
              results={searchResults} 
              search={searchValue}
              role={role}
              site_configuration={site_configuration}
            />
          </SearchPageViews.SearchWrapper>

          <div className={style['header-buttons-icons']}>
            <GxButton
              onClick={() => handleClickSearchBtn()}
              variant="text"
              className={classNames({
                [style['header-buttons__icon']]: true,
                [style['hide']]: searchInputShow,
                [style['dark']]: true,
              })}
              data-cy={'header_searche'}
            >
              <GxIcon src={searchIcon} label={Text({ text: 'search' })} />
            </GxButton>
            {/* //!catalog */}
            <NavLink
              dataintro={"step6"}
              to={page_type_catalog}
              className={classNames({
                [style['header-buttons__icon']]: true,
                [style['header-buttons__icon-catalog']]: true,
                [style['light']]: false,
              })}
              data-cy={'header_wishlist'}
            >
              <GxIcon src={catalogIcon} label={Text({ text: 'wishlist' })} />
            </NavLink>
            {/* //!account */}
            <DropDownMenuAccount
              page_type_account={page_type_account}
              page_type_auth={page_type_auth}
              page_type_reg={page_type_reg}
              page_home={page_home}
              profile={profile}
              cabinet_menu={cabinet_menu}
              cabinet_data={cabinet_data}
              isScrolled={isScrolled}
              data-cy={'header_DropDownMenuAccount'}
            />
            {/* //!wishlist */}
            <NavLink
              to={page_type_wishlist}
              className={classNames({
                [style['header-buttons__icon']]: true,
                [style['light']]: false,
                [styleWish['heart-wish']]: true,
              })}
              data-cy={'header_wishlist'}
            >
              <GxIcon
                src={favoriteIcon}
                label={Text({ text: 'wishlist' })}
              />
              {stateCountWish.count ? (
                <div
                  className={classNames({
                    [style['header-buttons__badge']]: true,
                    [style['empty']]: !`${stateCountWish.count}`,
                  })}
                >
                  {stateCountWish.count}
                </div>
              ) : null}
           
           
            </NavLink>

            {/* //!cart */}
            <div
              className={classNames({
                [style['header-buttons__icon']]: true,
                [style['light']]: false,
              })}
              data-cy={'header_cart'}
              onClick={onChangeHandler}
            >
              <GxIcon src={cartIcon} id='cart-id' label={Text({ text: 'cart' })} />
              {in_cart !==0 ? (
                <div
                  className={classNames({
                    [style['header-buttons__badge']]: true,
                    [style['empty']]: !`${in_cart}`,
                  })}
                >
                  {in_cart}
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default React.memo(HeaderButtons);
