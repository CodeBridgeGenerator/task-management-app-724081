import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';

import SingleProjectsPage from "../components/app_components/ProjectsPage/SingleProjectsPage";
import ProjectProjectLayoutPage from "../components/app_components/ProjectsPage/ProjectProjectLayoutPage";
import SingleTasksPage from "../components/app_components/TasksPage/SingleTasksPage";
import TaskProjectLayoutPage from "../components/app_components/TasksPage/TaskProjectLayoutPage";
import SingleTaskCommentsPage from "../components/app_components/TaskCommentsPage/SingleTaskCommentsPage";
import TaskCommentProjectLayoutPage from "../components/app_components/TaskCommentsPage/TaskCommentProjectLayoutPage";
import SingleTaskRemindersPage from "../components/app_components/TaskRemindersPage/SingleTaskRemindersPage";
import TaskReminderProjectLayoutPage from "../components/app_components/TaskRemindersPage/TaskReminderProjectLayoutPage";
//  ~cb-add-import~

const AppRouter = () => {
    return (
        <Routes>
            {/* ~cb-add-unprotected-route~ */}
<Route path="/projects/:singleProjectsId" exact element={<SingleProjectsPage />} />
<Route path="/projects" exact element={<ProjectProjectLayoutPage />} />
<Route path="/tasks/:singleTasksId" exact element={<SingleTasksPage />} />
<Route path="/tasks" exact element={<TaskProjectLayoutPage />} />
<Route path="/taskComments/:singleTaskCommentsId" exact element={<SingleTaskCommentsPage />} />
<Route path="/taskComments" exact element={<TaskCommentProjectLayoutPage />} />
<Route path="/taskReminders/:singleTaskRemindersId" exact element={<SingleTaskRemindersPage />} />
<Route path="/taskReminders" exact element={<TaskReminderProjectLayoutPage />} />
            <Route element={<ProtectedRoute redirectPath={'/login'} />}>{/* ~cb-add-protected-route~ */}</Route>
        </Routes>
    );
};

const mapState = (state) => {
    const { isLoggedIn } = state.auth;
    return { isLoggedIn };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data)
});

export default connect(mapState, mapDispatch)(AppRouter);
