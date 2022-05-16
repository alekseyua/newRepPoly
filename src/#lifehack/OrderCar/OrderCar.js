import React, {useState} from 'react';
import './orderCar.scss';
import { useStoreon } from 'storeon/react';

const OrderCar = ({enabled, styleCar, setStyleCar}) => {
	
	const { orderFunc, dispatch } = useStoreon('orderFunc');
		const lifehack = () =>{
			console.log('orderFunction', orderFunc)
			window?.localStorage?.removeItem('numOrder')
			setStyleCar('orderCar animate');
			dispatch('orderFunc/state', true);
			dispatch('spinner')
		}

    return(
		<div className="oderMain">
			<button 
				className={styleCar}
				onClick={lifehack}
			>
				<span className="default">{!enabled ? "ОФОРМИТЬ ЗАКАЗ НА ВЫКУП" :"ОФОРМИТЬ ЗАКАЗ НА ВЫКУП"}</span>
				<span className="success">Заказ принят в работу
					<svg viewBox="0 0 12 10">
						<polyline points="1.5 6 4.5 9 10.5 1"></polyline>
					</svg>
				</span>
				<div className="box"></div>
				<div className="truck">
					<div className="car__name">FT</div>
					<div className="back"></div>
					<div className="front">
						<div className="window"></div>
					</div>
					<div className="light top"></div>
					<div className="light bottom"></div>
				</div>
				<div className="lines"></div>
			</button>
		</div>
    )
}

export default React.memo(OrderCar);