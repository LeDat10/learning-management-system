import LayoutDefaultAdmin from "../Layout/admin/LayoutDefault";
import LayoutDefault from "../Layout/client/LayoutDefault";
import Course from "../pages/admin/Course";
import CreateCourse from "../pages/admin/Course/CreateCourse";
import EditCourse from "../pages/admin/Course/EditCourse";
import TrashCourse from "../pages/admin/Course/TrashCourse";
import Section from "../pages/admin/Section";
import CreateSection from "../pages/admin/Section/CreateSection";
import EditSection from "../pages/admin/Section/EditSection";
import Home from "../pages/client/Home";
import TrashSection from "../pages/admin/Section/TrashSection";
import Lesson from "../pages/admin/Lesson";
import CreateLesson from "../pages/admin/Lesson/CreateLesson";
import EditLesson from "../pages/admin/Lesson/EditLesson";
import TrashLesson from "../pages/admin/Lesson/TrashLesson";
import Category from "../pages/admin/Category";
import CreateCategory from "../pages/admin/Category/CreateCategory";
import EditCategory from "../pages/admin/Category/EditCategory";
import TrashCategory from "../pages/admin/Category/TrashCategory";
import Role from "../pages/admin/Role";
import CreateRole from "../pages/admin/Role/CreateRole";
import EditRole from "../pages/admin/Role/EditRole";
import TrashRole from "../pages/admin/Role/TrashRole";
import Account from "../pages/admin/Account";
import CreateAccount from "../pages/admin/Account/CreateAccount";
import EditAccount from "../pages/admin/Account/EditAccount";
import TrashAccount from "../pages/admin/Account/TrashAccount";
import Dashboard from "../pages/admin/Dashboard";
import Login from "../pages/admin/Login";
import CourseClient from "../pages/client/Course";
import DetailCourseClient from "../pages/client/Course/DetailCourseClient";
import LoginClient from "../pages/client/LoginClient";
import RegisterClient from "../pages/client/RegisterClient";
import OTP from "../pages/client/OTP";
import PrivateRouteAdmin from "../middlewares/admin/PrivateRouteAdmin";
import PrivateRouteClient from "../middlewares/client/PrivateRouteAClient";
import PlayCourse from "../pages/client/Course/PlayCourse";
import Content from "../pages/client/Course/Content";

export const routes = [
    {
        path: "/",
        element: <PrivateRouteClient />,
        children: [
            {
                path: "/",
                element: <LayoutDefault />,
                children: [
                    {
                        index: true,
                        element: <Home />
                    },
                    {
                        path: "courses",
                        children: [
                            {
                                index: true,
                                element: <CourseClient />
                            },
                            {
                                path: "detail/:slugCourse",
                                element: <DetailCourseClient />,
                            },
                            {
                                path: ":slugCourse/play-course/:courseId",
                                element: <PlayCourse />,
                                children: [
                                    {
                                        path: ":sectionId/:lessonId",
                                        element: <Content />
                                    }
                                ]
                            }
                        ]
                    },

                ]
            },
        ]
    },
    {
        path: "users",
        children: [
            {
                path: "login",
                element: <LoginClient />
            },
            {
                path: "register",
                element: <RegisterClient />
            },
            {
                path: "confirm",
                children: [
                    {
                        path: "otp/:email",
                        element: <OTP />
                    }

                ]
            }
        ]
    },
    {
        path: "admin/login",
        element: <Login />
    },
    {
        path: "admin",
        element: <PrivateRouteAdmin />,
        children: [
            {
                path: '',
                element: <LayoutDefaultAdmin />,
                children: [
                    {
                        path: "dashboard",
                        element: <Dashboard />
                    },
                    {
                        path: 'courses',
                        children: [
                            {
                                index: true,
                                element: <Course />
                            },
                            {
                                path: 'create',
                                element: <CreateCourse />
                            },
                            {
                                path: 'edit/:courseId',
                                element: <EditCourse />
                            },
                            {
                                path: 'trash',
                                element: <TrashCourse />
                            }
                        ]
                    },
                    {
                        path: ':courseId/sections',
                        children: [
                            {
                                index: true,
                                element: <Section />
                            },
                            {
                                path: 'create',
                                element: <CreateSection />
                            },
                            {
                                path: 'edit/:sectionId',
                                element: <EditSection />
                            },
                            {
                                path: 'trash',
                                element: <TrashSection />
                            }
                        ]
                    },
                    {
                        path: ':courseId/:sectionId/lessons',
                        children: [
                            {
                                index: true,
                                element: <Lesson />
                            },
                            {
                                path: 'create',
                                element: <CreateLesson />
                            },
                            {
                                path: 'edit/:lessonId',
                                element: <EditLesson />
                            },
                            {
                                path: 'trash',
                                element: <TrashLesson />
                            }
                        ]
                    },
                    {
                        path: 'category',
                        children: [
                            {
                                index: true,
                                element: <Category />,
                            },
                            {
                                path: 'create',
                                element: <CreateCategory />
                            },
                            {
                                path: 'edit/:categoryId',
                                element: <EditCategory />
                            },
                            {
                                path: 'trash',
                                element: <TrashCategory />
                            }
                        ]
                    },
                    {
                        path: "roles",
                        children: [
                            {
                                index: true,
                                element: <Role />
                            },
                            {
                                path: 'create',
                                element: <CreateRole />
                            },
                            {
                                path: 'edit/:roleId',
                                element: <EditRole />
                            },
                            {
                                path: 'trash',
                                element: <TrashRole />
                            }
                        ]
                    },
                    {
                        path: "accounts",
                        children: [
                            {
                                index: true,
                                element: <Account />
                            },
                            {
                                path: 'create',
                                element: <CreateAccount />
                            },
                            {
                                path: 'edit/:accountId',
                                element: <EditAccount />
                            },
                            {
                                path: "trash",
                                element: <TrashAccount />
                            }
                        ]
                    }
                ]
            }
        ]
    }
]