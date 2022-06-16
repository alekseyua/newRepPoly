import React, { memo, useEffect, useState } from 'react';
import { COOKIE_KEYS } from '../../const';
import { getCookie, setCookie } from '../../utils';
import style from './index.module.scss';
const Cookie = ({policy, openModalFeedbackReedFile}) => {

    const [statePolicy, setStatePolicy] = useState(false);
    let cookiePolicy = getCookie(COOKIE_KEYS.POLICY);
    if(cookiePolicy === 'false'){
        cookiePolicy = false;
    }else{
        cookiePolicy = true;
    }

    const heandlerPolicy = (link) => {
        openModalFeedbackReedFile(link);
    }

    const applyCookie = () => {
        setCookie(COOKIE_KEYS.POLICY,'false');
        setStatePolicy(false);        
    }

    useEffect(()=>{
        const timerPause = setTimeout(()=>setStatePolicy(cookiePolicy) , 2000)
        return ()=>clearTimeout(timerPause)
    },[])

    return (
        <>
                {statePolicy?
                    <div className={style['cookie__wrapper']}>
                        <p>Мы используем файлы cookie, чтобы обеспечить Вам максимальное удобство на нашем веб-сайте. Если Вы продолжите использовать этот сайт, мы будем считать, что Вы принимаете Политику  конфиденциальности</p>
                    <div className={style['cookie__inner-button']}>
                        <div
                            onClick={()=>heandlerPolicy(policy)}
                        >
                            Политика конфиденциальности
                        </div>

                            <div
                                onClick={()=>applyCookie()}
                            >
                                Принять <span>✔️</span>
                            </div>
                    </div>
                    </div>
                    :null
                }
        </>
    )
}

export default memo(Cookie);