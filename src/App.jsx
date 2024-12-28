import { ChakraProvider, useToast } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import Training from './Training';
import { Landing } from './Landing';
import Analytics from './Analytics';
import ClubManagement from './ClubManagement';
import Profile from './Profile';

export const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://aicoachpro.ai';
export const AuthContext = createContext(null);

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const toast = useToast();

    useEffect(() => {
        // const checkAuth = async () => {
        //     try {
        //         const response = await fetch(`${API_URL}/api/auth/check`, {
        //             credentials: 'include'
        //         });
        //         const data = await response.json();
        //         setIsAuthenticated(data.authenticated);
        //         setUserProfile(data.profile);
        //     } catch {
        //         /* empty */
        //     }
        // };
        // checkAuth();
    }, [toast]);

    const authContextValue = {
        isAuthenticated,
        setIsAuthenticated,
        userProfile,
        setUserProfile
    };

    return (
        <ChakraProvider>
            <AuthContext.Provider value={authContextValue}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/app/*" element={<Training />} />
                        <Route
                            path="/profile"
                            element={isAuthenticated ? <Profile /> : <Navigate to="/" replace />}
                        />
                        <Route
                            path="/club/*"
                            element={
                                isAuthenticated ? <ClubManagement /> : <Navigate to="/" replace />
                            }
                        />
                        <Route
                            path="/analytics/*"
                            element={isAuthenticated ? <Analytics /> : <Navigate to="/" replace />}
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </AuthContext.Provider>
        </ChakraProvider>
    );
}

export default App;
