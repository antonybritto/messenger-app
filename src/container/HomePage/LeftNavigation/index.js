import React from 'react';

const ACTIONS = [
  { icon: 'account', text: 'Account' },
  { icon: 'notifications', text: 'Notifications' },
  { icon: 'group', text: 'Contacts' },
  { icon: 'settings', text: 'Settings' },
  { icon: 'help', text: 'Help & Feedback' },
];

function LeftNavigation() {
  return (
    <section>
      <article className="profile">
        <figure>
          <img
            className="avatar"
            alt="Your Avatar"
            src="https://message-list.appspot.com/photos/william-shakespeare.jpg"
          />
          <figcaption className="name">William Shakespeare</figcaption>
        </figure>
        <p className="email">william.shakespeare@gmail.com</p>
      </article>
      <nav role="navigation">
        <ul role="menu" className="links">
          {ACTIONS.map((action, index) =>
            <li key={index} className="list" role="menuitem">
              <a className="link" role="Link" href="/" title={action.text}>
                <img
                  className="icon"
                  role="presentation"
                  src={`/build/images/${action.icon}.svg`}
                />
                {action.text}
              </a>
            </li>
          )}
        </ul>
      </nav>
    </section>
  );
}

export default LeftNavigation;
