import React from 'react';
import swipeToDelete from '../../../utils/swipeToDelete';
import { getLocaleString } from '../../../utils/dateHelper';

class MessageCard extends React.Component {

  componentDidMount() {
    const deleteHandler = this.props.onDeleteMessage;
    swipeToDelete.init({
      elem: this.refs.card,
      onDelete() {
        this.destroy(true);
        deleteHandler();
      },
    });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.message.id !== this.props.message.id;
  }

  render() {
    const { message } = this.props;
    return (
      <li role="Listitem" ref="card" aria-dropeffect="move" className="card">
        <article className="message-card" role="Article">
          <figure className="sender">
            <img
              src={`https://message-list.appspot.com${message.author.photoUrl}`}
              alt={message.author.name}
              role="Img"
              className="avatar"
            />
            <div>
              <figcaption>{message.author.name}</figcaption>
              <time className="time" dateTime={message.updated}>
                {getLocaleString(message.updated)}
              </time>
            </div>
          </figure>
          <p className="message">{message.content}</p>
        </article>
      </li>
    );
  }
}

export default MessageCard;
