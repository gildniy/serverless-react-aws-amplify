// @ts-ignore
import React, { useState, useEffect }         from 'react';
import { API, graphqlOperation }              from 'aws-amplify'
// @ts-ignore
import { withAuthenticator }                  from 'aws-amplify-react';
import { createNote, deleteNote, updateNote } from "./graphql/mutations";
import { listNotes }                          from "./graphql/queries";

const App: React.FC = () => {

    interface State {
        note: string,
        notes: any[]
    }

    // eslint-disable-next-line
    const [state, setState] = useState<State>({
        id: "",
        note: "",
        notes: []
    });

    useEffect(() => {
        async function fetchData() {
            const results = await API.graphql(graphqlOperation(listNotes));
            setState({ notes: results.data.listNotes.items });
        }

        fetchData();
    }, []);

    const handleChangeNote = (event: any) => setState({ notes: [], note: event.target.value });

    const hasExistingNote = () => {
        const { notes, id } = state;

        if (id) {
            return notes.findIndex((note: { id: any; }) => note.id === id) > -1
        }
        return false;
    };

    const handleUpdateNote = async () => {
        const { id, notes, note } = state;
        const input = { id, note };
        const result = await API.graphql(graphqlOperation(updateNote, { input }));
        const updatedNote = result.data.updateNote;
        const index = notes.findIndex((note: { id: any; }) => note.id === updatedNote.id);
        const updatedNotes = [
            ...notes.slice(0, index),
            updatedNote,
            ...notes.slice(index + 1)
        ];

        setState({ id: "", notes: updatedNotes, note: "" });
    };

    const handleAddNote = async (event: any) => {
        const { note, notes } = state;

        event.preventDefault();

        if (hasExistingNote()) {
            await handleUpdateNote();
        } else {
            const input = { note };
            const result = await API.graphql(graphqlOperation(createNote, { input }));
            const newNote = result.data.createNote;
            const updatedNote = [newNote, ...notes];

            setState({ notes: updatedNote, note: "" });
        }
    };

    const handleDeleteNote = async (id: any) => {
        const { notes } = state;
        const input = { id };

        console.log('input', input);

        const result = await API.graphql(graphqlOperation(deleteNote, { input }));
        const deletedNoteId = result.data.deleteNote.id;
        const updatedNotes = notes.filter((note: any) => note.id !== deletedNoteId);
        setState({ notes: updatedNotes });
    };

    const handleSetNote = ({ note, id }: any) => setState({ notes, note, id });

    const { id, notes, note } = state;

    return (
        <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
            <h1 className="code f2-l blue">Amplify Notetaker</h1>
            <form onSubmit={ handleAddNote } className="mb3">
                <input
                    type="text"
                    className="pa2 f4"
                    placeholder="Write your note"
                    onChange={ handleChangeNote }
                    value={ note }
                />
                <button className="pa2 f4" type="submit">
                    { id ? "Update Note" : "Add note" }
                </button>
            </form>
            <div>
                { notes.map((item: any) => (
                    <div key={item.id} className="flex items-center">
                        <li
                            onClick={ () => handleSetNote(item) }
                            className="list pa1 f3"
                        >
                            { item.note }
                        </li>
                        <button onClick={ () => handleDeleteNote(item.id) } value={ item.id }
                                className="bg-transparent bn f4">
                            <span>&times;</span>
                        </button>
                    </div>
                )) }
            </div>
        </div>
    );
};

export default withAuthenticator(App, { includeGreetings: true });
