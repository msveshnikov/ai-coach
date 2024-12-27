import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    Avatar,
    Button,
    FormControl,
    FormLabel,
    Input,
    useToast,
    Container,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Badge,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText
} from '@chakra-ui/react';
import { API_URL } from './App';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        club: '',
        phone: ''
    });
    const toast = useToast();

    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_URL}/api/profile`, {
                credentials: 'include'
            });
            const data = await response.json();
            setProfile(data);
            setFormData(data);
        } catch {
            toast({
                title: 'Error fetching profile',
                status: 'error',
                duration: 3000
            });
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setProfile(formData);
                setIsEditing(false);
                toast({
                    title: 'Profile updated successfully',
                    status: 'success',
                    duration: 3000
                });
            }
        } catch {
            toast({
                title: 'Error updating profile',
                status: 'error',
                duration: 3000
            });
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box textAlign="center">
                    <Avatar size="2xl" name={profile?.name} src={profile?.avatar} mb={4} />
                    <Heading size="lg">{profile?.name}</Heading>
                    <Text color="gray.600">{profile?.role}</Text>
                    <Badge colorScheme="blue" mt={2}>
                        {profile?.club}
                    </Badge>
                </Box>

                <Tabs variant="enclosed">
                    <TabList>
                        <Tab>Profile</Tab>
                        <Tab>Statistics</Tab>
                        <Tab>Settings</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            {isEditing ? (
                                <form onSubmit={handleSubmit}>
                                    <VStack spacing={4}>
                                        <FormControl>
                                            <FormLabel>Name</FormLabel>
                                            <Input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Email</FormLabel>
                                            <Input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Role</FormLabel>
                                            <Input
                                                name="role"
                                                value={formData.role}
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Club</FormLabel>
                                            <Input
                                                name="club"
                                                value={formData.club}
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Phone</FormLabel>
                                            <Input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                        <Button type="submit" colorScheme="blue">
                                            Save
                                        </Button>
                                        <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                                    </VStack>
                                </form>
                            ) : (
                                <VStack align="stretch" spacing={4}>
                                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                                    <SimpleGrid columns={2} spacing={4}>
                                        <Text fontWeight="bold">Email:</Text>
                                        <Text>{profile?.email}</Text>
                                        <Text fontWeight="bold">Phone:</Text>
                                        <Text>{profile?.phone}</Text>
                                        <Text fontWeight="bold">Role:</Text>
                                        <Text>{profile?.role}</Text>
                                        <Text fontWeight="bold">Club:</Text>
                                        <Text>{profile?.club}</Text>
                                    </SimpleGrid>
                                </VStack>
                            )}
                        </TabPanel>

                        <TabPanel>
                            <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                                <Stat>
                                    <StatLabel>Total Sessions</StatLabel>
                                    <StatNumber>{profile?.stats?.totalSessions || 0}</StatNumber>
                                    <StatHelpText>This year</StatHelpText>
                                </Stat>
                                <Stat>
                                    <StatLabel>Active Players</StatLabel>
                                    <StatNumber>{profile?.stats?.activePlayers || 0}</StatNumber>
                                    <StatHelpText>Current season</StatHelpText>
                                </Stat>
                                <Stat>
                                    <StatLabel>Training Hours</StatLabel>
                                    <StatNumber>{profile?.stats?.trainingHours || 0}</StatNumber>
                                    <StatHelpText>Last 30 days</StatHelpText>
                                </Stat>
                            </SimpleGrid>
                        </TabPanel>

                        <TabPanel>
                            <VStack spacing={4} align="stretch">
                                <FormControl>
                                    <FormLabel>Language</FormLabel>
                                    <Input value="English" isReadOnly />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Timezone</FormLabel>
                                    <Input value="UTC+0" isReadOnly />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Notifications</FormLabel>
                                    <Button>Manage Notifications</Button>
                                </FormControl>
                            </VStack>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </VStack>
        </Container>
    );
}
