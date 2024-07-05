import React, { useCallback, useEffect } from 'react';
import useStoredState from '../hooks/useStoredState';
import qs from 'querystring';

function FilterPanel(props) {
  const { onSearch } = props;

  const [domain, setDomain] = useStoredState('domain', 'en.wikipedia.org');
  const [namespace, setNamespace] = useStoredState('namespace', 82);
  const [title, setTitle] = useStoredState('title', '');
  const [bot, setBot] = useStoredState('bot', false);
  const [minor, setMinor] = useStoredState('minor', false);

  const startFetch = useCallback(() => {
    onSearch(
      qs.stringify({
        domain,
        title,
        namespace,
        bot,
        minor,
      })
    );
  }, [onSearch, domain, title, namespace, bot, minor]);

  const filterInputs = [
    {
      label: 'Domain',
      type: 'text',
      value: domain,
      onChange: setDomain,
    },
    {
      label: 'Title',
      type: 'text',
      value: title,
      onChange: setTitle,
    },
    {
      label: 'Namespace',
      type: 'number',
      value: namespace,
      onChange: setNamespace,
    },
  ];

  const filterCheckboxes = [
    {
      label: 'Bot',
      value: bot,
      onChange: setBot,
    },
    {
      label: 'Minor',
      value: minor,
      onChange: setMinor,
    },
  ];

  return (
    <div className='p-4'>
      <div className='flex gap-4 items-end'>
        {filterInputs.map((input) => (
          <label className='form-control max-w-xs'>
            <div className='label'>
              <span className='label-text'>{input.label}</span>
            </div>
            <input
              type={input.type}
              className='input input-bordered w-full max-w-xs'
              placeholder={`Enter ${input.label} here`}
              value={input.value}
              onChange={(e) => {
                input.onChange(e.target.value);
              }}
            />
          </label>
        ))}
        <button className='btn btn-primary' onClick={startFetch}>
          Update filter
        </button>
      </div>

      <div class='flex gap-4 items-end'>
        {filterCheckboxes.map((input) => (
          <div className='form-control'>
            <label className='label cursor-pointer gap-4'>
              <span className='label-text'>{input.label}</span>
              <input
                type='checkbox'
                defaultChecked
                className='checkbox checkbox-primary'
                checked={input.value}
                onChange={(e) => {
                  input.onChange(e.target.checked);
                }}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FilterPanel;
