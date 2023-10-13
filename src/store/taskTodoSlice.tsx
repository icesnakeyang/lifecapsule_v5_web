import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type Action1 = {
    payload: number
}
type Action2 = {
    payload: string
}

export const taskTodoSlice = createSlice({
    name: "task",
    initialState: {
        todoList: [],
        totalTodo: 0,
        todoPageIndex: 1,
        todoPageSize: 10,
        todoTaskTitle: '',
        todoTaskContent: '',
        todoTaskId: null
    },
    reducers: {
        saveTodoList: (state: any, action: any) => {
            state.todoList = action.payload;
        },
        saveTotalTodo: (state: any, action: PayloadAction<number>) => {
            state.totalTodo = action.payload;
        },
        saveTodoPageIndex: (state: any, action: Action1) => {
            state.todoPageIndex = action.payload;
        },
        saveTodoPageSize: (state: any, action: Action1) => {
            state.todoPageSize = action.payload;
        },
        clearTaskTodoState: (state: any) => {
            state.todoList = [];
            state.totalTodo = 0;
        },
        saveTodoTaskTitle: (state: any, action: any) => {
            state.todoTaskTitle = action.payload
        },
        saveTodoTaskContent: (state: any, action: Action2) => {
            state.todoTaskContent = action.payload
        },
        saveTodoTaskId: (state: any, action: any) => {
            state.todoTaskId = action.payload
        }
    },
});

export const {
    saveTodoList,
    saveTotalTodo,
    clearTaskTodoState,
    saveTodoPageIndex,
    saveTodoPageSize,
    saveTodoTaskTitle,
    saveTodoTaskContent,
    saveTodoTaskId
} = taskTodoSlice.actions;

export default taskTodoSlice.reducer;
