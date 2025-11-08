import {BrowserRouter} from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import MainLayout from './layouts/MainLayout'
import {AuthProvider} from "./contexts/AuthContext.jsx";
import {CurrencyProvider} from "./contexts/CurrencyContext.jsx";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CurrencyProvider>
                    <MainLayout>
                        <AppRoutes/>
                    </MainLayout>
                </CurrencyProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App