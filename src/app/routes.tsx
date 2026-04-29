import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { lazy } from 'react';
import { NotFound } from './pages/NotFound';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Activities = lazy(() => import('./pages/Activities').then(m => ({ default: m.Activities })));
const HallOfFame = lazy(() => import('./pages/HallOfFame').then(m => ({ default: m.HallOfFame })));
const MyRecord = lazy(() => import('./pages/MyRecord').then(m => ({ default: m.MyRecord })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const Terms = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Signup = lazy(() => import('./pages/Signup').then(m => ({ default: m.Signup })));
const AdminDB = lazy(() => import('./pages/AdminDB').then(m => ({ default: m.AdminDB })));
const EditProfile = lazy(() => import('./pages/EditProfile').then(m => ({ default: m.EditProfile })));
const ApplyVolunteer = lazy(() => import('./pages/ApplyVolunteer').then(m => ({ default: m.ApplyVolunteer })));

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    errorElement: <NotFound />,
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
      { path: '*', element: <NotFound /> },
    ],
  },
]);