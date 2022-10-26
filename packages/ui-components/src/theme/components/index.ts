import { ComponentStyleConfig } from '@chakra-ui/react';
import Box from './box';
import Button from './button';
import Checkbox from './checkbox';
import Drawer from './drawer';
import Flex from './flex';
import Form from './form';
import Heading from './heading';
import Link from './link';
import RadioImage from './radioImage';
import Select from './select';
import Stack from './stack';
import Switch from './switch';
import Tabs from './tabs';
import Text from './text/text';
import Tag from './tag';
import PinInputField from './pinInputField';

const components: { [key: string]: ComponentStyleConfig } = {
  Box,
  Stack,
  Button,
  Checkbox,
  Link,
  Form,
  Heading,
  Switch,
  Tabs,
  Flex,
  Text,
  Drawer,
  PinInputField,
  Select,
  Tag,
  RadioImage,
};

export default components;
