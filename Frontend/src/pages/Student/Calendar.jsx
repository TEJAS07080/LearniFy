import React, { useState, useEffect } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Badge,
  useColorModeValue,
  Container,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { host } from "../../APIRoutes";
import "./calendarStyles.css";

// Extend the theme for custom styles
const theme = extendTheme({
  colors: {
    brand: {
      50: "#e3f2fd",
      100: "#bbdefb",
      500: "#2196f3",
      600: "#1e88e5",
    },
  },
  styles: {
    global: {
      ".react-calendar": {
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        padding: "20px",
      },
      ".react-calendar__tile--active": {
        backgroundColor: "#2196f3 !important",
        color: "white",
        borderRadius: "8px",
      },
      ".react-calendar__navigation button": {
        color: "#2196f3",
      },
    },
  },
});

export default function AssignmentCalendar() {
  const [deadlines, setDeadlines] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const user = JSON.parse(localStorage.getItem("user"));

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const response = await axios.get(
          `${host}/student/assignment/${user._id}`
        );
        if (response.data.success) {
          setDeadlines(response.data.deadlines);
          console.log(response.data);
        } else {
          setError("Failed to fetch deadlines.");
        }
      } catch (err) {
        console.error("Error fetching deadlines:", err);
        setError("Error fetching deadlines. Please try again later.");
      }
    };

    fetchDeadlines();
  }, [user._id]);

  // Function to format dates for comparison
  const formatDate = (dateString) => {
    return new Date(dateString).toDateString();
  };

  // Calendar tile styling for deadlines
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const deadline = deadlines.find(
        (d) => formatDate(d.deadline) === date.toDateString()
      );

      if (deadline) {
        return deadline.submitted ? "submitted" : "unsubmitted";
      }
    }
    return null;
  };

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.md" py={8}>
        <Heading as="h1" size="xl" textAlign="center" color="brand.600" mb={6}>
          Assignment Calendar
        </Heading>
        <Box
          bg={bgColor}
          borderRadius="lg"
          borderWidth={1}
          borderColor={borderColor}
          p={6}
          boxShadow="lg"
        >
          <Flex direction={{ base: "column", md: "row" }} gap={6} align="start">
            <Box flex="1">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName}
              />
            </Box>
            <Box flex="1">
              <Heading as="h3" size="md" mb={4} color="brand.600">
                Upcoming Deadlines
              </Heading>
              <VStack align="stretch" spacing={3} maxH="300px" overflowY="auto">
                {deadlines.length > 0 ? (
                  deadlines.map((deadline) => (
                    <Flex
                      key={deadline._id}
                      align="center"
                      justify="space-between"
                      flexDirection="column"
                    >
                      <Text color={textColor} fontWeight="bold">
                        {deadline.title}
                      </Text>
                      <Badge colorScheme={deadline.submitted ? "green" : "red"}>
                        Due: {new Date(deadline.deadline).toLocaleDateString()}
                      </Badge>
                    </Flex>
                  ))
                ) : (
                  <Text color="gray.500">No upcoming deadlines.</Text>
                )}
              </VStack>
            </Box>
          </Flex>
        </Box>
        {error && (
          <Alert status="error" mt={6}>
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </Container>
    </ChakraProvider>
  );
}
