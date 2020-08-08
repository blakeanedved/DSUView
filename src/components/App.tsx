import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import themes, { Theme } from '../themes';
import Navbar from './Navbar';
import Scheduler from './EventSchedule';
import useTheme from '../hooks/useTheme';

const App = () => {
  const { theme, toggleTheme, themeMounted } = useTheme(themes.dark);

  if (!themeMounted) {
    return <div />;
  }

  return (
    <Theme.Provider value={{ theme, toggleTheme }}>
      <BrowserRouter>
        <Route component={Navbar} />
        <Route path="/calendar" component={Scheduler} />
      </BrowserRouter>
    </Theme.Provider>
  );
};

export default App;
