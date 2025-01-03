import {
    Box,
    Text,
    Container,
    Heading,
    Button,
    Flex,
    VStack,
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
    TabPanel,
    Skeleton,
    Badge,
    Grid,
    GridItem,
    Progress,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react';
import { RepeatIcon, SettingsIcon } from '@chakra-ui/icons';
import { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { API_URL } from './App';
import Diagram from './Diagram';
import diagramSchema from './diagramSchema.json';

const PROMPT_TEMPLATE = `You are "AI Coach Pro," an intelligent assistant for soccer coaches. Create a detailed training session based on the following information:

{trainingParams}

The training session should be in a continuous text format and include the following aspects for each drill in detail:

*   **Drill Objective:** What should be achieved with this drill?
*   **Setup:** What materials are needed, and how is the field set up? (e.g., cones, goals, markings)
*   **Procedure:** **Describe the drill procedure in great detail and in individual steps. Include the actions of the players, the rules, and possible game situations. Use a numbered list to structure the individual steps of the process, if possible. If you can, add the duration of the drill**
*   **Coaching Points:** What should the coach pay particular attention to? What tips can they give to the players?
*   **Variations:** How can the drill be varied or adapted (e.g., difficulty, number of players)?

Write in clear, understandable language suitable for soccer coaches. Use technical terms where appropriate.

**Example of a training session (Pressing):**

This exercise is the ideal introduction to the topic of pressing. It is not overly demanding (cognitively) and can be adapted to suit the skill level of the players. The goal is to teach the fundamental principles of pressing: chasing the ball, closing passing lanes, and quickly transitioning after a change of possession.
Equipment and Setup:
8 cones, 10 players divided into pairs with 5 different-colored bibs, at least 10 balls, 2 coaches. Two rectangles are set up with a distance of 10–15 meters between them. The size of the rectangles is adjusted to the team's skill level.
Instructions:
In one rectangle, a 4v2 rondo is played. In the other rectangle, the 4 players pass the ball among themselves without defensive pressure. After losing possession, the two players (a pair wearing the same-colored bibs) responsible for the ball loss must sprint to the other rondo, where the 4v2 game continues. This cycle repeats until all 10 (or more) balls are used. Afterward, there is an active break (collecting the balls), and the drill restarts.
Coaching Points:
In the 4v2 rondo, constant movement and availability are crucial. After every pass, players must reposition to open passing lanes.
The 2 defenders must chase the ball at maximum intensity. They can either both press the ball carrier or one can close the passing lane while the other applies pressure on the ball.
The transition of the group that loses the ball is key to reinforcing pressing principles. Once the ball is recovered, the two defenders must immediately switch roles and chase at full speed.
Variations:
The rectangles can be made larger or smaller as needed.
The number of touches for the outside players can be limited.
After a specific number of passes, the ball can be played from the 4v2 group to the 4v0 group, requiring the defenders to chase across the field.


**Now generate a new training exercise (just 1 exercise) that matches the specified training aim and includes at least one drill with a particularly detailed description of the procedure.**
`;

const DIAGRAM_TEMPLATE = `Create a JSON diagram of the exercise with player positions, cones, and movement paths. Include all movement types:
- Shoot/Pass: Arrow pointing right inside
- Run: Dashed line with right arrow
- Dribbling: Squiggly line with right arrow
- Cross/Long Ball: Curved line with right downward arrow
- Long Run: Dotted line with right downward arrow
- Focus Area: Horizontal solid and dashed lines
- Zone: Rectangle with black dots at corners

Exercise description:
{trainingDescription}

Response must be valid JSON matching this schema: ${JSON.stringify(diagramSchema)}`;

function Training() {
    const { t, i18n } = useTranslation();
    const [trainingType, setTrainingType] = useState('exercise');
    const [ageGroup, setAgeGroup] = useState('');
    const [playerCount, setPlayerCount] = useState('');
    const [performanceClass, setPerformanceClass] = useState('');
    const [duration, setDuration] = useState('');
    const [trainingAim, setTrainingAim] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [generatedTraining, setGeneratedTraining] = useState('');
    const [diagram, setDiagram] = useState();
    const [textModel, setTextModel] = useState('gemini-exp-1206');
    const [diagramModel, setDiagramModel] = useState('claude-3-5-sonnet-20241022');
    const [textTemperature, setTextTemperature] = useState(1);
    const [diagramTemperature, setDiagramTemperature] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [progress, setProgress] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const bgColor = useColorModeValue('white', 'gray.700');
    const containerBg = useColorModeValue('gray.50', 'gray.800');

    useEffect(() => {
        const savedHistory = localStorage.getItem('trainingHistory');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('trainingHistory', JSON.stringify(history));
    }, [history]);

    const cleanGeneratedCode = useCallback((code) => {
        const codeBlockRegex = /```(?:json)?\n([\s\S]*?)\n```/;
        const match = code.match(codeBlockRegex);
        return match ? match[1] : code;
    }, []);

    const generateTraining = async () => {
        setIsLoading(true);
        setProgress(0);
        try {
            const params = {
                trainingType,
                ageGroup,
                playerCount,
                performanceClass,
                duration,
                trainingAim,
                additionalInfo,
                language: i18n.language
            };

            setProgress(25);
            const prompt = PROMPT_TEMPLATE.replace('{trainingParams}', JSON.stringify(params));
            const response = await fetch(`${API_URL}/api/generate-training`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    model: textModel,
                    temperature: textTemperature
                })
            });

            setProgress(50);
            const data = await response.json();
            setGeneratedTraining(data);
            setActiveTab(1);

            setProgress(75);
            setDiagram(null);
            const diagramPrompt = DIAGRAM_TEMPLATE.replace('{trainingDescription}', data);
            const diagramResponse = await fetch(`${API_URL}/api/generate-training`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: diagramPrompt,
                    model: diagramModel,
                    temperature: diagramTemperature
                })
            });

            const diagramData = await diagramResponse.json();
            const jsonMatch = cleanGeneratedCode(diagramData);
            let diagramJson;
            if (jsonMatch) {
                try {
                    diagramJson = JSON.parse(jsonMatch);
                    setDiagram(diagramJson);
                } catch (error) {
                    console.error('Failed to parse diagram JSON:', error);
                }
            }
            setHistory((prev) => [
                ...prev,
                { params, training: data, diagram: diagramJson, timestamp: Date.now() }
            ]);

            setProgress(100);
            toast({
                title: t('notifications.success.title'),
                description: t('notifications.success.description'),
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        } catch {
            toast({
                title: t('notifications.error.title'),
                description: t('notifications.error.description'),
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const exportTraining = () => {
        const blob = new Blob(
            [JSON.stringify({ training: generatedTraining, diagram: diagram }, null, 2)],
            { type: 'application/json' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `training-session-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('trainingHistory');
        onClose();
    };

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <Box minH="100vh" bg={containerBg}>
            <Container maxW="container.xl" p={[2, 4]}>
                <Flex direction="column" gap={4}>
                    <Flex justify="space-between" align="center">
                        <Heading>{t('common.title')}</Heading>
                        <Flex gap={2}>
                            <Select
                                w="100px"
                                value={i18n.language}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                            >
                                <option value="en">🇬🇧 EN</option>
                                <option value="de">🇩🇪 DE</option>
                                <option value="es">🇪🇸 ES</option>
                                <option value="fr">🇫🇷 FR</option>
                                <option value="it">🇮🇹 IT</option>
                                <option value="nl">🇳🇱 NL</option>
                                <option value="pl">🇵🇱 PL</option>
                                <option value="pt">🇵🇹 PT</option>
                                <option value="ru">🇷🇺 RU</option>
                                <option value="sr">🇷🇸 SR</option>
                            </Select>
                            <Menu>
                                <MenuButton as={IconButton} icon={<SettingsIcon />} />
                                <MenuList>
                                    <MenuItem onClick={onOpen}>
                                        {t('settings.clearHistory')}
                                    </MenuItem>
                                    <MenuItem
                                        onClick={exportTraining}
                                        isDisabled={!generatedTraining}
                                    >
                                        {t('settings.exportTraining')}
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                            {/* <IconButton
                                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                                onClick={toggleColorMode}
                            /> */}
                        </Flex>
                    </Flex>

                    {isLoading && <Progress value={progress} size="xs" colorScheme="blue" />}

                    <Tabs index={activeTab} onChange={setActiveTab}>
                        <TabList>
                            <Tab>{t('nav.configuration')}</Tab>
                            <Tab>{t('nav.generatedTraining')}</Tab>
                            <Tab>{t('nav.history')}</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <Box bg={bgColor} p={[3, 6]} borderRadius="lg" shadow="sm">
                                    <Grid templateColumns={['1fr', 'repeat(2, 1fr)']} gap={[4, 6]}>
                                        <GridItem colSpan={1}>
                                            <FormControl>
                                                <FormLabel>{t('form.textModel.label')}</FormLabel>
                                                <Select
                                                    value={textModel}
                                                    onChange={(e) => setTextModel(e.target.value)}
                                                >
                                                    <option value="o1-mini">O1 Mini</option>{' '}
                                                    <option value="gpt-4o">GPT-4 Optimized</option>
                                                    <option value="gpt-4o-mini">GPT-4 Mini</option>
                                                    <option value="claude-3-5-sonnet-20241022">
                                                        Claude 3.5
                                                    </option>
                                                    <option value="gemini-exp-1206">
                                                        Gemini Exp
                                                    </option>
                                                    <option value="gemini-2.0-flash-exp">
                                                        Gemini 2.0 Flash
                                                    </option>
                                                </Select>
                                            </FormControl>

                                            <FormControl mt={2}>
                                                <FormLabel>
                                                    {t('form.textTemperature.label')}
                                                </FormLabel>
                                                <Select
                                                    value={textTemperature}
                                                    onChange={(e) =>
                                                        setTextTemperature(
                                                            parseFloat(e.target.value)
                                                        )
                                                    }
                                                >
                                                    <option value={0}>0.0</option>
                                                    <option value={0.5}>0.5</option>
                                                    <option value={0.7}>0.7</option>
                                                    <option value={1}>1.0</option>
                                                </Select>
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={1}>
                                            <FormControl>
                                                <FormLabel>
                                                    {t('form.diagramModel.label')}
                                                </FormLabel>
                                                <Select
                                                    value={diagramModel}
                                                    onChange={(e) =>
                                                        setDiagramModel(e.target.value)
                                                    }
                                                >
                                                    <option value="o1-mini">O1 Mini</option>{' '}
                                                    <option value="gpt-4o">GPT-4 Optimized</option>
                                                    <option value="gpt-4o-mini">GPT-4 Mini</option>
                                                    <option value="claude-3-5-sonnet-20241022">
                                                        Claude 3.5
                                                    </option>
                                                    <option value="gemini-exp-1206">
                                                        Gemini Exp
                                                    </option>
                                                    <option value="gemini-2.0-flash-exp">
                                                        Gemini 2.0 Flash
                                                    </option>
                                                </Select>
                                            </FormControl>
                                            <FormControl mt={2}>
                                                <FormLabel>
                                                    {t('form.diagramTemperature.label')}
                                                </FormLabel>
                                                <Select
                                                    value={diagramTemperature}
                                                    onChange={(e) =>
                                                        setDiagramTemperature(
                                                            parseFloat(e.target.value)
                                                        )
                                                    }
                                                >
                                                    <option value={0}>0.0</option>
                                                    <option value={0.5}>0.5</option>
                                                    <option value={0.7}>0.7</option>
                                                    <option value={1}>1.0</option>
                                                </Select>
                                            </FormControl>{' '}
                                        </GridItem>

                                        <GridItem colSpan={[2, 1]}>
                                            <FormControl>
                                                <FormLabel>
                                                    {t('form.trainingType.label')}
                                                </FormLabel>
                                                <RadioGroup
                                                    value={trainingType}
                                                    onChange={setTrainingType}
                                                >
                                                    <Stack direction="row">
                                                        <Radio value="exercise">
                                                            {t('form.trainingType.exercise')}
                                                        </Radio>
                                                        <Radio value="session">
                                                            {t('form.trainingType.session')}
                                                        </Radio>
                                                        <Radio value="cyclus">
                                                            {t('form.trainingType.cyclus')}
                                                        </Radio>
                                                    </Stack>
                                                </RadioGroup>
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={[2, 1]}>
                                            <FormControl>
                                                <FormLabel>{t('form.ageGroup.label')}</FormLabel>
                                                <Select
                                                    placeholder={t('form.ageGroup.label')}
                                                    value={ageGroup}
                                                    onChange={(e) => setAgeGroup(e.target.value)}
                                                >
                                                    {[
                                                        'u8',
                                                        'u10',
                                                        'u12',
                                                        'u14',
                                                        'u16',
                                                        'u18',
                                                        'senior'
                                                    ].map((age) => (
                                                        <option key={age} value={age}>
                                                            {age === 'senior'
                                                                ? t('form.ageGroup.senior')
                                                                : `${t('form.ageGroup.under')} ${age.slice(1)}`}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={[2, 1]}>
                                            <FormControl>
                                                <FormLabel>{t('form.playerCount.label')}</FormLabel>
                                                <NumberInput
                                                    min={1}
                                                    value={playerCount}
                                                    onChange={(value) => setPlayerCount(value)}
                                                >
                                                    <NumberInputField />
                                                </NumberInput>
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={[2, 1]}>
                                            <FormControl>
                                                <FormLabel>
                                                    {t('form.performanceClass.label')}
                                                </FormLabel>
                                                <Select
                                                    placeholder={t('form.performanceClass.label')}
                                                    value={performanceClass}
                                                    onChange={(e) =>
                                                        setPerformanceClass(e.target.value)
                                                    }
                                                >
                                                    {['beginner', 'advanced', 'high', 'pro'].map(
                                                        (level) => (
                                                            <option key={level} value={level}>
                                                                {t(
                                                                    `form.performanceClass.${level}`
                                                                )}
                                                            </option>
                                                        )
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={[2, 1]}>
                                            <FormControl>
                                                <FormLabel>{t('form.duration.label')}</FormLabel>
                                                <NumberInput
                                                    min={1}
                                                    value={duration}
                                                    onChange={(value) => setDuration(value)}
                                                >
                                                    <NumberInputField />
                                                </NumberInput>
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={[2, 1]}>
                                            <FormControl>
                                                <FormLabel>{t('form.trainingAim.label')}</FormLabel>
                                                <Select
                                                    placeholder={t('form.trainingAim.label')}
                                                    value={trainingAim}
                                                    onChange={(e) => setTrainingAim(e.target.value)}
                                                >
                                                    {[
                                                        'technical',
                                                        'tactical',
                                                        'physical',
                                                        'mental'
                                                    ].map((aim) => (
                                                        <option key={aim} value={aim}>
                                                            {t(`form.trainingAim.${aim}`)}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={[2, 1]}>
                                            <FormControl>
                                                <FormLabel>
                                                    {t('form.additionalInfo.label')}
                                                </FormLabel>
                                                <Textarea
                                                    value={additionalInfo}
                                                    onChange={(e) =>
                                                        setAdditionalInfo(e.target.value)
                                                    }
                                                    placeholder={t(
                                                        'form.additionalInfo.placeholder'
                                                    )}
                                                    rows={4}
                                                />
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={[2, 1]}>
                                            <Button
                                                w="100%"
                                                colorScheme="blue"
                                                onClick={generateTraining}
                                                isLoading={isLoading}
                                                leftIcon={<RepeatIcon />}
                                            >
                                                {t('form.generate')}
                                            </Button>
                                        </GridItem>
                                    </Grid>
                                </Box>
                            </TabPanel>

                            <TabPanel>
                                {generatedTraining && (
                                    <Box borderWidth="1px" borderRadius="md" p={4}>
                                        {diagram ? (
                                            <Diagram diagram={diagram} />
                                        ) : (
                                            <Skeleton height="300px" />
                                        )}
                                        <ReactMarkdown>{generatedTraining}</ReactMarkdown>
                                    </Box>
                                )}
                            </TabPanel>

                            <TabPanel>
                                <VStack spacing={4} align="stretch">
                                    {history.map((item, index) => (
                                        <Box
                                            key={index}
                                            p={4}
                                            borderWidth="1px"
                                            borderRadius="md"
                                            cursor="pointer"
                                            onClick={() => {
                                                setGeneratedTraining(item.training);
                                                setDiagram(item.diagram);
                                                setActiveTab(1);
                                            }}
                                        >
                                            <Flex justify="space-between" align="center">
                                                <Text fontWeight="bold">
                                                    {t('history.training')} #{index + 1}
                                                </Text>
                                                <Badge colorScheme="blue">
                                                    {t(
                                                        `form.trainingType.${item.params.trainingType}`
                                                    )}
                                                </Badge>
                                            </Flex>
                                            <Text noOfLines={2} fontSize="sm" color="gray.500">
                                                {t(`form.trainingAim.${item.params.trainingAim}`)} -{' '}
                                                {t(
                                                    `form.performanceClass.${item.params.performanceClass}`
                                                )}
                                            </Text>
                                            <Text fontSize="xs" color="gray.400">
                                                {new Date(item.timestamp).toLocaleString()}
                                            </Text>
                                        </Box>
                                    ))}
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Flex>
            </Container>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{t('settings.clearHistory')}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb={4}>{t('settings.clearHistoryConfirm')}</Text>
                        <Button colorScheme="red" onClick={clearHistory}>
                            {t('settings.clearHistory')}
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default Training;
