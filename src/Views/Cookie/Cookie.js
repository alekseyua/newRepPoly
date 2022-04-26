import React, { memo, useEffect, useState } from 'react';
import { getCookie, setCookie } from '../../utils';
import style from './index.module.scss';
const Cookie = ({policy, openModalFeedbackReedFile}) => {

    const [statePolicy, setStatePolicy] = useState(false);
    const heandlerPolicy = (link) => {
        openModalFeedbackReedFile(link);
    }
    const applyCookie = () => {
        setCookie('policy',true);
        setStatePolicy(true);
        
    }

    useEffect(()=>{
        const cookiePolicy = getCookie('policy');
        setStatePolicy(cookiePolicy);
    },[])
    return (
        <>
                {!statePolicy?
                    <div className={style['cookie__wrapper']}>
                        <p>Мы используем файлы cookie, чтобы обеспечить Вам максимальное удобство на нашем веб-сайте. Если Вы продолжите использовать этот сайт, мы будем считать, что Вы принимаете Политику  конфиденциальности</p>
                    <div className={style['cookie__inner-button']}>
                        <div
                            onClick={()=>heandlerPolicy(policy)}
                        >
                            Политика конфиденциальности
                        </div>

                            <div
                                onClick={()=>applyCookie()}
                            >
                                Принимать <span>✔️</span>
                            </div>
                    </div>
                    </div>
                    :null
                }
        </>
    )
}

export default memo(Cookie);