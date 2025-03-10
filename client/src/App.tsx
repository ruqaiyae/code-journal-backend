import { Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { EntryForm } from './pages/EntryForm';
import { EntryList } from './pages/EntryList';
import { NotFound } from './pages/NotFound';
import './App.css';
import { UserProvider } from './pages/userContext';
import { SignInForm } from './pages/signInForm';
import { RegistrationForm } from './pages/RegistrationForm';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<EntryList />} />
          <Route path="auth/sign-in" element={<SignInForm />} />
          <Route path="auth/sign-up" element={<RegistrationForm />} />
          <Route path="details/:entryId" element={<EntryForm />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
