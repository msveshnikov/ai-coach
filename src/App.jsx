import { ChakraProvider, Box, Icon } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FiActivity, FiBarChart2, FiUsers, FiUser } from 'react-icons/fi';
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

    const NavigationBar = () => (
        <Box
            position="fixed"
            bottom="0"
            left="0"
            right="0"
            height="50px"
            bg="white"
            borderTopWidth="1px"
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            zIndex={1000}
            fontSize="sm"
            sx={{
                '@supports (backdrop-filter: blur(10px))': {
                    backdropFilter: 'blur(10px)',
                    bg: 'rgba(255, 255, 255, 0.9)'
                }
            }}
        >
            <Box as="a" href="/app" p={2} display="flex" flexDirection="column" alignItems="center">
                <Icon as={FiActivity} boxSize={5} />
                <Box fontSize="xs">Training</Box>
            </Box>
            <Box as="a" href="/analytics" p={2} display="flex" flexDirection="column" alignItems="center">
                <Icon as={FiBarChart2} boxSize={5} />
                <Box fontSize="xs">Analytics</Box>
            </Box>
            <Box as="a" href="/club" p={2} display="flex" flexDirection="column" alignItems="center">
                <Icon as={FiUsers} boxSize={5} />
                <Box fontSize="xs">Club</Box>
            </Box>
            <Box as="a" href="/profile" p={2} display="flex" flexDirection="column" alignItems="center">
                <Icon as={FiUser} boxSize={5} />
                <Box fontSize="xs">Profile</Box>
            </Box>
        </Box>
    );

    return (
        <ChakraProvider>
            <I18nextProvider>
                <Router>
                    <Box pb="50px">
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/app/*" element={<Training />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/club/*" element={<ClubManagement />} />
                            <Route path="/analytics/*" element={<Analytics />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                        <NavigationBar />
                    </Box>
                </Router>
            </I18nextProvider>
        </ChakraProvider>
    );
}

export default App;