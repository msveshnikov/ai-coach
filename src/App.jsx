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
    Divider,
    Textarea,
    useToast,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem
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
    CheckIcon,
    SpinnerIcon,
    HamburgerIcon,
    ChevronDownIcon
} from '@chakra-ui/icons';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Exercise from './Exercise';

const API_URL = 'https://allchat.online/api';

const PROMPT_TEMPLATE = `Generate a detailed football training session based on these parameters:

Parameters:
{trainingParams}

Please include:
- Warm-up exercises
- Technical drills
- Tactical exercises 
- Game situations
- Cool down routine

Format the response with clear sections and bullet points.

Also include a diagram of the training with player positions and cones. Diagram should be in JSON schema:
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "required": ["field", "elements"],
    "properties": {
        "field": {
            "type": "object",
            "required": ["width", "height"],
            "properties": {
                "width": {
                    "type": "number",
                    "description": "Width of the field in meters"
                },
                "height": {
                    "type": "number",
                    "description": "Height of the field in meters"
                }
            }
        },
        "elements": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["type", "position"],
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": ["player", "cone", "path"],
                        "description": "Type of element on the field"
                    },
                    "position": {
                        "type": "object",
                        "required": ["x", "y"],
                        "properties": {
                            "x": {
                                "type": "number",
                                "description": "X coordinate on the field"
                            },
                            "y": {
                                "type": "number",
                                "description": "Y coordinate on the field"
                            }
                        }
                    },
                    "team": {
                        "type": "string",
                        "enum": ["team1", "team2"],
                        "description": "Team assignment for players"
                    },
                    "path": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "required": ["x", "y"],
                            "properties": {
                                "x": { "type": "number" },
                                "y": { "type": "number" }
                            }
                        },
                        "description": "Array of points defining a movement path"
                    }
                }
            }
        },
    }
}
`;

const exercise = {
    title: 'Fantasiegeschichte',
    field: {
        width: 12,
        height: 12
    },
    elements: [
        {
            type: 'player',
            position: { x: 3, y: 3 },
            team: 'team1'
        },
        {
            type: 'player',
            position: { x: 9, y: 3 },
            team: 'team2'
        },
        {
            type: 'player',
            position: { x: 6, y: 9 },
            team: 'team1'
        },
        {
            type: 'player',
            position: { x: 2, y: 7 },
            team: 'team2'
        },
        {
            type: 'player',
            position: { x: 10, y: 7 },
            team: 'team1'
        },
        {
            type: 'cone',
            position: { x: 6, y: 6 }
        },
        {
            type: 'cone',
            position: { x: 3, y: 9 }
        },
        {
            type: 'cone',
            position: { x: 9, y: 9 }
        },
        {
            type: 'ball',
            position: { x: 6, y: 3 }
        },
        {
            type: 'path',
            position: { x: 3, y: 3 },
            path: [
                { x: 3, y: 3 },
                { x: 6, y: 6 },
                { x: 9, y: 3 }
            ]
        },
        {
            type: 'path',
            position: { x: 6, y: 9 },
            path: [
                { x: 6, y: 9 },
                { x: 6, y: 6 },
                { x: 6, y: 3 }
            ]
        }
    ],
    description: 'Die Kinder sind als Abenteurer im Urwald unterwegs.',
    organization: [
        'Ein 12 x 12 Meter großes Feld markieren.',
        'Im Feld mehrere Hütchen gemäß Abbildung aufstellen.',
        'Die Gruppe in Abenteurer und Urwaldaffen aufteilen.'
    ]
};

function App() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [activeSection, setActiveSection] = useState('training');
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [trainingParams, setTrainingParams] = useState('');
    const [generatedTraining, setGeneratedTraining] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { colorMode, toggleColorMode } = useColorMode();
    const toast = useToast();

    const bgColor = useColorModeValue('white', 'gray.700');
    const containerBg = useColorModeValue('gray.50', 'gray.800');

    const navigationItems = {
        training: [
            'Create Training',
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

    const generateTraining = async () => {
        setIsLoading(true);
        try {
            const token = import.meta.env.VITE_CHAT_TOKEN;
            const prompt = PROMPT_TEMPLATE.replace('{trainingParams}', trainingParams);
            const response = await fetch(`${API_URL}/interact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ input: prompt, model: 'gpt-4o-mini' })
            });
            const data = await response.json();
            setGeneratedTraining(data.textResponse);
            toast({
                title: 'Training Generated',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to generate training',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setIsLoading(false);
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
        if (feature === 'Create Training') {
            return (
                <Box>
                    <Heading size="md" mb={4}>
                        Create Training Session
                    </Heading>
                    <Textarea
                        value={trainingParams}
                        onChange={(e) => setTrainingParams(e.target.value)}
                        placeholder="Enter training parameters (age group, skill level, focus areas, duration, etc.)"
                        mb={4}
                        rows={6}
                    />
                    <Button
                        colorScheme="blue"
                        onClick={generateTraining}
                        isLoading={isLoading}
                        leftIcon={isLoading ? <SpinnerIcon /> : null}
                        mb={4}
                    >
                        Generate Training
                    </Button>
                    {generatedTraining && (
                        <Box borderWidth="1px" borderRadius="md" p={4}>
                            <Exercise exercise={exercise} />
                            <ReactMarkdown>{generatedTraining}</ReactMarkdown>
                        </Box>
                    )}
                </Box>
            );
        }

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
                                    <IconButton
                                        display={{ base: 'flex', md: 'none' }}
                                        onClick={onOpen}
                                        icon={<HamburgerIcon />}
                                        variant="ghost"
                                    />
                                    <SettingsIcon w={6} h={6} />
                                    <Heading size={{ base: 'md', md: 'lg' }}>TMS</Heading>
                                </HStack>
                                <HStack spacing={4}>
                                    <Badge
                                        display={{ base: 'none', md: 'flex' }}
                                        colorScheme="green"
                                    >
                                        Phase 1
                                    </Badge>
                                    <Badge
                                        display={{ base: 'none', md: 'flex' }}
                                        colorScheme="blue"
                                    >
                                        Beta
                                    </Badge>
                                    <IconButton
                                        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                                        onClick={toggleColorMode}
                                        variant="ghost"
                                    />
                                </HStack>
                            </Flex>
                            <Divider my={4} />
                            <HStack display={{ base: 'none', md: 'flex' }} spacing={4}>
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
                            <Menu display={{ base: 'block', md: 'none' }}>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                    {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                                </MenuButton>
                                <MenuList>
                                    {Object.keys(navigationItems).map((section) => (
                                        <MenuItem
                                            key={section}
                                            onClick={() => handleNavigation(section)}
                                        >
                                            {section.charAt(0).toUpperCase() + section.slice(1)}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                        </Box>

                        <Flex flex={1} p={4}>
                            <VStack
                                display={{ base: 'none', md: 'flex' }}
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

                            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                                <DrawerOverlay>
                                    <DrawerContent>
                                        <DrawerCloseButton />
                                        <DrawerHeader>Menu</DrawerHeader>
                                        <DrawerBody>
                                            <VStack spacing={3} align="stretch">
                                                {navigationItems[activeSection].map((feature) => (
                                                    <Button
                                                        key={feature}
                                                        variant={
                                                            selectedFeature === feature
                                                                ? 'solid'
                                                                : 'ghost'
                                                        }
                                                        colorScheme={
                                                            selectedFeature === feature
                                                                ? 'blue'
                                                                : 'gray'
                                                        }
                                                        onClick={() => {
                                                            handleFeatureSelect(feature);
                                                            onClose();
                                                        }}
                                                        justifyContent="flex-start"
                                                        leftIcon={<EditIcon />}
                                                    >
                                                        {feature}
                                                    </Button>
                                                ))}
                                            </VStack>
                                        </DrawerBody>
                                    </DrawerContent>
                                </DrawerOverlay>
                            </Drawer>

                            <Box
                                flex={1}
                                ml={{ base: 0, md: 4 }}
                                p={6}
                                bg={bgColor}
                                borderRadius="md"
                                shadow="sm"
                            >
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
