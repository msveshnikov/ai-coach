import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Training from './Training';
import { Landing } from './Landing';

function App() {
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [userProfile, setUserProfile] = useState(null);

    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const response = await fetch('/api/auth/check');
    //             const data = await response.json();
    //             setIsAuthenticated(data.authenticated);
    //             setUserProfile(data.profile);
    //         } catch (error) {
    //             console.error('Auth check failed:', error);
    //         }
    //     };
    //     checkAuth();
    // }, []);

    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/app" element={<Training />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/club" element={<ClubManagement />} />
                    <Route path="/analytics" element={<Analytics />} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
}

const Profile = () => (
    <Box w="full" p={8}>
        {/* Profile implementation */}
    </Box>
);

const ClubManagement = () => (
    <Box w="full" p={8}>
        {/* Club Management implementation */}
    </Box>
);

const Analytics = () => (
    <Box w="full" p={8}>
        {/* Analytics implementation */}
    </Box>
);

export default App;
