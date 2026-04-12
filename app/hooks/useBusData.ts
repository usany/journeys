import { useCallback, useEffect, useState } from 'react';
import { busCollection } from '../components/busCollection';
import { useSeoulBus } from '../components/BusTimeline';
import { getProcessSteps } from '../components/steps';

const builduseSeoulBusQuery = (id: number[]) => `
  query {
    seoulBusArrival(routeIds: [${id.join(',')}]) {
      response {
        msgBody {
          itemList {
            arrmsg1
            rtNm
            firstTm
            lastTm
            term
            stNm
          }
        }
      }
    }
  }
`;
const buildGyeonggiBusQuery = (id: number[]) => `
  query {
    gyeonggiBusArrival(stationIds: [${id.join(',')}]) {
      response {
        msgBody {
          busArrivalList {
            routeName
            predictTime1
            locationNo1
            stationNm1
          }
        }
      }
    }
  }
`;

export const useBusData = (pathname: string) => {
  const [busData, setBusData] = useState<{ [key: number]: any } | any[]>([]);
  const [timeUntilNextFetch, setTimeUntilNextFetch] = useState(60);
  const vehicle = pathname.slice(4, pathname.length);
  const isuseSeoulBus = useSeoulBus()
  const fetchStep = async (id: number[]) => {
    let response;
    // const url = `http://localhost:5000/graphql`
    const url = `https://routes-xlbe.vercel.app/graphql`
    if (pathname.includes('se')) {
      // response = await fetch(`http://localhost:3000/seArrival/${id}`);
      // response = await fetch(`http://localhost:5000/graphql`, {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: builduseSeoulBusQuery(id),
        }),
      });

      const responseText = await response.json();
      const res = responseText.data.seoulBusArrival[0].response?.msgBody?.itemList;
      return res;
    }
    try {
      // response = await fetch(`http://localhost:3000/gyArrival/${id}`);
      // response = await fetch(`http://localhost:5000/graphql`, {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: buildGyeonggiBusQuery(id),
        }),
      });

      const data = await response.json();
      const res: Record<number, any> = {};
      (id as number[]).map((item: number, index: number) => res[item] = data.data.gyeonggiBusArrival[index]?.response?.msgBody?.busArrivalList)
      // console.log('res', res)
      return res;
    } catch (error) {
      console.error('Error fetching bus data:', error);
      return null;
    }
  };

  const fetchBusData = useCallback(async () => {
    const steps = getProcessSteps(vehicle);
    if (isuseSeoulBus) {
      const busNum = pathname.includes('busOne') ? '01' : pathname.includes('busTwo') ? '02' : 'A01';
      const busId = [busCollection.seoul[busNum]];
      const data = await fetchStep(busId);
      setBusData(data);
    } else {
      const stepsIds: number[] = steps.map(step => step.id)
      const dataObj = await fetchStep(stepsIds)
      setBusData(dataObj);
    }
    setTimeUntilNextFetch(60);
  }, [vehicle, getProcessSteps]);

  useEffect(() => {
    if (vehicle?.includes('bus')) {
      fetchBusData();
      const interval = setInterval(fetchBusData, 60000);
      const countdownInterval = setInterval(() => {
        setTimeUntilNextFetch(prev => {
          if (prev <= 1) return 60;
          return prev - 1;
        });
      }, 1000);
      return () => {
        clearInterval(interval);
        clearInterval(countdownInterval);
      };
    }
  }, [vehicle, fetchBusData]);

  return { busData, timeUntilNextFetch, fetchBusData };
};
