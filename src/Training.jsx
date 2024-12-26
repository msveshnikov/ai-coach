import {
    Box,
    Text,
    Container,
    Heading,
    Button,
    Flex,
    VStack,
    useColorMode,
    IconButton,
    useColorModeValue,
    Select,
    NumberInput,
    NumberInputField,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    Stack,
    useToast,
    Textarea,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Exercise from './Exercise';

export const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://ai-coach.club';

const PROMPT_TEMPLATE = `Create a detailed football training session based on these parameters:

Parameters:
{trainingParams}

Additional Information:
{additionalInfo}

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
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    required: ['field', 'elements'],
    properties: {
        field: {
            type: 'object',
            required: ['width', 'height'],
            properties: {
                width: {
                    type: 'number',
                    description: 'Width of the field in meters',
                    example: 50
                },
                height: {
                    type: 'number',
                    description: 'Height of the field in meters',
                    example: 40
                }
            }
        },
        elements: {
            type: 'array',
            items: {
                type: 'object',
                required: ['type', 'position'],
                properties: {
                    type: {
                        type: 'string',
                        enum: ['player', 'cone', 'path'],
                        description: 'Type of element on the field'
                    },
                    position: {
                        type: 'object',
                        required: ['x', 'y'],
                        properties: {
                            x: {
                                type: 'number',
                                description: 'X coordinate on the field'
                            },
                            y: {
                                type: 'number',
                                description: 'Y coordinate on the field'
                            }
                        }
                    },
                    team: {
                        type: 'string',
                        enum: ['team1', 'team2'],
                        description: 'Team assignment for players'
                    },
                    path: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['x', 'y'],
                            properties: {
                                x: { type: 'number' },
                                y: { type: 'number' }
                            }
                        },
                        description: 'Array of points defining a movement path'
                    }
                }
            }
        }
    },
    field: {
        width: 50,
        height: 40
    },
    elements: [
        {
            type: 'cone',
            position: { x: 10, y: 5 }
        },
        {
            type: 'cone',
            position: { x: 15, y: 10 }
        },
        {
            type: 'cone',
            position: { x: 20, y: 15 }
        },
        {
            type: 'cone',
            position: { x: 25, y: 20 }
        },
        {
            type: 'cone',
            position: { x: 30, y: 25 }
        },
        {
            type: 'player',
            position: { x: 5, y: 10 },
            team: 'team1'
        },
        {
            type: 'player',
            position: { x: 45, y: 30 },
            team: 'team2'
        },
        {
            type: 'path',
            path: [
                { x: 5, y: 10 },
                { x: 10, y: 5 },
                { x: 15, y: 10 },
                { x: 20, y: 15 },
                { x: 25, y: 20 },
                { x: 30, y: 25 },
                { x: 45, y: 30 }
            ]
        }
    ]
};

function Training() {
    const [trainingType, setTrainingType] = useState('exercise');
    const [ageGroup, setAgeGroup] = useState('');
    const [playerCount, setPlayerCount] = useState('');
    const [performanceClass, setPerformanceClass] = useState('');
    const [duration, setDuration] = useState('');
    const [trainingAim, setTrainingAim] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [generatedTraining, setGeneratedTraining] = useState('');
    const [exerciseData, setExerciseData] = useState(exercise);

    const [activeTab, setActiveTab] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { colorMode, toggleColorMode } = useColorMode();
    const toast = useToast();

    const bgColor = useColorModeValue('white', 'gray.700');
    const containerBg = useColorModeValue('gray.50', 'gray.800');

    function cleanGeneratedCode(code) {
        const codeBlockRegex = /```(?:json)?\n([\s\S]*?)\n```/;
        const match = code.match(codeBlockRegex);
        return match ? match[1] : null;
    }

    const generateTraining = async () => {
        setIsLoading(true);
        try {
            const params = {
                type: trainingType,
                ageGroup,
                playerCount,
                performanceClass,
                duration,
                aim: trainingAim
            };

            const prompt = PROMPT_TEMPLATE.replace(
                '{trainingParams}',
                JSON.stringify(params)
            ).replace('{additionalInfo}', additionalInfo);

            const response = await fetch(`${API_URL}/api/generate-training`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt,
                    model: 'gpt-4o'
                })
            });

            const data = await response.json();
            setGeneratedTraining(data.exercise);
            setActiveTab(1);

            const jsonMatch = cleanGeneratedCode(data.exercise);
            if (jsonMatch) {
                try {
                    console.log(jsonMatch);
                    const diagramData = JSON.parse(jsonMatch);
                    setExerciseData(diagramData);
                } catch {
                    console.error('Failed to parse diagram JSON');
                }
            }

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

    return (
        <Box minH="100vh" bg={containerBg}>
            <Container maxW="container.xl" p={4}>
                <Flex direction="column" gap={4}>
                    <Flex justify="space-between" align="center">
                        <Heading>AI Coach</Heading>
                        <IconButton
                            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            onClick={toggleColorMode}
                        />
                    </Flex>

                    <Tabs index={activeTab} onChange={setActiveTab}>
                        <TabList>
                            <Tab>Configuration</Tab>
                            <Tab>Generated Training</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <Box bg={bgColor} p={6} borderRadius="lg" shadow="sm">
                                    <VStack spacing={4} align="stretch">
                                        <FormControl>
                                            <FormLabel>Training Type</FormLabel>
                                            <RadioGroup
                                                value={trainingType}
                                                onChange={setTrainingType}
                                            >
                                                <Stack direction="row">
                                                    <Radio value="exercise">Exercise</Radio>
                                                    <Radio value="session">Session</Radio>
                                                    <Radio value="cyclus">Cyclus</Radio>
                                                </Stack>
                                            </RadioGroup>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel>Age Group</FormLabel>
                                            <Select
                                                placeholder="Select age group"
                                                value={ageGroup}
                                                onChange={(e) => setAgeGroup(e.target.value)}
                                            >
                                                <option value="u8">Under 8</option>
                                                <option value="u10">Under 10</option>
                                                <option value="u12">Under 12</option>
                                                <option value="u14">Under 14</option>
                                                <option value="u16">Under 16</option>
                                                <option value="u18">Under 18</option>
                                                <option value="senior">Senior</option>
                                            </Select>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel>Number of Players</FormLabel>
                                            <NumberInput
                                                min={1}
                                                value={playerCount}
                                                onChange={(value) => setPlayerCount(value)}
                                            >
                                                <NumberInputField />
                                            </NumberInput>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel>Performance Class</FormLabel>
                                            <Select
                                                placeholder="Select performance class"
                                                value={performanceClass}
                                                onChange={(e) =>
                                                    setPerformanceClass(e.target.value)
                                                }
                                            >
                                                <option value="beginner">Beginner</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="high">High</option>
                                                <option value="pro">Professional</option>
                                            </Select>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel>Duration (minutes)</FormLabel>
                                            <NumberInput
                                                min={1}
                                                value={duration}
                                                onChange={(value) => setDuration(value)}
                                            >
                                                <NumberInputField />
                                            </NumberInput>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel>Training Aim</FormLabel>
                                            <Select
                                                placeholder="Select training aim"
                                                value={trainingAim}
                                                onChange={(e) => setTrainingAim(e.target.value)}
                                            >
                                                <option value="technical">Technical</option>
                                                <option value="tactical">Tactical</option>
                                                <option value="physical">Physical</option>
                                                <option value="mental">Mental</option>
                                            </Select>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel>Additional Information</FormLabel>
                                            <Textarea
                                                value={additionalInfo}
                                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                                placeholder="Enter any additional requirements or specifications"
                                                rows={4}
                                            />
                                        </FormControl>

                                        <Button
                                            colorScheme="blue"
                                            onClick={generateTraining}
                                            isLoading={isLoading}
                                        >
                                            Generate Training
                                        </Button>
                                    </VStack>
                                </Box>
                            </TabPanel>

                            <TabPanel>
                                {generatedTraining && (
                                    <Box borderWidth="1px" borderRadius="md" p={4}>
                                        {exerciseData && <Exercise exercise={exerciseData} />}
                                        <ReactMarkdown>{generatedTraining}</ReactMarkdown>
                                    </Box>
                                )}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>

                    <Box p={4} bg={bgColor} shadow="md">
                        <Text textAlign="center" color="gray.500">
                            © 2024 AI Coach
                        </Text>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
}

export default Training;
