import '../assets/styles/App.css';
import AppRoutes from '../routes/AppRoutes';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FavoriteProvider } from '../contexts/FavoriteContext.jsx';

function MainLayout() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname.startsWith("/auth") ||  location.pathname.startsWith("/admin");

  return (
    <>
      <FavoriteProvider>
      {!hideHeaderFooter && <Header/>}
      <AppRoutes />
      </FavoriteProvider>
      
      {!hideHeaderFooter && <Footer/>}
    </>
  );
}
export default MainLayout;