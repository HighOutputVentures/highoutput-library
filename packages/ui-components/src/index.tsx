import ArrayField, {
  ArrayFieldProps,
} from './components/ArrayField/ArrayField';
import {
  AuthConfig,
  AuthContext,
  AuthProvider,
  AuthService,
  AuthState,
  constants,
  getAuthState,
  logout,
  useAuthService,
  useAuthState,
  useProfile,
} from './components/AuthProvider';
import FormContainer, {
  FormContainerProps,
} from './components/FormContainer/FormContainer';
import InputField, {
  InputFieldProps,
} from './components/InputField/InputField';
import LogoSpinner from './components/LogoSpinner/LogoSpinner';
import Pagination, {
  PaginationProps,
} from './components/Pagination/Pagination';
import PasswordInputField, {
  PasswordInputFieldProps,
} from './components/PasswordInputField/PasswordInputField';
import PinInputField, {
  PinInputFieldProps,
} from './components/PinInputField/PinInputField';
import RadioImage, {
  RadioImageProps,
} from './components/RadioImage/RadioImage';
import RadioImageGroup, {
  RadioImageGroupProps,
} from './components/RadioImageGroup/RadioImageGroup';
import SelectField, {
  SelectFieldProps,
} from './components/SelectField/SelectField';
import TextareaAutosize, {
  TextareaAutosizeProps,
} from './components/TextareaAutosize/TextareaAutosize';
import TextAreaField, {
  TextAreaFieldProps,
} from './components/TextareaField/TextareaField';
import ThemeProvider, { ThemeProviderProps } from './components/ThemeProvider';
import CredentialLoginForm, {
  CredentialLoginFormDefaultProps,
  CredentialLoginFormEmailProps,
  CredentialLoginFormNameProps,
  CredentialLoginFormProps,
} from './layouts/Auth/CredentialLoginForm';
import OTPForm, { OTPFormProps } from './layouts/Auth/OTPForm';
import OTPVerificationForm, {
  OTPVerificationProps,
} from './layouts/Auth/OTPVerificationForm';
import ContactCard, { ContactCardProps } from './layouts/Contact/ContactCard';
import ContactForm, { ContactFormProps } from './layouts/Contact/ContactForm';
import ContactPage, { ContagePageProps } from './layouts/Contact/ContactPage';
import useSupport from './layouts/Contact/useSupport';
import {
  ContactFormInputProps,
  withContactFormSchema,
  withContactFormSchemaValues,
} from './layouts/Contact/validation';
import AutoForm, { AutoFormProps } from './layouts/Forms/AutoForm';
import theme from './theme';
import { extendTheme } from './utils/theme.utils';

export {
  Accordion,
  AccordionButton,
  AccordionButtonProps,
  AccordionIcon,
  AccordionItem,
  AccordionItemProps,
  AccordionPanel,
  AccordionPanelProps,
  AccordionProps,
  /**
   * @reference https://chakra-ui.com/docs/components/feedback/alert
   */
  Alert,
  AlertDescription,
  AlertDescriptionProps,
  /**
   * @reference https://chakra-ui.com/docs/components/overlay/alert-dialog
   */
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
  AlertIcon,
  AlertIconProps,
  AlertProps,
  AlertTitle,
  AlertTitleProps,
  /**
   * @reference https://chakra-ui.com/docs/components/layout/aspect-ratio
   */
  AspectRatio,
  AspectRatioProps,
  /**
   * @reference https://chakra-ui.com/docs/components/media-and-icons/avatar
   */
  Avatar,
  AvatarBadge,
  AvatarBadgeProps,
  AvatarGroup,
  AvatarGroupProps,
  AvatarProps,
  /**
   * @reference  https://chakra-ui.com/docs/components/data-display/badge
   */
  Badge,
  BadgeProps,
  /**
   * @reference https://chakra-ui.com/docs/components/layout/box
   */
  Box,
  BoxProps,
  /**
   * @reference https://chakra-ui.com/docs/components/navigation/breadcrumb
   */
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbItemProps,
  BreadcrumbLink,
  BreadcrumbLinkProps,
  BreadcrumbProps,
  BreadcrumbSeparator,
  BreadcrumbSeparatorProps,
  Button,
  ButtonGroup,
  ButtonGroupProps,
  ButtonOptions,
  ButtonProps,
  ButtonSpinner,
  /**
   * @reference https://chakra-ui.com/docs/components/layout/center
   */
  Center,
  CenterProps,
  chakra,
  /**
   * @reference https://chakra-ui.com/docs/components/form/checkbox
   */
  Checkbox,
  CheckboxGroup,
  CheckboxGroupContext,
  CheckboxGroupProps,
  CheckboxProps,
  CheckboxState,
  Circle,
  /**
   * @reference https://chakra-ui.com/docs/components/feedback/circular-progress
   */
  CircularProgress,
  CircularProgressLabel,
  CircularProgressLabelProps,
  CircularProgressProps,
  CloseButton,
  CloseButtonProps,
  /**
   * @reference https://chakra-ui.com/docs/components/transitions/usage#collapse-transition
   */
  Collapse,
  CollapseProps,
  ComponentStyleConfig,
  /**
   * @reference https://chakra-ui.com/docs/components/layout/container
   */
  Container,
  ContainerProps,
  createStandaloneToast,
  CreateStandAloneToastParam,
  Divider,
  /**
   * @reference https://chakra-ui.com/docs/components/overlay/drawer
   */
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentProps,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  /**
   * @refernce https://chakra-ui.com/docs/components/transitions/usage#fade-transition
   */
  Fade,
  FadeProps,
  /**
   * @reference https://chakra-ui.com/docs/components/layout/flex
   */
  Flex,
  FlexProps,
  /**
   * @reference https://chakra-ui.com/docs/components/form/form-control
   */
  FormControl,
  FormControlProps,
  FormErrorIcon,
  FormErrorMessage,
  FormErrorMessageProps,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  forwardRef,
  GlobalStyle,
  /**
   * @reference https://chakra-ui.com/docs/components/layout/grid
   */
  Grid,
  GridItem,
  GridItemProps,
  GridProps,
  /**
   * @reference https://chakra-ui.com/docs/components/typography/text
   */
  Heading,
  HeadingProps,
  HelpTextProps,
  /**
   * @refernce https://chakra-ui.com/docs/components/show-hide/usage
   */
  Hide,
  HideProps,
  HStack,
  /**
   * @reference https://chakra-ui.com/docs/components/media-and-icons/icon
   */
  Icon,
  /**
   * @reference https://chakra-ui.com/docs/components/form/icon-button
   */
  IconButton,
  IconButtonProps,
  IconProps,
  /**
   * @reference https://chakra-ui.com/docs/components/media-and-icons/image
   */
  Image,
  ImageProps,
  Img,
  ImgProps,
  /**
   * @reference https://chakra-ui.com/docs/components/form/input
   */
  Input,
  InputAddon,
  InputAddonProps,
  InputElementProps,
  InputGroup,
  InputGroupProps,
  InputLeftAddon,
  InputLeftElement,
  InputProps,
  InputRightAddon,
  InputRightElement,
  keyframes,
  /**
   * @reference https://chakra-ui.com/docs/styled-system/recipes/page-specific-color-mode
   */
  LightMode,
  /**
   * @reference https://chakra-ui.com/docs/components/navigation/link
   */
  Link,
  LinkBox,
  LinkBoxProps,
  /**
   * @reference https://chakra-ui.com/docs/components/navigation/link-overlay
   */
  LinkOverlay,
  LinkOverlayProps,
  LinkProps,
  /**
   * @reference  https://chakra-ui.com/docs/components/data-display/list
   */
  List,
  ListItem,
  ListItemProps,
  ListProps,
  /**
   * @reference https://chakra-ui.com/docs/components/overlay/menu
   */
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuDivider,
  MenuDividerProps,
  MenuGroup,
  MenuGroupProps,
  MenuItem,
  MenuItemOption,
  MenuItemOptionProps,
  MenuItemProps,
  MenuList,
  MenuListProps,
  MenuOptionGroup,
  MenuOptionGroupProps,
  /**
   * @reference https://chakra-ui.com/docs/components/overlay/modal
   */
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalCloseButton,
  ModalContent,
  ModalContentProps,
  ModalContextProvider,
  ModalFocusScope,
  ModalFooter,
  ModalFooterProps,
  ModalHeader,
  ModalHeaderProps,
  ModalOverlay,
  ModalOverlayProps,
  ModalProps,
  NumberDecrementStepper,
  NumberDecrementStepperProps,
  NumberIncrementStepper,
  NumberIncrementStepperProps,
  /**
   * @reference https://chakra-ui.com/docs/components/form/number-input
   */
  NumberInput,
  NumberInputField,
  NumberInputFieldProps,
  NumberInputProps,
  NumberInputStepper,
  NumberInputStepperProps,
  OrderedList,
  /**
   * @reference https://chakra-ui.com/docs/components/form/pin-input
   */
  PinInput,
  PinInputField as Pin,
  PinInputFieldProps as PinProps,
  PinInputProps,
  /**
   * @reference https://chakra-ui.com/docs/components/overlay/popover
   */
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverArrowProps,
  PopoverBody,
  PopoverBodyProps,
  PopoverCloseButton,
  PopoverCloseButtonProps,
  PopoverContent,
  PopoverContentProps,
  PopoverFooter,
  PopoverFooterProps,
  PopoverHeader,
  PopoverHeaderProps,
  PopoverProps,
  PopoverTrigger,
  /**
   * @reference https://chakra-ui.com/docs/components/other/portal
   */
  Portal,
  PortalProps,
  /**
   * @reference https://chakra-ui.com/docs/components/feedback/progress
   */
  Progress,
  ProgressLabel,
  ProgressLabelProps,
  ProgressProps,
  /**
   * @reference https://chakra-ui.com/docs/components/form/pin-input
   */
  Radio,
  RadioGroup,
  RadioGroupProps,
  RadioProps,
  /**
   * @refernce https://chakra-ui.com/docs/components/transitions/usage#scalefade-transition
   */
  ScaleFade,
  ScaleFadeProps,
  /**
   * @reference  https://chakra-ui.com/docs/components/form/select
   */
  Select,
  SelectProps,
  shouldShowFallbackImage,
  /**
   * @refernce https://chakra-ui.com/docs/components/show-hide/usage
   */
  Show,
  ShowProps,
  /**
   * @reference https://chakra-ui.com/docs/components/layout/simple-grid
   */
  SimpleGrid,
  SimpleGridProps,
  /**
   * @reference https://chakra-ui.com/docs/components/feedback/skeleton
   */
  Skeleton,
  SkeletonCircle,
  SkeletonProps,
  SkeletonText,
  SkeletonTextProps,
  /**
   * @reference https://chakra-ui.com/docs/components/transitions/usage#slide-transition
   */
  Slide,
  SlideFade,
  SlideFadeProps,
  SlideProps,
  Slider,
  SliderFilledTrack,
  SliderInnerTrackProps,
  SliderMark,
  SliderMarkProps,
  SliderProps,
  SliderThumb,
  SliderThumbProps,
  SliderTrack,
  SliderTrackProps,
  Spacer,
  SpacerProps,
  /**
   * @reference https://chakra-ui.com/docs/components/spinner
   */
  Spinner,
  SpinnerProps,
  Square,
  SquareProps,
  /**
   * @reference https://chakra-ui.com/docs/components/layout/stack
   */
  Stack,
  StackProps,
  /**
   * @reference https://chakra-ui.com/docs/components/stat
   */
  Stat,
  StatArrow,
  StatArrowProps,
  StatGroup,
  StatGroupProps,
  StatHelpText,
  StatHelpTextProps,
  StatLabel,
  StatLabelProps,
  StatNumber,
  StatNumberProps,
  StatProps,
  /**
   * @reference  https://chakra-ui.com/docs/components/form/switch
   */
  Switch,
  SwitchProps,
  Tab,
  /**
   * @reference  https://chakra-ui.com/docs/components/data-display/table
   */
  Table,
  TableBodyProps,
  TableCaption,
  TableCaptionProps,
  TableCellProps,
  TableColumnHeaderProps,
  TableContainer,
  TableContainerProps,
  TableFooterProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
  TabList,
  TabListProps,
  TabPanel,
  TabPanelProps,
  TabPanels,
  TabPanelsProps,
  TabProps,
  /**
   * @reference https://chakra-ui.com/docs/components/disclosure/tabs
   */
  Tabs,
  TabsProps,
  /**
   * @reference https://chakra-ui.com/docs/components/data-display/tag
   */
  Tag,
  TagCloseButton,
  TagCloseButtonProps,
  TagLabel,
  TagLabelProps,
  TagLeftIcon,
  TagProps,
  TagRightIcon,
  Tbody,
  Td,
  /**
   * @reference https://chakra-ui.com/docs/components/typography/text
   */
  Text,
  /**
   * @reference  https://chakra-ui.com/docs/components/form/switch
   */
  Textarea,
  TextareaProps,
  TextProps,
  Tfoot,
  Th,
  Thead,
  ToastId,
  /**
   * @reference https://chakra-ui.com/docs/components/overlay/popover
   */
  Tooltip,
  TooltipProps,
  Tr,
  UnorderedList,
  /**
   * @reference https://chakra-ui.com/docs/styled-system/utility-hooks/use-boolean?scroll=true
   */
  useBoolean,
  /**
   * @reference https://chakra-ui.com/docs/styled-system/utility-hooks/use-breakpoint-value
   */
  useBreakpoint,
  useBreakpointValue,
  useButtonGroup,
  useCheckbox,
  useCheckboxGroup,
  /**
   * @reference https://chakra-ui.com/docs/styled-system/utility-hooks/use-clipboard
   */
  useClipboard,
  useColorModeValue,
  /**
   * @reference https://chakra-ui.com/docs/styled-system/utility-hooks/use-const
   */
  useConst,
  /**
   * @refernce https://chakra-ui.com/docs/styled-system/utility-hooks/use-disclosure
   */
  useDisclosure,
  UseDisclosureProps,
  UseDisclosureReturn,
  useImage,
  UseImageProps,
  UseImageReturn,
  useInputGroupStyles,
  /**
   * @reference https://chakra-ui.com/docs/styled-system/utility-hooks/use-media-query
   */
  useMediaQuery,
  useMenuButton,
  UseMenuButtonProps,
  useModal,
  useMultiStyleConfig,
  /**
   * @reference https://chakra-ui.com/docs/styled-system/utility-hooks/use-outside-click
   */
  useOutsideClick,
  usePrefersReducedMotion,
  useRadio,
  useRadioGroup,
  useSlider,
  /**
   * @reference https://chakra-ui.com/docs/styled-system/utility-hooks/use-theme
   */
  useTheme,
  /**
   * @reference https://chakra-ui.com/docs/components/toast/usage
   */
  useToast,
  UseToastOptions,
  VStack,
  /**
   * @reference https://chakra-ui.com/docs/components/layout/wrap
   */
  Wrap,
  WrapItem,
  WrapItemProps,
  WrapProps,
} from '@chakra-ui/react';
export { isValidMotionProp, motion } from 'framer-motion';
export { default as For, ForProps } from './components/For/For';
export { default as Mount, MountProps } from './components/Mount/Mount';
export {
  ThemeProvider,
  ThemeProviderProps,
  RadioImageGroup,
  RadioImageGroupProps,
  RadioImage,
  RadioImageProps,
  TextareaAutosize,
  TextareaAutosizeProps,
  ContactForm,
  ContactFormProps,
  ContactCard,
  ContactCardProps,
  ContactPage,
  ContagePageProps,
  CredentialLoginForm,
  CredentialLoginFormProps,
  CredentialLoginFormEmailProps,
  CredentialLoginFormNameProps,
  CredentialLoginFormDefaultProps,
  ContactFormInputProps,
  withContactFormSchemaValues,
  withContactFormSchema,
  OTPVerificationForm,
  OTPVerificationProps,
  OTPForm,
  OTPFormProps,
  PinInputField,
  PinInputFieldProps,
  InputField,
  InputFieldProps,
  SelectField,
  SelectFieldProps,
  PasswordInputField,
  PasswordInputFieldProps,
  TextAreaField,
  TextAreaFieldProps,
  FormContainer,
  FormContainerProps,
  AutoForm,
  AutoFormProps,
  // default theme
  theme,
  extendTheme,
  // hooks
  useSupport,
  Pagination,
  PaginationProps,
  // auth provider
  AuthConfig,
  AuthContext,
  AuthProvider,
  AuthService,
  AuthState,
  constants,
  useProfile,
  getAuthState,
  useAuthService,
  logout,
  useAuthState,
  LogoSpinner,
  ArrayField,
  ArrayFieldProps,
};
