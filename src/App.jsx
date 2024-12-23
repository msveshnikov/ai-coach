import {
    ChakraProvider,
    Box,
    Container,
    Heading,
    Button,
    Flex,
    VStack,
    HStack,
    Text,
    useColorMode,
    IconButton
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { useState } from 'react';

function App() {
    const [activeSection, setActiveSection] = useState('training');
    const [selectedFeature, setSelectedFeature] = useState(null);
    const { colorMode, toggleColorMode } = useColorMode();

    const navigationItems = {
        training: ['Exercise Library', 'Session Planning', 'Performance Tracking'],
        coaching: ['Goal Setting', 'Team Management', 'Exercise Recommendations'],
        club: ['Philosophy', 'Age Groups', 'Development Pathways'],
        profile: ['Certifications', 'Experience', 'Achievements']
    };

    const handleNavigation = (section) => {
        setActiveSection(section);
        setSelectedFeature(null);
    };

    const handleFeatureSelect = (feature) => {
        setSelectedFeature(feature);
    };

    return (
        <ChakraProvider>
            <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}>
                <Container maxW="container.xl" p={0}>
                    <Flex direction="column" h="100vh">
                        <Box p={4} bg={colorMode === 'light' ? 'white' : 'gray.700'} shadow="md">
                            <Flex justify="space-between" align="center">
                                <Heading size="lg">Training Management System</Heading>
                                <IconButton
                                    icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                                    onClick={toggleColorMode}
                                    variant="ghost"
                                />
                            </Flex>
                            <HStack spacing={4} mt={4}>
                                {Object.keys(navigationItems).map((section) => (
                                    <Button
                                        key={section}
                                        colorScheme={activeSection === section ? 'blue' : 'gray'}
                                        onClick={() => handleNavigation(section)}
                                    >
                                        {section.charAt(0).toUpperCase() + section.slice(1)}
                                    </Button>
                                ))}
                            </HStack>
                        </Box>

                        <Flex flex={1} p={4}>
                            <VStack
                                w="250px"
                                spacing={3}
                                align="stretch"
                                bg={colorMode === 'light' ? 'white' : 'gray.700'}
                                p={4}
                                borderRadius="md"
                                shadow="sm"
                            >
                                {navigationItems[activeSection].map((feature) => (
                                    <Button
                                        key={feature}
                                        variant={selectedFeature === feature ? 'solid' : 'ghost'}
                                        colorScheme={selectedFeature === feature ? 'blue' : 'gray'}
                                        onClick={() => handleFeatureSelect(feature)}
                                        justifyContent="flex-start"
                                    >
                                        {feature}
                                    </Button>
                                ))}
                            </VStack>

                            <Box
                                flex={1}
                                ml={4}
                                p={6}
                                bg={colorMode === 'light' ? 'white' : 'gray.700'}
                                borderRadius="md"
                                shadow="sm"
                            >
                                {selectedFeature ? (
                                    <Box>
                                        <Heading size="md" mb={4}>
                                            {selectedFeature}
                                        </Heading>
                                        <Text>Feature content will be implemented here.</Text>
                                    </Box>
                                ) : (
                                    <Box textAlign="center" py={10}>
                                        <Heading size="md" mb={4}>
                                            Welcome to{' '}
                                            {activeSection.charAt(0).toUpperCase() +
                                                activeSection.slice(1)}{' '}
                                            Management
                                        </Heading>
                                        <Text>Select a feature to get started</Text>
                                    </Box>
                                )}
                            </Box>
                        </Flex>

                        <Box p={4} bg={colorMode === 'light' ? 'white' : 'gray.700'} shadow="md">
                            <Text textAlign="center">Training Management System - Phase 1</Text>
                        </Box>
                    </Flex>
                </Container>
            </Box>
        </ChakraProvider>
    );
}

export default App;
