import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import classnames from 'classnames';

export class Task extends Component {
  toggleChecked = () => {
    const { task } = this.props;
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  };

  deleteThisTask = () => {
    Meteor.call('tasks.remove', this.props.task._id);
  };

  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
  }

  render() {
    const { task } = this.props;
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private
    });
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS

    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask}>
          &times;
        </button>

        <input type="checkbox" readOnly checked={!!task.checked} onClick={this.toggleChecked} />
        {this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            {this.props.task.private ? 'Private' : 'Public'}
          </button>
        ) : (
          ''
        )}

        <span className="text">
          <strong>{this.props.task.username}</strong>:{task.text}
        </span>
      </li>
    );
  }
}

export default Task;
