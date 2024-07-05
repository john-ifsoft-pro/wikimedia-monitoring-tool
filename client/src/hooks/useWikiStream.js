import { useEffect, useState } from "react";

export default function useWikiStream(filterString) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!filterString) return;
    
    setEvents([]);

    const eventSource = new EventSource(`http://localhost:4000/events?${filterString}`);

    eventSource.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);
      setEvents((prevEvents) => [newEvent, ...prevEvents]);
    };
  
    return () => {
      eventSource.close();
    };
  }, [filterString])

  return events;
}