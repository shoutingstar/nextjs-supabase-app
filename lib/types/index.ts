/**
 * 타입 중앙 재내보내기
 * 모든 타입을 한 곳에서 import 할 수 있도록 통합
 * @example
 * ```typescript
 * import { Event, User, LoadingState, EventCardProps } from '@/lib/types';
 * ```
 */

/* 기본 도메인 타입 */
export type {
  ActionResult,
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
} from "./api";
export type {
  CreateEventInput,
  Event,
  EventDetail,
  EventStatus,
  UpdateEventInput,
} from "./event";
export type {
  JoinEventInput,
  Participant,
  ParticipantDetail,
  ParticipantStatus,
  RsvpStatus,
  UpdateRsvpInput,
} from "./participant";
export type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserProfile,
  UserRole,
} from "./user";

/* 컴포넌트 Props 타입 */
export type {
  BadgeProps,
  ButtonProps,
  CardProps,
  CheckboxProps,
  ConfirmDialogProps,
  ContentWrapperProps,
  DropdownMenuProps,
  EmptyStateProps,
  ErrorMessageProps,
  EventCardProps,
  EventDetailProps,
  EventFilterProps,
  FormProps,
  GoogleOAuthButtonProps,
  HeaderProps,
  InputProps,
  LabelProps,
  LayoutProps,
  LoadingIndicatorProps,
  LoginFormProps,
  MobileNavProps,
  ModalProps,
  NavbarProps,
  NavigationProps,
  PaginationProps,
  ParticipantCardProps,
  ParticipantListProps,
  SidebarProps,
  SignUpFormProps,
  SkeletonProps,
  ToastProps,
  UserProfileCardProps,
} from "./component";

/* 폼 타입 */
export type {
  ChangePasswordFormData,
  CreateEventFormData,
  FieldError,
  FormDefinition,
  FormFieldDefinition,
  FormState,
  FormSubmitResult,
  JoinEventFormData,
  LoginFormData,
  SignUpFormData,
  UpdateEventFormData,
  UpdateRsvpFormData,
  UpdateUserProfileFormData,
} from "./form";

/* Context 타입 */
export type {
  AppContextActions,
  AppContextState,
  AppContextType,
  AppProviderProps,
  AuthActions,
  AuthContextType,
  AuthProviderProps,
  AuthState,
  EventActions,
  EventContextState,
  EventContextType,
  EventProviderProps,
  FilterActions,
  FilterContextState,
  FilterContextType,
  NotificationState,
  ParticipantActions,
  ParticipantContextState,
  ParticipantContextType,
  UIActions,
  UIContextState,
  UIContextType,
  UIProviderProps,
} from "./context";
export {
  authStateInitial,
  eventStateInitial,
  filterStateInitial,
  uiStateInitial,
} from "./context";

/* UI 상태 타입 */
export type {
  AccessControlState,
  AccordionItemState,
  AnimationState,
  BreadcrumbItem,
  DataTableState,
  FetchState,
  FileUploadState,
  FocusState,
  FormFieldError,
  FormValidationErrors,
  InfiniteScrollState,
  InputState,
  ListItem,
  LoadingState,
  ModalOptions,
  ModalState,
  MultiFileUploadState,
  NotificationOptions,
  OnlineState,
  OptionItem,
  PaginationState,
  PermissionState,
  PopoverPositionState,
  RowSelectionState,
  SelectState,
  SortState,
  TableFilterState,
  TabState,
  ToastOptions,
  ToastState,
  ToggleState,
  TransitionState,
  NotificationState as UINotificationState,
  ViewportState,
} from "./ui";

/* 라우트 타입 */
export type {
  AccountPageParams,
  AdminDashboardPageParams,
  AdminLayoutParams,
  AdminSectionPageParams,
  AuthPageParams,
  CatchAllParams,
  DashboardPageParams,
  EventCarpoolNewPageParams,
  EventCarpoolPageParams,
  EventCreatePageParams,
  EventDetailPageParams,
  EventEditPageParams,
  EventListQueryParams,
  EventsListPageParams,
  HomePageParams,
  ListQueryParams,
  ModalQueryParams,
  OptionalCatchAllParams,
  ParticipantsPageParams,
  ProtectedLayoutParams,
  RootLayoutParams,
  SearchParams,
  UserListQueryParams,
  UserProfilePageParams,
} from "./routes";
export { buildQueryString, parseQueryString, ROUTES } from "./routes";

/* 스토리지 타입 */
export type {
  BulkActionMode,
  GetLocalStorageFunction,
  GetSessionStorageFunction,
  LocalStorageState,
  ModalInStack,
  NavigationHistory,
  RecentEvent,
  RecentSearch,
  RemoveLocalStorageFunction,
  RemoveSessionStorageFunction,
  SavedFilter,
  ScrollPosition,
  SessionFilters,
  SessionStorageState,
  SetLocalStorageFunction,
  SetSessionStorageFunction,
  StorageItem,
  StorageItemMetadata,
  StorageItemOptions,
  StorageMigration,
  StorageMigrationPlan,
  TempFormData,
  ThemePreference,
  UserPreferences,
} from "./storage";
export { LocalStorageKey, SessionStorageKey } from "./storage";

/* Supabase 데이터베이스 타입 */
export type { Database } from "./database.types";
