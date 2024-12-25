import {
    ChakraProvider,
    Box,
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
    useToast
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const API_URL = 'https://allchat.online/api';

function App() {
    const [trainingType, setTrainingType] = useState('exercise');
    const [ageGroup, setAgeGroup] = useState('');
    const [playerCount, setPlayerCount] = useState('');
    const [performanceClass, setPerformanceClass] = useState('');
    const [duration, setDuration] = useState('');
    const [trainingAim, setTrainingAim] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { colorMode, toggleColorMode } = useColorMode();
    const toast = useToast();

    const bgColor = useColorModeValue('white', 'gray.700');
    const containerBg = useColorModeValue('gray.50', 'gray.800');

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

            const token = import.meta.env.VITE_CHAT_TOKEN;
            const response = await fetch(`${API_URL}/interact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    input: JSON.stringify(params),
                    model: 'gpt-4'
                })
            });

            const data = await response.json();
            setGeneratedContent(data.textResponse);

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
        <ChakraProvider>
            <Box minH="100vh" bg={containerBg}>
                <Container maxW="container.xl" p={4}>
                    <Flex direction="column" gap={4}>
                        <Flex justify="space-between" align="center">
                            <Heading>Coach AI</Heading>
                            <IconButton
                                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                                onClick={toggleColorMode}
                            />
                        </Flex>

                        <Box bg={bgColor} p={6} borderRadius="lg" shadow="sm">
                            <VStack spacing={4} align="stretch">
                                <FormControl>
                                    <FormLabel>Training Type</FormLabel>
                                    <RadioGroup value={trainingType} onChange={setTrainingType}>
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
                                        onChange={(e) => setPerformanceClass(e.target.value)}
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="advanced">Advanced</option>
                                        <option value="high">High</option>
                                        <option value="pro">Professional</option>
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Duration</FormLabel>
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

                                <Button
                                    colorScheme="blue"
                                    onClick={generateTraining}
                                    isLoading={isLoading}
                                >
                                    Generate Training
                                </Button>
                            </VStack>
                        </Box>

                        {generatedContent && (
                            <Box bg={bgColor} p={6} borderRadius="lg" shadow="sm">
                                <ReactMarkdown>{generatedContent}</ReactMarkdown>
                            </Box>
                        )}
                    </Flex>
                </Container>
            </Box>
        </ChakraProvider>
    );
}

export default App;
