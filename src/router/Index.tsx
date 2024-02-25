import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Dashboard1 from "../pages/dashboard/Dashboard1";
import NoteList from "../pages/note/NoteList";
import Home from "../pages/Home";
import LoginPage from "../pages/login/LoginPage";
import DonatePage from "../pages/donate/DonatePage";
import {useEffect} from "react";
import MyProfile from "../pages/me/MyProfile";
import SettingPage from "../pages/setting/SettingPage";
import NoteEdit from "../pages/note/NoteEdit";
import NoteNew from "../pages/note/NoteNew";
import SendPage from "../pages/send/SendPage";
import InstantSend from "../pages/send/InstantSend";
import PrimarySend from "../pages/send/PrimarySend";
import DatetimeSend from "../pages/send/DatetimeSend";
import PublishToTopic from "../pages/send/PublishToTopic";
import PublishToMotto from "../pages/send/PublishToMotto";
import PublishToPublicWeb from "../pages/send/PublishToPublicWeb";
import MyReceiveNoteDetail from "../pages/receiveNote/MyReceiveNoteDetail";
import MyReceiveNoteList from "../pages/receiveNote/MyReceiveNoteList";
import UserPrivacy from "../pages/UserPrivacy";
import NoteSendList from "../pages/send/NoteSendList";
import MySendNoteDetail from "../pages/send/MySendNoteDetail";
import MyTriggerEdit from "../pages/send/MyTriggerEdit";
import TodoPage from "../pages/task/todo/TodoPage";
import ProjectList from "../pages/task/project/ProjectList";
import ProjectEdit from "../pages/task/project/ProjectEdit";
import TodoEdit from "../pages/task/todo/TodoEdit";
import MyHistoryHome from "../pages/myHistory/MyHistoryHome";
import HistoryNoteDetail from "../pages/myHistory/HistoryNoteDetail";
import LoveLetterList from "../pages/note/loveLetter/LoveLetterList";
import LoveLetterEdit from "../pages/note/loveLetter/LoveLetterEdit";
import LoveLetterNew from "../pages/note/loveLetter/LoveLetterNew";
import TodoNew from "../pages/task/todo/TodoNew";
import LoveLetterTriggerEdit from "../pages/note/loveLetter/LoveLetterTriggerEdit";
import ProcrastinationList from "../pages/note/procrastination/ProcrastinationList";
import ProcrastinationEdit from "../pages/note/procrastination/ProcrastinationEdit";
import ProcrastinationNew from "../pages/note/procrastination/ProcrastinationNew";
import NoteDetail from "../pages/note/NoteDetail";
import NoteReply from "../pages/note/NoteReply";

const Routers = (data: any) => {
    const navigate = useNavigate()
    const location = useLocation()
    const token = localStorage.getItem("lifecapsule_token")
    useEffect(() => {
        if (!token) {
            let path = location.pathname
            if (path === '/') {
                return
            }
            if (path === '/SettingPage') {
                return;
            }
            navigate('/LoginPage', {replace: true})
        }
    }, [token, navigate])

    return (
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/LoginPage' element={<LoginPage/>}/>
            <Route path='/DonatePage' element={<DonatePage/>}/>
            <Route path='/Dashboard1' element={<Dashboard1/>}/>
            <Route path='/NoteList' element={<NoteList/>}/>
            <Route path='/MyProfile' element={<MyProfile/>}/>
            <Route path='/SettingPage' element={<SettingPage/>}/>
            <Route path='/NoteEdit' element={<NoteEdit/>}/>
            <Route path='/NoteNew' element={<NoteNew/>}/>
            <Route path='/SendPage' element={<SendPage/>}/>
            <Route path='/InstantSend' element={<InstantSend/>}/>
            <Route path='/PrimarySend' element={<PrimarySend/>}/>
            <Route path='/DatetimeSend' element={<DatetimeSend/>}/>
            <Route path='/PublishToTopic' element={<PublishToTopic/>}/>
            <Route path='/PublishToMotto' element={<PublishToMotto/>}/>
            <Route path='/PublishToPublicWeb' element={<PublishToPublicWeb/>}/>
            <Route path='/MyReceiveNoteDetail' element={<MyReceiveNoteDetail/>}/>
            <Route path='/MyReceiveNoteList' element={<MyReceiveNoteList/>}/>
            <Route path='/user_privacy' element={<UserPrivacy/>}/>
            <Route path='/NoteSendList' element={<NoteSendList/>}/>
            <Route path='/MySendNoteDetail' element={<MySendNoteDetail/>}/>
            <Route path='/MyTriggerEdit' element={<MyTriggerEdit/>}/>
            <Route path='/TodoPage' element={<TodoPage/>}/>
            <Route path='/ProjectList' element={<ProjectList/>}/>
            <Route path='/ProjectEdit' element={<ProjectEdit/>}/>
            <Route path='/TodoEdit' element={<TodoEdit/>}/>
            <Route path='/MyHistoryHome' element={<MyHistoryHome/>}/>
            <Route path='/HistoryNoteDetail' element={<HistoryNoteDetail/>}/>
            <Route path='/LoveLetterList' element={<LoveLetterList/>}/>
            <Route path='/LoveLetterEdit' element={<LoveLetterEdit/>}/>
            <Route path='/LoveLetterNew' element={<LoveLetterNew/>}/>
            <Route path='/TodoNew' element={<TodoNew/>}/>
            <Route path='/LoveLetterTriggerEdit' element={<LoveLetterTriggerEdit/>}/>
            <Route path='/ProcrastinationList' element={<ProcrastinationList/>}/>
            <Route path='/ProcrastinationEdit' element={<ProcrastinationEdit/>}/>
            <Route path='/ProcrastinationNew' element={<ProcrastinationNew/>}/>
            <Route path='/NoteDetail' element={<NoteDetail/>}/>
            <Route path='/NoteReply' element={<NoteReply/>}/>
        </Routes>
    )
}
export default Routers
