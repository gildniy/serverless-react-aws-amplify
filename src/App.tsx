import React from 'react';

import { withAuthenticator } from 'aws-amplify-react'

const App: React.FC = () => {

    state = {
        notes: [
            {
                id: 1,
                note: "Hello world!"
            }
        ]
    };

    const { notes } = this.state;

  return (
      <div>App</div>
  );
};

export default withAuthenticator(App, { includeGreetings: true });
