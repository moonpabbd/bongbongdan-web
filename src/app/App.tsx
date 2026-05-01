import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from 'sonner';
import { DialogProvider } from './contexts/DialogContext';

export default function App() {
  return (
    <DialogProvider>
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />
    </DialogProvider>
  );
}
