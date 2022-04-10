import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import style from './bottomFooter.module.scss';
import SocialLinks from '../SocialLinks';
import PaymentMethods from '../PaymentMethods';
import { visaIcon, masterCardIcon, applePayIcon, mirIcon } from '../../images';

const BottomFooter = ({ site_configuration, year, policy }) => {
  // const {social_links, payment_methods} = props;

  const payment_methods = [
    {
      icon: visaIcon,
    },
    {
      icon: masterCardIcon,
    },
    {
      icon: applePayIcon,
    },
    {
      icon: mirIcon,
    },
  ];

  return (
    <div className={style['bottom-footer']}>
      <div className={'container'}>
        <div className={style['bottom-footer-wrap']}>
          <div className={style['bottom-footer__info']}>
            <span className={style['bottom-footer__copyright']}>&copy; {year} FASHIONTOWN </span>
            <Link 
            target="_blank" 
            to={policy ? policy : "#"} 
            className={style['bottom-footer__offer']}
            >
              Публичная оферта
            </Link>
          </div>
          <SocialLinks site_configuration={site_configuration} />
          <PaymentMethods payment_methods={payment_methods} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(BottomFooter);
