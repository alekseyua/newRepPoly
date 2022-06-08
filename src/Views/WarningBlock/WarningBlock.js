import React, { useState } from 'react';
import style from './styles/index.module.scss';
import { statusCancel } from '../../images';
import { GxIcon } from '@garpix/garpix-web-components-react';
import classNames from 'classnames';

const WarningBlock = ({ textWarning = 'warning', variant = "wrapper" }) => {
  const [spolerActive, setSpolerActive] = useState(false)
  const heandleClickSpoler = () => {
    setSpolerActive(!spolerActive)
  }

  const classContext = classNames({
    [style['wrapper__text-content']]: spolerActive,
    [style['wrapper__text-content--disable']]: !spolerActive, 
  })
  const classCross = classNames({
    [style['catalog-wrapper']]: !spolerActive,
    [style['catalog-wrapper--active']]: spolerActive,
  })
  return (
    <div 
      className={classCross}
      onClick={heandleClickSpoler}
    >
      <div className={style["arrow-8"]}></div>
      <GxIcon className={style['wrapper__icon']} src={statusCancel} alt={'cansel'} />
      {/* <span className={style['wrapper__text']}>{textWarning}</span> */}
      <span 
        className={style['wrapper__text']}
      >

        <span 
            className={style['wrapper__text-btn']}        
        > 
          <div className={style['wrapper__text-ellipsis']}>
            {textWarning}
          </div>
          <div className={classContext}>
            {textWarning}
          </div>
        </span>
      </span>
    </div>
  );
};

export default React.memo(WarningBlock);
