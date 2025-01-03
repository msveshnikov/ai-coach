import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Training from './Training';
import { Landing } from './Landing';
import Analytics from './Analytics';
import ClubManagement from './ClubManagement';
import Profile from './Profile';
import './i18n.jsx';
import { I18nextProvider } from 'react-i18next';
import ReactGA from 'react-ga4';

export const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://aicoachpro.ai';

function App() {
    useEffect(() => {
        ReactGA.initialize('G-01VHJVVKF3');
    }, []);

    return (
        <ChakraProvider>
            <I18nextProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/app/*" element={<Training />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/club/*" element={<ClubManagement />} />
                        <Route path="/analytics/*" element={<Analytics />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </I18nextProvider>
        </ChakraProvider>
    );
}

export default App;
