import React from 'react';
import style from './styles/rightSide.module.scss';
import { NavLink } from 'react-router-dom';
import { ROLE } from '../../const';

const RightSide = ({ children, role, openModalFeedbackReedFile, site_configuration }) => {
  console.log('site_configuration',site_configuration);
  const privacyPolicy = () => {
    openModalFeedbackReedFile(site_configuration.privacy_policy);
  }
  const heandlerPolicy = () => {
    openModalFeedbackReedFile(site_configuration.policy_1);
  }
  return (
    <div className={style['right__side']}>
      <div className={style['wrapper']}>{children}</div>
      {ROLE.UNREGISTRED === role ? (
        <div className={style['links']}>
          <div onClick={privacyPolicy}>Политика конфиденциальности</div>
          <div onClick={heandlerPolicy}>Пользовательское соглашение</div>
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(RightSide);
