import React, {
    useState,
    useEffect
} from "react";

import {
    Box,
    Button,
    Grid,
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Flex,
    IconButton,
    Select,
} from "@chakra-ui/react";

import {
    MdChevronLeft,
    MdChevronRight,
    MdCalendarToday,
    MdClear
} from "react-icons/md";
import dayjs from "dayjs";

import { useField } from "formik";

const DatePickerField = ({ label, isRequired = true, ...props }) => {
    const [field, meta, helpers] = useField(props);
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(
        field.value ? dayjs(field.value) : dayjs()
    );
    const [selectedDate, setSelectedDate] = useState(
        field.value ? dayjs(field.value) : null
    );

    useEffect(() => {
        if (field.value) {
            setSelectedDate(dayjs(field.value));
            setCurrentDate(dayjs(field.value));
        } else {
            setSelectedDate(null);
        }
    }, [field.value]);

    const getDaysInMonth = (date) => date.daysInMonth();
    const getFirstDayOfMonth = (date) => date.startOf("month").day();

    const handleDateClick = (day) => {
        const newDate = currentDate.date(day);
        setSelectedDate(newDate);
        helpers.setValue(newDate.toISOString());
        setIsOpen(false);
    };

    const handlePrevMonth = () => {
        setCurrentDate(currentDate.subtract(1, "month"));
    };

    const handleNextMonth = () => {
        setCurrentDate(currentDate.add(1, "month"));
    };

    const handleMonthChange = (e) => {
        setCurrentDate(currentDate.month(parseInt(e.target.value, 10)));
    };

    const handleYearChange = (e) => {
        setCurrentDate(currentDate.year(parseInt(e.target.value, 10)));
    };

    const handleClear = (e) => {
      e.stopPropagation();
      helpers.setValue('');
      setSelectedDate(null);
      setIsOpen(false);
    };

    const days = [];
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    for (let i = 0; i < firstDay; i++) {
        days.push(<Box key={`empty-${i}`} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const date = currentDate.date(i);
        const isSelected = selectedDate && date.isSame(selectedDate, "day");

        days.push(
            <Box
                key={i}
                p={2}
                textAlign="center"
                cursor="pointer"
                bg={isSelected ? "blue.200" : "transparent"}
                onClick={() => handleDateClick(i)}
            >
                {i}
            </Box>
        );
    }

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const months = monthNames.map((month, index) => (
        <option key={index} value={index}>
            {month}
        </option>
    ));

    const years = Array.from({ length: 101 }, (_, i) => currentDate.year() - 50 + i).map((year) => (
        <option key={year} value={year}>
            {year}
        </option>
    ));

    return (
        <FormControl isRequired={isRequired} isInvalid={!!(meta.touched && meta.error)}>
            <FormLabel htmlFor={field.name }>{label}</FormLabel>
            <Popover
                isOpen={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() =>{
                  setIsOpen(false);
                  helpers.setTouched(true);
                }}
                placement="bottom-start"
                closeOnBlur={true}
            >
                <PopoverTrigger>
                    <Flex alignItems="center">
                        <Input
                            id={field.name}
                            {...field}
                            value={selectedDate ? selectedDate.format("YYYY-MM-DD") : ""}
                            readOnly
                            placeholder="Select a Date (YYYY-MM-DD)"
                            //{...props}
                            onClick={() => setIsOpen(true)}
                        />
                        <IconButton
                            aria-label="open calendar"
                            icon={<MdCalendarToday />}
                            ml={2}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(!isOpen);
                            }}
                        />
                        {selectedDate && (
                            <IconButton
                                aria-label="clear date"
                                icon={<MdClear />}
                                ml={2}
                                onClick={handleClear}
                                size="sm"
                            />
                        )}
                    </Flex>
                </PopoverTrigger>
                <PopoverContent width="auto">
                    <PopoverBody>
                        <Box>
                            <Flex justifyContent="space-between" alignItems="center" mb={2}>
                                <IconButton
                                    aria-label="previous month"
                                    icon={<MdChevronLeft />}
                                    onClick={handlePrevMonth}
                                    size="sm"
                                />
                                <Flex>
                                    <Select
                                        value={currentDate.month()}
                                        onChange={handleMonthChange}
                                        size="sm"
                                        // width="100px"
                                        mr={2}
                                        focusBorderColor="blue.500"
                                    >
                                        {months}
                                    </Select>

                                    <Select
                                        value={currentDate.year()}
                                        onChange={handleYearChange}
                                        size="sm"
                                        // width="80px"
                                        focusBorderColor="blue.500"
                                    >
                                        {years}
                                    </Select>
                                </Flex>
                                <IconButton
                                    aria-label="next month"
                                    icon={<MdChevronRight />}
                                    onClick={handleNextMonth}
                                    size="sm"
                                />
                            </Flex>
                            <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={2} w="250px">
                                <Text textAlign="center" fontSize="sm" color="gray.500">Mon</Text>
                                <Text textAlign="center" fontSize="sm" color="gray.500">Sun</Text>
                                <Text textAlign="center" fontSize="sm" color="gray.500">Tue</Text>
                                <Text textAlign="center" fontSize="sm" color="gray.500">Wed</Text>
                                <Text textAlign="center" fontSize="sm" color="gray.500">Thu</Text>
                                <Text textAlign="center" fontSize="sm" color="gray.500">Fri</Text>
                                <Text textAlign="center" fontSize="sm" color="gray.500">Sat</Text>
                            </Grid>
                            <Grid templateColumns="repeat(7, 1fr)" gap={1} w="250px">
                                {days}
                            </Grid>
                        </Box>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
            <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
        </FormControl>
    );
};

export default DatePickerField;