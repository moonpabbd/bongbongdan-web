import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Activities } from './pages/Activities';

import { HallOfFame } from './pages/HallOfFame';
import { MyRecord } from './pages/MyRecord';
import { FAQ } from './pages/FAQ';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';

import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AdminDB } from './pages/AdminDB';
import { EditProfile } from './pages/EditProfile';
import { ApplyVolunteer } from './pages/ApplyVolunteer';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'activities', Component: Activities },

      { path: 'news', Component: HallOfFame },
      { path: 'faq', Component: FAQ },
      { path: 'terms', Component: Terms },
      { path: 'privacy', Component: Privacy },

      { path: 'login', Component: Login },
      { path: 'signup', Component: Signup },
      { path: 'admin/db', Component: AdminDB },
      { path: 'my-record', Component: MyRecord },
      { path: 'profile-edit', Component: EditProfile },
      { path: 'apply', Component: ApplyVolunteer },
    ],
  },
]);