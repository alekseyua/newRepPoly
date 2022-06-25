import React, { useState } from 'react';
import style from './topHeader.module.scss';
import classNames from 'classnames';
import TopHeaderMenu from '../TopHeaderMenu';
import RelativeBurgerBtn from '../BottomHeader/RelativeBurgerBtn';
import HeaderButtons from '../HeaderButtons';
import Logo from '../Logo';
import { useStoreon } from 'storeon/react';
import { getCookie, setCookie } from '../../utils';
import {
  CURRENCIES_DATA,
  COOKIE_KEYS,
  ONE_YEARS,
  DEFAULT_CURRENCIES,
} from '../../const';

const TopHeader = ({
  cabinet_data,
  setActiveSubmenuBg,
  site_configuration,
  currencies,
}) => {
  const { promotionsAdds } = useStoreon('promotionsAdds');
  const handlerActiveDropDownMenuItem = (status) => {
    setActiveSubmenuBg(!status); 
  };
  const getCurrencies = () => {
    if (currencies) {
      return currencies[0];
    } else {
      return DEFAULT_CURRENCIES;
    }
  };
  const defaultCurrenciesSingle = getCurrencies;
  const currencyDefault = getCookie(COOKIE_KEYS.CURRENCIES);
  const defaultCurrenciesData = {
    isOpen: false,
    active: currencyDefault ? currencyDefault : defaultCurrenciesSingle(),
    options: currencies
      ? currencies.map((el) => {
        return {
          name: el,
          value: el,
        };
      })
      : CURRENCIES_DATA,
  };
  const [currenciesData, setCurrencies] = useState(defaultCurrenciesData);
  const setCurrenciesData = (data) => {
    setCookie(COOKIE_KEYS.CURRENCIES, data.active, ONE_YEARS);
    setCurrencies(data);
  };

  return (
    <div
      className={classNames({
        [style['top-header']]: true,
        [style['top']]: !promotionsAdds.isOpen,
      })}
    >
      <div className={style['top-header-wrapper']}>
        <Logo 
          site_configuration={site_configuration}
          mobile isLight={false}
          siteLocation={'head'}
        />

        <TopHeaderMenu
          handlerActiveDropDownMenuItem={handlerActiveDropDownMenuItem}
        />

        <HeaderButtons
          lang
          cabinet_data={cabinet_data}
          setCurrenciesData={setCurrenciesData}
          currenciesData={currenciesData}
        />
        
        <RelativeBurgerBtn site_configuration={site_configuration}/>
      </div>
    </div>
  );
};

export default React.memo(TopHeader);
