import { USER_ROLES, type UserRole } from '@/types/auth'

export type NavigationItem = Readonly<{
  label: string
  href: string
}>

type RoleNavigationMap = Readonly<Record<UserRole, readonly NavigationItem[]>>

export const ROLE_NAVIGATION: RoleNavigationMap = {
  [USER_ROLES.STUDENT]: [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'My Courses', href: '/student/courses' },
    { label: 'Assignments', href: '/student/assignments' },
    { label: 'Attendance', href: '/student/attendance' },
    { label: 'Results', href: '/student/results' },
  ],
  [USER_ROLES.LECTURER]: [
    { label: 'Dashboard', href: '/lecturer/dashboard' },
    { label: 'My Modules', href: '/lecturer/modules' },
    { label: 'Attendance', href: '/lecturer/attendance' },
    { label: 'Assignments', href: '/lecturer/assignments' },
    { label: 'Results', href: '/lecturer/results' },
  ],
  [USER_ROLES.INTERNAL_MODERATOR]: [
    { label: 'Dashboard', href: '/moderator/dashboard' },
    { label: 'Pending Reviews', href: '/moderator/pending-reviews' },
    { label: 'Second Marking', href: '/moderator/second-marking' },
    { label: 'Approvals', href: '/moderator/approvals' },
  ],
  [USER_ROLES.PROGRAMME_COORDINATOR]: [
    { label: 'Dashboard', href: '/coordinator/dashboard' },
    { label: 'Programmes', href: '/coordinator/programmes' },
    { label: 'Delivery Plans', href: '/coordinator/delivery-plans' },
    { label: 'Reports', href: '/coordinator/reports' },
  ],
  [USER_ROLES.ADMIN]: [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Programmes', href: '/admin/programmes' },
    { label: 'Modules', href: '/admin/modules' },
    { label: 'Timetables', href: '/admin/timetables' },
  ],
}
