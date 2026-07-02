// importing useState from react for hooks
import React, { useState } from 'react';
// importing styling
import './MonitorList.scss';

// MonitorList Component will hold data regarding all lists users are monitoring at present
const MonitorList = () => {
  const fakeData = {
    Favorites: [{ id: 1, url: 'http://example.com' }, { id: 2, url: 'http://thisisanexample.com' }],
    Work: [{ id: 1, url: 'http://wowexample.com' }],
    Home: [{ id: 2, url: 'http://omgexample.com' }],
  };

  // declaring state variable currentGroup, on initial page render- will start with value "Favorites"
  const [currentGroup, setCurrentGroup] = useState('Favorites');

  return (
    <div className="box monitor-wrapper">
      <h2 className="title is-4 has-text-white">Monitored List</h2>

      <input className="input mb-5" type="text" placeholder="Search for URLs..." />
      <div className="field">

        <label className="label has-text-white">Groups:</label>

        <div className="buttons">
          {Object.keys(fakeData).map((group) => (
            <button
              key={group}
              className={`button ${currentGroup === group ? 'is-info' : 'is-primary'}`}
              onClick={() => setCurrentGroup(group)}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      <h3 className="subtitle is-6 has-text-white">Currently Monitored List: "{currentGroup}"</h3>

      <ul className="monitor-items">
        {fakeData[currentGroup].map(monitor => (
          <li key={monitor.id} className="box p-4 is-flex is-align-items-center">
            <input type="checkbox" className="mr-3" />
            <span>URL: {monitor.url}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonitorList;
