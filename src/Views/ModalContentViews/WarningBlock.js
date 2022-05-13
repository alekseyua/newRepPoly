import React, {useState} from 'react';
import { GxIcon } from '@garpix/garpix-web-components-react';
import { toolTipIcon } from '../../images';
import classNames from 'classnames';
import style from './styles/index.module.scss';

const WarningBlock = ({ children, variant, wrapVariant }) => {
const [spolerActive, setSpolerActive] = useState(false)
  const heandleClickSpoler = () => {
    setSpolerActive(!spolerActive)
  }

  const classContext = classNames({
    [style['warning_wrapper__grid-text']]: spolerActive,
    [style['warning_wrapper__grid-text--disable']]: !spolerActive, 
    [style[variant]]: variant,
  })
  const classCross = classNames({
    [style['warning_wrapper']]: !spolerActive,
    [style['warning_wrapper--active']]: spolerActive,
    [style[`warning_wrapper-${wrapVariant}`]]: wrapVariant,
  })

  return (
    <div
      className={classCross}
      onClick={heandleClickSpoler}
    >

      <div className={style['warning_wrapper__grid']}>
      <div className={style["arrow-8"]}></div>
        <GxIcon src={toolTipIcon} alt={'toolTipIcon'} />
        <span 
            className={style['warning_wrapper__grid-btn']}        
        >

          {/* <span
            className={classNames({
              [style['warning_wrapper__grid-text']]: spolerActive,
              [style['warning_wrapper__grid-text--disable']]: !spolerActive, 
              [style[variant]]: variant,
            })}
          >
            {children}
          </span> */}

          <span className={classContext}>
              {children}
          </span>
        </span>


      </div>
    </div>
  );
};

export default React.memo(WarningBlock);
