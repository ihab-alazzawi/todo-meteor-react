import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

export class Task extends Component {
  toggleChecked = () => {
    const { task } = this.props;
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', task._id, !task.checked);
  };

  deleteThisTask = () => {
    Meteor.call('tasks.remove', this.props.task._id);
  };

  togglePrivate = () => {
    const { task } = this.props;
    Meteor.call('tasks.setPrivate', task._id, !task.private);
  };

  render() {
    const { task } = this.props;
    const taskClassName = classnames({
      checked: task.checked,
      private: task.private
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
          <button className="toggle-private" onClick={this.togglePrivate}>
            {task.private ? 'Private' : 'Public'}
          </button>
        ) : (
          ''
        )}

        <span className="text">
          <strong>{task.username}</strong>:{task.text}
        </span>
      </li>
    );
  }
}

export default Task;
