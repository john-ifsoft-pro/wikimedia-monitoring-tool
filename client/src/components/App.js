import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import FilterPanel from './FilterPanel';
import useWikiStream from '../hooks/useWikiStream';
import { format } from 'date-fns';
import RemoveIcon from '../svgs/removeIcon';

function App() {
  const [filterString, setFilterString] = useState();
  const events = useWikiStream(filterString);
  const [selectedEvent, setSelectedEvent] = useState({});

  const [viewedEvents, setViewedEvents] = useState({});

  const markEventAsViewed = useCallback(
    (id) => {
      setViewedEvents((viewedEvents) => {
        const newViewedEvents = { ...viewedEvents };
        newViewedEvents[id] = true;
        return newViewedEvents;
      });
    },
    [setViewedEvents]
  );

  return (
    <div className='App'>
      <FilterPanel onSearch={(filter) => setFilterString(filter)} />
      <div className=''>
        <table className='table w-full'>
          <thead>
            <tr>
              <th></th>
              <th>Time</th>
              <th>Title</th>
              <th>URL</th>
              <th>Type</th>
              <th>Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events
              .filter((event) => !(event.id in viewedEvents))
              .map((event) => (
                <tr key={event.id}>
                  <td>
                    <button
                      className='btn btn-circle'
                      onClick={() => markEventAsViewed(event.id)}
                    >
                      <RemoveIcon />
                    </button>
                  </td>
                  <td>
                    {format(
                      new Date(event.timestamp * 1000),
                      'yyyy-MM-dd HH:mm:ss'
                    )}
                  </td>
                  <td className='break-all'>{event.title}</td>
                  <td className='break-all'>{event.title_url}</td>
                  <td className=''>{event.type}</td>
                  <td className='break-all'>{event.comment}</td>
                  <td>
                    <label
                      htmlFor='my_modal_6'
                      className='btn btn-active btn-ghost'
                      onClick={() => setSelectedEvent(event)}
                    >
                      View
                    </label>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {createPortal(
        <>
          <input type='checkbox' id='my_modal_6' className='modal-toggle' />
          <div className='modal' role='dialog'>
            <div className='modal-box flex flex-col  max-w-5xl'>
              <h3 className='text-lg font-bold'>Event details</h3>
              <pre className='py-4 text-wrap break-words overflow-y-auto bg-black text-white'>
                {JSON.stringify(selectedEvent, null, 2)}
              </pre>
              <div className='modal-action'>
                <label htmlFor='my_modal_6' className='btn'>
                  Close!
                </label>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

export default App;
