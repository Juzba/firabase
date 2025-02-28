import './App.scss';
import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc,doc } from 'firebase/firestore';
import { projectFirestore } from './firebase/config';

const App = () => {
    const [error, setError] = useState(false);
    const [data, setData] = useState(false);

    const deleteMovie = async(id) => {
        await deleteDoc(doc(projectFirestore, "movies", id))
    };

    useEffect(() => {
        const usersCollection = collection(projectFirestore, 'movies');
        getDocs(usersCollection)
            .then((snapshot) => {
                if (snapshot.empty) {
                    setError('Žádné data');
                } else {
                    let result = [];
                    snapshot.docs.forEach((oneDoc) => result.push({ id: oneDoc.id, ...oneDoc.data() }));
                    setData(result);
                }
            })
            .catch((err) => setError(err.message));
    }, []);

    return (
        <div className="app">
            <h1>Databáze Firebase</h1>
            {data ? (
                data.map(({ id, title, minage, time }) => {
                    return (
                        <section key={id}>
                            <p>{`${title},  ${minage}+,  ${time}min`}</p>
                            <button onClick={() => deleteMovie(id)}>Smazat</button>
                        </section>
                    );
                })
            ) : (
                <p>Loading....</p>
            )}
            <p>{error}</p>
        </div>
    );
};

export default App;
