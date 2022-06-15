import React from 'react';
import './orderCar.scss';
import { useStoreon } from 'storeon/react';
import { GxTooltip } from '@garpix/garpix-web-components-react';
const OrderCar = ({enabled, styleCar, setStyleCar, selectedAdress, variant, payment_methods}) => {
	
	const { orderFunc, dispatch } = useStoreon('orderFunc');
		const lifehack = () =>{
			window?.localStorage?.removeItem('numOrder')
			setStyleCar('orderCar animate');
			dispatch('orderFunc/state', true);
		}
    return(
		<GxTooltip 
			content={!payment_methods? `У Вас не выбран метод оплаты` : !variant? `У Вас не выбран способ доставки` : !selectedAdress? `У Вас не выбран адрес доставки` : null}
			placement={"top"}
			trigger={!(styleCar === 'orderCar')?'hover':null}
		>
			<div className="oderMain">
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
			</div>
		</GxTooltip>
    )
}

export default React.memo(OrderCar);