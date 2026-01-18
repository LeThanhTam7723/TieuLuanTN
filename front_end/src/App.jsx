import {BrowserRouter} from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import MainLayout from './layouts/MainLayout'
import {AuthProvider} from "./contexts/AuthContext.jsx";
import {CurrencyProvider} from "./contexts/CurrencyContext.jsx";
import { FavoriteProvider } from './contexts/FavoriteContext.jsx';
import ChatBot from './components/chatbot/ChatBot.jsx';

function App() {
    return (
        <BrowserRouter>
            <FavoriteProvider>
                <AuthProvider>
                    <CurrencyProvider>
                        <MainLayout>
                            <AppRoutes/>
                        </MainLayout>
                    </CurrencyProvider>
                </AuthProvider>
            </FavoriteProvider>
        </BrowserRouter>
    )
}

export default App