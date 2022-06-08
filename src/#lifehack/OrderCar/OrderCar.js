import React from 'react';
import './orderCar.scss';
import { useStoreon } from 'storeon/react';
import { GxTooltip } from '@garpix/garpix-web-components-react';
const OrderCar = ({enabled, styleCar, setStyleCar}) => {
	
	const { orderFunc, dispatch } = useStoreon('orderFunc');
		const lifehack = () =>{
			window?.localStorage?.removeItem('numOrder')
			setStyleCar('orderCar animate');
			dispatch('orderFunc/state', true);
		}
		console.log('styleCar:', styleCar === 'orderCar')
    return(
		<div className="oderMain">
			<GxTooltip 
				content="Заказ готов к оформлению"
				placement="top-start"
				open={styleCar === 'orderCar'? true : false}
			>
			<button 
				className={styleCar}
				onClick={lifehack}
			>		
				<strong className="default">{!enabled ? "ОФОРМИТЬ ЗАКАЗ НА ВЫКУП" :"ОФОРМИТЬ ЗАКАЗ НА ВЫКУП"}</strong>
				<strong className="success">Заказ принят в работу
					<svg viewBox="0 0 12 10">
						<polyline points="1.5 6 4.5 9 10.5 1"></polyline>
					</svg>
				</strong>
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
			</GxTooltip>
		</div>
    )
}

export default React.memo(OrderCar);