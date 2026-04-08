/**
 * Skeleton 컴포넌트 통합 export
 * 모든 Skeleton UI 컴포넌트를 한 곳에서 import할 수 있습니다.
 */

// 아바타 스켈레톤
export {
  AvatarSkeletonLarge,
  AvatarSkeletonMedium,
  AvatarSkeletonSmall,
  ProfileHeaderSkeleton,
  UserCardGridSkeleton,
  UserCardSkeleton,
  UserListItemSkeleton,
  UserListSkeleton,
} from "./avatar-skeleton";

// 기존 스켈레톤
export {
  EventCardCompactSkeleton,
  EventCardSkeleton,
  EventListSkeleton,
} from "./event-skeleton";

// 폼 스켈레톤
export {
  EventFormSkeleton,
  FormFieldListSkeleton,
  FormFieldSkeleton,
  ProfileFormSkeleton,
  SelectFieldSkeleton,
  TextAreaFieldSkeleton,
} from "./form-skeleton";

// 참여자 스켈레톤
export {
  ParticipantCardCompactSkeleton,
  ParticipantCardSkeleton,
  ParticipantListSkeleton as ParticipantListSkeletonFromParticipant,
} from "./participant-skeleton";

// 테이블 스켈레톤
export {
  ParticipantListSkeleton,
  SimpleTableSkeleton,
  TableRowSkeleton,
  TableSkeleton,
} from "./table-skeleton";
