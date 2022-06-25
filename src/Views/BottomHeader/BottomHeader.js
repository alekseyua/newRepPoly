import React from 'react';
import { useStoreon } from 'storeon/react';
import style from './bottomHeader.module.scss';
import Logo from '../Logo';
import classNames from 'classnames';
import HeaderButtons from '../HeaderButtons';
import BottomHeaderMenu from '../BottomHeaderMenu';

const BottomHeader = ({
  main_menu,
  isScrolled,
  site_configuration,
  cabinet_data,
  openDropDown,
  onChangeSearchInput,
  onClickSearchBtn,
  onClickSearchRoot,
  searchResults,
  searchValue,
}) => {
  const { promotionsAdds } = useStoreon('promotionsAdds');

  return (
    <div
      className={classNames({
        [style['bottom-header']]: true,
        [style['scrolled']]: isScrolled,
        [style['top']]: !promotionsAdds.isOpen,
      })}
    >
      <div className={style['bottom-header-wrapper']}>
        <div className={style['bottom-header__group']}>
          <div className={style['bottom-header-logo']}>
            <Logo 
              site_configuration={site_configuration} 
              isLight={true}
              siteLocation={'head'}
            />
          </div>
          
          <div className={style['bottom-header__group-menu']}>
            <BottomHeaderMenu isScrolled={isScrolled} main_menu={main_menu} />
          </div>
        </div>
        <HeaderButtons
          navigation
          site_configuration={site_configuration}
          cabinet_data={cabinet_data}
          isScrolled={isScrolled}
          onChangeSearchInput={onChangeSearchInput}
          onClickSearchBtn={onClickSearchBtn}
          onClickSearchRoot={onClickSearchRoot}
          searchResults={searchResults}
          searchValue={searchValue}
          openDropDown={openDropDown}
        />
      </div>
    </div>
  );
};

export default React.memo(BottomHeader);
