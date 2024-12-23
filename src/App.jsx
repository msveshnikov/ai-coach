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
    useColorModeValue,
    Tooltip,
    Divider
} from '@chakra-ui/react';
import {
    SunIcon,
    MoonIcon,
    StarIcon,
    SettingsIcon,
    CalendarIcon,
    AtSignIcon,
    ViewIcon,
    EditIcon,
    CheckIcon
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
            'AI Recommendations',
            'Recovery Management'
        ],
        coaching: [
            'Goal Setting',
            'Team Management',
            'Performance Metrics',
            'Training Calendar',
            'Certifications'
        ],
        club: [
            'Philosophy',
            'Age Groups',
            'Development Pathways',
            'Exercise Restrictions',
            'Facility Management'
        ],
        profile: [
            'Certifications',
            'Experience',
            'Achievements',
            'Performance Analytics',
            'Professional Development'
        ]
    };

    const featureContent = {
        'Exercise Library': {
            title: 'Video Exercise Library',
            progress: 80,
            items: [
                'Multiple Angles',
                'Slow Motion Analysis',
                'Technical Breakdown',
                'Difficulty Levels',
                'Custom Restrictions',
                'Video Demonstrations'
            ]
        },
        'Performance Tracking': {
            title: 'Performance Analytics',
            progress: 75,
            items: [
                'Heat Maps',
                'Player Engagement',
                'Progress Metrics',
                'Real-time Updates',
                'Team Statistics',
                'Individual Reports'
            ]
        },
        'AI Recommendations': {
            title: 'AI-Powered Training',
            progress: 65,
            items: [
                'Dynamic Exercise Selection',
                'Difficulty Progression',
                'Real-time Adjustments',
                'Personalized Plans',
                'Team Composition Analysis',
                'Performance Level Assessment'
            ]
        },
        'Goal Setting': {
            title: 'Goal Management',
            progress: 70,
            items: [
                'Custom Objectives',
                'Progress Dashboard',
                'Achievement Milestones',
                'Performance Targets',
                'Team Goals',
                'Individual Goals'
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
        if (!content) return <Text>Feature content will be implemented soon.</Text>;

        return (
            <Box>
                <HStack mb={4} justify="space-between">
                    <Heading size="md">{content.title}</Heading>
                    <Badge colorScheme={content.progress >= 75 ? 'green' : 'orange'}>
                        {content.progress}% Complete
                    </Badge>
                </HStack>
                <Progress value={content.progress} colorScheme="blue" mb={6} />
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                    {content.items.map((item, index) => (
                        <Tooltip key={index} label="Click to view details" placement="top">
                            <Box p={4} borderRadius="md" borderWidth="1px" cursor="pointer">
                                <HStack>
                                    <CheckIcon color="green.500" />
                                    <Text>{item}</Text>
                                </HStack>
                            </Box>
                        </Tooltip>
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
                                <HStack spacing={4}>
                                    <Badge colorScheme="green">Phase 1</Badge>
                                    <Badge colorScheme="blue">Beta</Badge>
                                    <IconButton
                                        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                                        onClick={toggleColorMode}
                                        variant="ghost"
                                    />
                                </HStack>
                            </Flex>
                            <Divider my={4} />
                            <HStack spacing={4}>
                                {Object.keys(navigationItems).map((section) => (
                                    <Button
                                        key={section}
                                        colorScheme={activeSection === section ? 'blue' : 'gray'}
                                        onClick={() => handleNavigation(section)}
                                        leftIcon={
                                            section === 'profile' ? (
                                                <StarIcon />
                                            ) : section === 'coaching' ? (
                                                <ViewIcon />
                                            ) : section === 'club' ? (
                                                <AtSignIcon />
                                            ) : (
                                                <CalendarIcon />
                                            )
                                        }
                                        size="md"
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
                                        leftIcon={<EditIcon />}
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
                                        <Text color="gray.500">
                                            Select a feature to get started
                                        </Text>
                                    </Box>
                                )}
                            </Box>
                        </Flex>

                        <Box p={4} bg={bgColor} shadow="md">
                            <Text textAlign="center" color="gray.500">
                                © 2024 Training Management System - Powered by AI
                            </Text>
                        </Box>
                    </Flex>
                </Container>
            </Box>
        </ChakraProvider>
    );
}

export default App;
