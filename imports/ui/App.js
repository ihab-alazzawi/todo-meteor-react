import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import { Tasks } from '../api/tasks.js';

import Task from './Task.js';

// App component - represents the whole app
class App extends Component {
  state = {
    text: '',
    hideCompleted: false
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    // get the text input from state
    const text = this.state.text.trim();
    Meteor.call('tasks.insert', text);
    // Clear form
    this.setState({ text: '' });
  };

  toggleHideCompleted = () => {
    this.setState({
      hideCompleted: !this.state.hideCompleted
    });
  };

  renderTasks = () => {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map(task => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return <Task key={task._id} task={task} showPrivateButton={showPrivateButton} />;
    });
  };

  render() {
    const { text } = this.state;

    return (
      <div className="container">
        <header>
          <h1>Pending Tasks ({this.props.incompleteCount})</h1>
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted}
            />
            Hide Completed Tasks
          </label>
          <AccountsUIWrapper />
          {this.props.currentUser ? (
            <form className="new-task" onSubmit={this.handleSubmit}>
              <input
                type="text"
                value={text}
                name="text"
                onChange={this.handleChange}
                placeholder="Type to add new tasks"
              />
            </form>
          ) : (
            ''
          )}
        </header>

        <ul>{this.renderTasks()}</ul>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('tasks');
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user()
  };
})(App);
