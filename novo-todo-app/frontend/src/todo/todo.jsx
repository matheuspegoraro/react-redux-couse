import React, { Component } from 'react';
import axios from 'axios';

import PageHeader from '../template/pageHeader';
import TodoForm from './todoForm';
import TodoList from './todoList';

const URL = 'http://localhost:3003/api/todos';

export default class Todo extends Component {
    constructor(props) {
        super(props);

        this.state = { description: '', isShearching: false, list: [] };

        this.handleAdd = this.handleAdd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleMarkAsDone = this.handleMarkAsDone.bind(this);
        this.handleMarkAsPending = this.handleMarkAsPending.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleClear = this.handleClear.bind(this);

        this.refresh();
    }

    refresh(description = '') {
        const search = description ? `&description__regex=/${ description }/i` : '';

        axios.get(`${URL}?sort=-createdAt${search}`)
            .then(resp => this.setState({ description: description, list: resp.data }));
    }

    handleSearch() {
        this.refresh(this.state.description);
        this.setState({ isShearching: true });
    }

    handleChange(e) {
        this.setState({ description: e.target.value, isShearching: false });
    }

    handleAdd() {
        const { description } = this.state;

        axios.post(URL, { description })
            .then(resp => this.refresh());
    }

    handleRemove(todo) {
        axios.delete(`${URL}/${todo._id}`)
            .then(resp => this.refresh(this.state.description));
    }

    handleMarkAsDone(todo) {
        axios.put(`${URL}/${todo._id}`, { done: true })
            .then(resp => this.refresh(this.state.description));
    }

    handleMarkAsPending(todo) {
        axios.put(`${URL}/${todo._id}`, { done: false })
            .then(resp => this.refresh(this.state.description));
    }

    handleClear() {
        this.refresh();
    }

    render() {
        return (
            <div>
                <PageHeader name='Tarefas' small='Cadastro'></PageHeader>
                <TodoForm
                    handleAdd={ this.handleAdd } 
                    handleChange= { this.handleChange } 
                    handleSearch={ this.handleSearch } 
                    handleClear={ this.handleClear } 
                    description={ this.state.description }
                    isShearching={ this.state.isShearching } /> 
                <TodoList 
                    list={ this.state.list }
                    handleRemove={ this.handleRemove }
                    handleMarkAsDone={ this.handleMarkAsDone }
                    handleMarkAsPending={ this.handleMarkAsPending } />
            </div>
        );
    }
};