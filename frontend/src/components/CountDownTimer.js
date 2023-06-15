import React from 'react';
import DateTimeDisplay from './DateTimeDisplay';
import { useCountdown } from '../hooks/useCountDown';

const ExpiredNotice = ({lastBuyer}) => {
    return (
        <div className="expired-notice">
            <span>Аукцион закончился</span>
            <span style={{color: 'black', fontSize: '14px'}}>Победитель: {lastBuyer}</span>
        </div>
    );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
    return (
        <div className="show-counter">
            <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="countdown-link"
            >
                <DateTimeDisplay value={days} type={'Дни'} isDanger={days <= 3} />
                <p>:</p>
                <DateTimeDisplay value={hours} type={'Часы'} isDanger={false} />
                <p>:</p>
                <DateTimeDisplay value={minutes} type={'Минуты'} isDanger={false} />
                <p>:</p>
                <DateTimeDisplay value={seconds} type={'Секунды'} isDanger={false} />
            </a>
        </div>
    );
};

const CountdownTimer = ({ targetDate, lastBuyer }) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);

    if (days + hours + minutes + seconds <= 0) {
        return <ExpiredNotice lastBuyer={lastBuyer} />;
    } else {
        return (
            <ShowCounter
                days={days}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
            />
        );
    }
};

export default CountdownTimer;
