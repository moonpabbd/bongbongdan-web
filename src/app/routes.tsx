import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Activities } from './pages/Activities';

import { MyRecord } from './pages/MyRecord';
import { FAQ } from './pages/FAQ';
import { Members } from './pages/Members';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AdminDB } from './pages/AdminDB';
import { EditProfile } from './pages/EditProfile';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'activities', Component: Activities },

      { path: 'my-record', Component: MyRecord },
      { path: 'faq', Component: FAQ },
      { path: 'members', Component: Members },
      { path: 'login', Component: Login },
      { path: 'signup', Component: Signup },
      { path: 'admin/db', Component: AdminDB },
      { path: 'profile-edit', Component: EditProfile },
    ],
  },
]);