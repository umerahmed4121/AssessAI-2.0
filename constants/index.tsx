export const colors = {
    primary: '#0f0317',
    primaryLight: '#271c2e',
    primaryTransparent: '#271c2ed5',
    secondaryLight: '#db7961',
    secondary: '#d25839',
    secondaryDark: '#a8462e',
    secondaryDark2: '#7e3522',
    secondaryDark3: '#542317',
    secondaryDark4: '#2a120b',
    secondaryDark5: '#692c1d',
};


import { 
    MdDashboard,
    MdAssessment,
    MdAssignment,
    MdLibraryBooks,
    MdPerson,
    MdPeople,
    MdSettings,
    MdHelp,
    MdLogout,

 } from "react-icons/md";

// export the types of the nav links

export interface NavLinks {
    label: string;
    icon?: JSX.Element;
    link: string;
}

export const teacherDashboardNavLinks = [
    { label: 'Dashboard', icon: <MdDashboard/>, link: '/dashboard/teacher' },
    { label: 'Quizzes',icon: <MdAssessment/>, link: '/dashboard/teacher/quizzes' },
    { label: 'Assignments',icon:<MdAssignment />, link: '/dashboard/teacher/assignments' },
    { label: 'Gradebook',icon:<MdLibraryBooks />, link: '/dashboard/teacher/gradebook' },
    { label: 'AI Quizzes',icon:<MdPerson />, link: '/dashboard/teacher/ai-quizzes' },
    { label: 'Groups',icon:<MdPeople />, link: '/dashboard/teacher/groups' },
    { label: 'Settings',icon:<MdSettings />, link: '/dashboard/teacher/settings' },
    { label: 'Help & Support',icon:<MdHelp />, link: '/dashboard/teacher/help-support' },
    ];  

export const studentDashboardNavLinks = [
    { label: 'Dashboard', icon: <MdDashboard/>, link: '/dashboard/student' },
    { label: 'Quizzes',icon: <MdAssessment/>, link: '/dashboard/student/quizzes' },
    { label: 'Assignments',icon:<MdAssignment />, link: '/dashboard/student/assignments' },
    { label: 'Gradebook',icon:<MdLibraryBooks />, link: '/dashboard/student/gradebook' },
    { label: 'Groups',icon:<MdPeople />, link: '/dashboard/student/groups' },
    { label: 'Settings',icon:<MdSettings />, link: '/dashboard/student/settings' },
    { label: 'Help & Support',icon:<MdHelp />, link: '/dashboard/student/help-support' },
    ];                                                                                                  