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
    IconButton,
    Grid,
    Badge,
    Progress,
    useColorModeValue
} from '@chakra-ui/react';
import {
    SunIcon,
    MoonIcon,
    StarIcon,
    InfoIcon,
    SettingsIcon,
    CalendarIcon
} from '@chakra-ui/icons';
import { useState } from 'react';

function App() {
    const [activeSection, setActiveSection] = useState('training');
    const [selectedFeature, setSelectedFeature] = useState(null);
    const { colorMode, toggleColorMode } = useColorMode();

    const bgColor = useColorModeValue('white', 'gray.700');
    const containerBg = useColorModeValue('gray.50', 'gray.800');

    const navigationItems = {
        training: [
            'Exercise Library',
            'Session Planning',
            'Performance Tracking',
            'AI Recommendations'
        ],
        coaching: ['Goal Setting', 'Team Management', 'Performance Metrics', 'Training Calendar'],
        club: ['Philosophy', 'Age Groups', 'Development Pathways', 'Exercise Restrictions'],
        profile: ['Certifications', 'Experience', 'Achievements', 'Performance Analytics']
    };

    const featureContent = {
        'Exercise Library': {
            title: 'Video Exercise Library',
            progress: 80,
            items: ['Multiple Angles', 'Slow Motion', 'Technical Breakdown', 'Difficulty Levels']
        },
        'Performance Tracking': {
            title: 'Performance Analytics',
            progress: 70,
            items: ['Heat Maps', 'Player Engagement', 'Progress Metrics', 'Real-time Updates']
        },
        'AI Recommendations': {
            title: 'AI-Powered Training',
            progress: 60,
            items: [
                'Dynamic Selection',
                'Difficulty Progression',
                'Real-time Adjustments',
                'Personalized Plans'
            ]
        }
    };

    const handleNavigation = (section) => {
        setActiveSection(section);
        setSelectedFeature(null);
    };

    const handleFeatureSelect = (feature) => {
        setSelectedFeature(feature);
    };

    const renderFeatureContent = (feature) => {
        const content = featureContent[feature];
        if (!content) return <Text>Feature content will be implemented here.</Text>;

        return (
            <Box>
                <Heading size="md" mb={4}>
                    {content.title}
                </Heading>
                <Progress value={content.progress} colorScheme="blue" mb={6} />
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    {content.items.map((item, index) => (
                        <Box key={index} p={4} borderRadius="md" borderWidth="1px">
                            <HStack>
                                <InfoIcon />
                                <Text>{item}</Text>
                            </HStack>
                        </Box>
                    ))}
                </Grid>
            </Box>
        );
    };

    return (
        <ChakraProvider>
            <Box minH="100vh" bg={containerBg}>
                <Container maxW="container.xl" p={0}>
                    <Flex direction="column" h="100vh">
                        <Box p={4} bg={bgColor} shadow="md">
                            <Flex justify="space-between" align="center">
                                <HStack spacing={2}>
                                    <SettingsIcon w={6} h={6} />
                                    <Heading size="lg">Training Management System</Heading>
                                </HStack>
                                <HStack>
                                    <Badge colorScheme="green">Phase 1</Badge>
                                    <IconButton
                                        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                                        onClick={toggleColorMode}
                                        variant="ghost"
                                    />
                                </HStack>
                            </Flex>
                            <HStack spacing={4} mt={4}>
                                {Object.keys(navigationItems).map((section) => (
                                    <Button
                                        key={section}
                                        colorScheme={activeSection === section ? 'blue' : 'gray'}
                                        onClick={() => handleNavigation(section)}
                                        leftIcon={
                                            section === 'profile' ? <StarIcon /> : <CalendarIcon />
                                        }
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
                                bg={bgColor}
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
                                        // _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                                    >
                                        {feature}
                                    </Button>
                                ))}
                            </VStack>

                            <Box flex={1} ml={4} p={6} bg={bgColor} borderRadius="md" shadow="sm">
                                {selectedFeature ? (
                                    renderFeatureContent(selectedFeature)
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

                        <Box p={4} bg={bgColor} shadow="md">
                            <Text textAlign="center">
                                © Training Management System - Powered by AI
                            </Text>
                        </Box>
                    </Flex>
                </Container>
            </Box>
        </ChakraProvider>
    );
}

export default App;
