import { useState, useEffect } from 'react';

const useDate = (time: boolean = false) => {
  const [date, setDate] = useState(new Date());
  const [dateInterval, setDateInterval] = useState<number>(-1);

  useEffect(() => {
    if (time) {
      clearInterval(dateInterval);
      setDateInterval(
        setInterval(() => {
          setDate(new Date());
        }, 1000)
      );
    } else {
      clearInterval(dateInterval);
      setTimeout(() => {
        setDateInterval(
          setInterval(() => {
            setDate(new Date());
          }, 1000 * 60 * 60 * 24)
        );
      }, new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0).getTime() - date.getTime());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return date;
};

export default useDate;
