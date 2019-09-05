// @ts-ignore
import React, { useState }   from 'react';
// @ts-ignore
import { withAuthenticator } from 'aws-amplify-react'

const App: React.FC = () => {

    interface State {
        notes: {
            id: number,
            note: string
        }[]
    }

    // eslint-disable-next-line
    const [state, setState] = useState<State>({
        notes: [{
            id: 1,
            note: "Hello world!"
        }]
    });

    const { notes } = state;

    // @ts-ignore
    return (
        <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
            <h1 className="code f2-l blue">Amplify Notetaker</h1>
            <form className="mb3">
                <input
                    type="text"
                    className="pa2 f4"
                    placeholder="Write your note"
                />
                <button className="pa2 f4" type="submit">
                    Add note
                </button>
            </form>
            <div>
                { notes.map((item: any) => (
                    <div key={item.id} className="flex items-center">
                        <li
                            className="list pa1 f3"
                        >
                            { item.note }
                        </li>
                        <button className="bg-transparent bn f4">
                            <span>&times;</span>
                        </button>
                    </div>
                )) }
            </div>
        </div>
    );
};

export default withAuthenticator(App, { includeGreetings: true });
