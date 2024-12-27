import { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    Grid,
    Heading,
    Stat,
    StatLabel,
    StatNumber,
    StatArrow,
    StatGroup,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useColorModeValue
} from '@chakra-ui/react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { API_URL } from './App';

const Analytics = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [teamStats, setTeamStats] = useState({});
    const [predictionData, setPredictionData] = useState({});
    const [injuryMetrics, setInjuryMetrics] = useState({});

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [performance, team, predictions, injury] = await Promise.all([
                    fetch(`${API_URL}/api/analytics/performance`).then((r) => r.json()),
                    fetch(`${API_URL}/api/analytics/team`).then((r) => r.json()),
                    fetch(`${API_URL}/api/analytics/predictions`).then((r) => r.json()),
                    fetch(`${API_URL}/api/analytics/injury`).then((r) => r.json())
                ]);

                setPerformanceData(performance);
                setTeamStats(team);
                setPredictionData(predictions);
                setInjuryMetrics(injury);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            }
        };

        fetchAnalytics();
    }, []);

    return (
        <Box p={8}>
            <Heading mb={6}>Analytics Dashboard</Heading>

            <StatGroup mb={8}>
                <Stat
                    p={4}
                    bg={bgColor}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                >
                    <StatLabel>Team Performance</StatLabel>
                    <StatNumber>{teamStats.performance}%</StatNumber>
                    <StatArrow type={teamStats.trend === 'increase' ? 'increase' : 'decrease'} />
                </Stat>
                <Stat
                    p={4}
                    bg={bgColor}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                >
                    <StatLabel>Injury Risk</StatLabel>
                    <StatNumber>{injuryMetrics.riskLevel}%</StatNumber>
                </Stat>
                <Stat
                    p={4}
                    bg={bgColor}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                >
                    <StatLabel>Team Chemistry</StatLabel>
                    <StatNumber>{teamStats.chemistry}</StatNumber>
                </Stat>
            </StatGroup>

            <Tabs>
                <TabList>
                    <Tab>Performance Trends</Tab>
                    <Tab>Injury Prevention</Tab>
                    <Tab>Team Chemistry</Tab>
                    <Tab>Predictions</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Box
                            h="400px"
                            bg={bgColor}
                            p={4}
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor={borderColor}
                        >
                            <ResponsiveContainer>
                                <LineChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#DFBE6F" />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </TabPanel>

                    <TabPanel>
                        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
                            {Object.entries(injuryMetrics).map(([key, value]) => (
                                <Stat
                                    key={key}
                                    p={4}
                                    bg={bgColor}
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                >
                                    <StatLabel>{key}</StatLabel>
                                    <StatNumber>{value}</StatNumber>
                                </Stat>
                            ))}
                        </Grid>
                    </TabPanel>

                    <TabPanel>
                        <Flex direction="column" gap={4}>
                            {Object.entries(teamStats).map(([key, value]) => (
                                <Box
                                    key={key}
                                    p={4}
                                    bg={bgColor}
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                >
                                    <Heading size="sm" mb={2}>
                                        {key}
                                    </Heading>
                                    {typeof value === 'number' ? (
                                        <StatNumber>{value}</StatNumber>
                                    ) : (
                                        <Box>{value}</Box>
                                    )}
                                </Box>
                            ))}
                        </Flex>
                    </TabPanel>

                    <TabPanel>
                        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
                            {Object.entries(predictionData).map(([key, value]) => (
                                <Box
                                    key={key}
                                    p={4}
                                    bg={bgColor}
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                >
                                    <Heading size="sm" mb={2}>
                                        {key}
                                    </Heading>
                                    <Box>{value}</Box>
                                </Box>
                            ))}
                        </Grid>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default Analytics;
