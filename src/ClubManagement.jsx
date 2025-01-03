import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Grid,
    Text,
    Button,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Select,
    VStack
} from '@chakra-ui/react';
import { API_URL } from './App';

export default function ClubManagement() {
    const [resources, setResources] = useState([]);
    const [teams, setTeams] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        description: '',
        capacity: '',
        availability: ''
    });

    useEffect(() => {
        fetchClubData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchClubData = async () => {
        try {
            const [resourcesRes, teamsRes, facilitiesRes, permissionsRes, analyticsRes] =
                await Promise.all([
                    fetch(`${API_URL}/api/resources`),
                    fetch(`${API_URL}/api/teams`),
                    fetch(`${API_URL}/api/facilities`),
                    fetch(`${API_URL}/api/permissions`),
                    fetch(`${API_URL}/api/club/analytics`)
                ]);

            setResources(await resourcesRes.json());
            setTeams(await teamsRes.json());
            setFacilities(await facilitiesRes.json());
            setPermissions(await permissionsRes.json());
            setAnalytics(await analyticsRes.json());
        } catch {
            toast({
                title: 'Error fetching club data',
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
            const response = await fetch(`${API_URL}/api/resources`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast({
                    title: 'Resource added successfully',
                    status: 'success',
                    duration: 3000
                });
                onClose();
                fetchClubData();
            }
        } catch {
            toast({
                title: 'Error adding resource',
                status: 'error',
                duration: 3000
            });
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Heading mb={6}>Club Management</Heading>

            <Tabs variant="enclosed">
                <TabList>
                    <Tab>Resources</Tab>
                    <Tab>Teams</Tab>
                    <Tab>Facilities</Tab>
                    <Tab>Permissions</Tab>
                    {/* <Tab>Analytics</Tab> */}
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Box mb={4}>
                            <Button colorScheme="blue" onClick={onOpen}>
                                Add Resource
                            </Button>
                        </Box>

                        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                            {resources.map((resource) => (
                                <Box key={resource.id} p={4} borderWidth={1} borderRadius="md">
                                    <Text fontWeight="bold">{resource.name}</Text>
                                    <Text>{resource.description}</Text>
                                    <Text>Availability: {resource.availability}</Text>
                                </Box>
                            ))}
                        </Grid>
                    </TabPanel>

                    <TabPanel>
                        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                            {teams.map((team) => (
                                <Box key={team.id} p={4} borderWidth={1} borderRadius="md">
                                    <Text fontWeight="bold">{team.name}</Text>
                                    <Text>Members: {team.memberCount}</Text>
                                    <Text>Level: {team.level}</Text>
                                </Box>
                            ))}
                        </Grid>
                    </TabPanel>

                    <TabPanel>
                        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                            {facilities.map((facility) => (
                                <Box key={facility.id} p={4} borderWidth={1} borderRadius="md">
                                    <Text fontWeight="bold">{facility.name}</Text>
                                    <Text>Capacity: {facility.capacity}</Text>
                                    <Text>Status: {facility.status}</Text>
                                </Box>
                            ))}
                        </Grid>
                    </TabPanel>

                    <TabPanel>
                        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                            {permissions.map((permission) => (
                                <Box key={permission.id} p={4} borderWidth={1} borderRadius="md">
                                    <Text fontWeight="bold">{permission.role}</Text>
                                    <Text>Access Level: {permission.accessLevel}</Text>
                                    <Text>Users: {permission.userCount}</Text>
                                </Box>
                            ))}
                        </Grid>
                    </TabPanel>

                    <TabPanel>
                        {analytics && (
                            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                                <Box p={4} borderWidth={1} borderRadius="md">
                                    <Text fontWeight="bold">Total Members</Text>
                                    <Text fontSize="2xl">{analytics.totalMembers}</Text>
                                </Box>
                                <Box p={4} borderWidth={1} borderRadius="md">
                                    <Text fontWeight="bold">Active Teams</Text>
                                    <Text fontSize="2xl">{analytics.activeTeams}</Text>
                                </Box>
                                <Box p={4} borderWidth={1} borderRadius="md">
                                    <Text fontWeight="bold">Resource Utilization</Text>
                                    <Text fontSize="2xl">{analytics.resourceUtilization}%</Text>
                                </Box>
                            </Grid>
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Resource</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Name</FormLabel>
                                    <Input name="name" onChange={handleInputChange} />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Type</FormLabel>
                                    <Select name="type" onChange={handleInputChange}>
                                        <option value="equipment">Equipment</option>
                                        <option value="facility">Facility</option>
                                        <option value="staff">Staff</option>
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Description</FormLabel>
                                    <Input name="description" onChange={handleInputChange} />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Capacity</FormLabel>
                                    <Input
                                        name="capacity"
                                        type="number"
                                        onChange={handleInputChange}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Availability</FormLabel>
                                    <Input name="availability" onChange={handleInputChange} />
                                </FormControl>

                                <Button type="submit" colorScheme="blue" width="full">
                                    Add Resource
                                </Button>
                            </VStack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    );
}
