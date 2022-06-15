import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import style from './logo.module.scss';
import { useIntl } from 'react-intl';

const Logo = ({ isLight = false, mobile = false, site_configuration, siteLocation }) => {
  const [logoFirm, setLogoFirm] = useState();
  useEffect(()=>{
  if(siteLocation === 'head'){
    site_configuration?.logo_1 !== '#' ? setLogoFirm(site_configuration?.logo_1) : null;
  }else{
    site_configuration?.logo_2 !== '#' ? setLogoFirm(site_configuration?.logo_2) : null;
  }
  },[])
    const { locale } = useIntl();
    return (
      <NavLink
        to={`/${locale}`}
        className={classNames({
          [style['logo']]: true,
          [style['logo-footer']]:(siteLocation === 'footer'), 
          [style['logo-head']]:(siteLocation === 'head'), 
          [style['light']]: isLight,
          [style['mobile']]: mobile,
        })}
      >
        {/* <img src={logoFirm} label="Fashion Town" /> */}
        <div 
          className={style["logo-img"]}
          style={{
            backgroundImage: `url(${logoFirm})`
          }}
        ></div>
      { /*<GxIcon src={site_configuration?.logo_1} label="Fashion Town" /> */}
      </NavLink>

    );
  
};

export default React.memo(Logo);
