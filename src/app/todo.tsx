'use client'

import React, {useEffect, useState} from 'react'
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Checkbox from "@mui/material/Checkbox"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';

import TodoItem from "@/app/type/todoItem";

export default function Todo() {
    const [todoList, setTodoList] = useState<TodoItem[]>([])
    const listUrl: RequestInfo = "/api/todo/list"
    const itemUrl: RequestInfo = "/api/todo/item"

    useEffect(()=>{
        const fetchTodoList = async () => {
            try {
                const res = await fetch(listUrl)
                const json = await res.json()
                setTodoList(json)
            }
            catch (e) {
                console.log('fetch list error')
            }
        }
        fetchTodoList()
    },[])

    const createTodoItem = () => {
        const fetchCreateTodo = async () => {
            try {
                const res = await fetch(itemUrl,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({id: "create", todo:"", enable:true, editing:true })
                })
                if(res.ok){
                    const newTodoItem:TodoItem = await res.json()
                    setTodoList([...todoList, newTodoItem])
                }
            }
            catch (e) {
                console.log('fetch create error')
            }
        }
        fetchCreateTodo()
    }

    const deleteTodoItem = (idx: number) => {
        const fetchDeleteTodo = async () => {
            try {
                const res = await fetch(itemUrl,{
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({id: todoList[idx].id})
                })
                if(res.ok){
                    setTodoList(todoList.filter((_:TodoItem, index:number) => index != idx))
                }
            }
            catch (e) {
                console.log('fetch delete error')
            }
        }
        fetchDeleteTodo()
    }

    const updateTodoItem = (todoItem: TodoItem, index: number) => {
        const fetchUpdateTodo = async () => {
            try {
                const res = await fetch(itemUrl,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(todoItem)
                })
                if(res.ok){
                    const newTodoList :TodoItem[] = [
                        ...todoList.slice(0, index),
                        todoItem,
                        ...todoList.slice(index + 1)
                    ]
                    setTodoList(newTodoList)
                }
            }
            catch (e) {
                console.log('fetch update error')
            }
        }
        fetchUpdateTodo()
    }

    const toggleEnable = (index: number) => {
        const newTodoItem: TodoItem = {
            id:todoList[index].id,
            todo:todoList[index].todo,
            enable: !todoList[index].enable,
            editing: todoList[index].editing,
        }
        updateTodoItem(newTodoItem, index)
    }

    const toggleEditing = (index: number) => {
        const newTodoItem: TodoItem = {
            id:todoList[index].id,
            todo: todoList[index].todo,
            enable: todoList[index].enable,
            editing: !todoList[index].editing,
        }
        updateTodoItem(newTodoItem, index)
    }

    const editTodo = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newTodoItem: TodoItem = {
            id:todoList[index].id,
            todo: e.target.value,
            enable: todoList[index].enable,
            editing: todoList[index].editing,
        }
        updateTodoItem(newTodoItem, index)
    }

    const endEdit = (e : React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if(e.key === 'Enter'){
            toggleEditing(index)
        }
    }

    const todoElement = (todoItem: TodoItem, index:number) => {
        if(todoItem.editing){
            return <TextField
                defaultValue={todoItem.todo}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => editTodo(event,index)}
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>)=> endEdit(event,index)}
                size="small"
                fullWidth />
        }
        else {
            if(todoItem.enable){
                return <ListItemText>{todoItem.todo}</ListItemText >
            }
            else {
                return <ListItemText><del>{todoItem.todo}</del></ListItemText >
            }
        }
    }

    return <>
        <List>
            {todoList.map((todoItem: TodoItem, index:number) =>{
                return (
                    <ListItem
                        key={index}
                        secondaryAction={
                            <div>
                                <IconButton edge="end" aria-label="edit">
                                    <CreateIcon onClick={() => toggleEditing(index)}/>
                                </IconButton>
                                <IconButton edge="end" aria-label="delete">
                                    <DeleteIcon onClick={() => deleteTodoItem(index)}/>
                                </IconButton>
                            </div>
                        }
                    >
                        <ListItemButton role={undefined} dense>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={!todoItem.enable}
                                    disableRipple
                                    onClick={() => toggleEnable(index)}
                                />
                            </ListItemIcon>
                            {todoElement(todoItem,index)}
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
        <Box sx={{ textAlign: 'right', '& > :not(style)': { m: 1 }}}>
            <Fab color="secondary" aria-label="add">
                <AddIcon onClick={createTodoItem}/>
            </Fab>
        </Box>
    </>
}