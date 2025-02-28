import "./App.scss";
import { useState, useEffect } from "react";
import { collection, deleteDoc, doc, onSnapshot, setDoc, addDoc } from "firebase/firestore";
import { projectFirestore } from "./firebase/config";

const App = () => {
	// usestate pro formulář
	const [title, setTitle] = useState("");
	const [minAge, setMinAge] = useState("");
	const [time, setTime] = useState("");

	const [error, setError] = useState(false);
	const [data, setData] = useState([]);

	const onSubmit = async (e) => {
		e.preventDefault();

		if (title && minAge && time) {
			console.log("splneno");
			const newMovie = { title: title, minage: minAge, time: time };

			try {
				// Přidá object nebo přepíše object se stejným id
				// await setDoc(doc(projectFirestore, "movies", "id-zde"), newMovie)

				// Přidá object s automaticky přiřazeným id
				await addDoc(collection(projectFirestore, "movies"), newMovie)  
	
				setTitle("")
				setMinAge("")
				setTime("")
				
			} catch (error) {
				setError("Fim nebyl přidán " + error.message)
			}

		} else {
			console.log("nesplneno");
		}
	};

	const deleteMovie = async (id) => {
		await deleteDoc(doc(projectFirestore, "movies", id));
	};

	useEffect(() => {
		const unsubscribe = onSnapshot(
			collection(projectFirestore, "movies"),
			(snapshot) => {
				if (snapshot.empty) {
					setError("Žádné data");
					setData([]);
				} else {
					let result = [];
					snapshot.docs.forEach((oneDoc) => result.push({ id: oneDoc.id, ...oneDoc.data() }));
					setData(result);
					setError(false);
				}
			},
			(err) => setError(err.message)
		);

		return () => unsubscribe();
	}, []);

	return (
		<div className="app">
			<h1>Databáze Firebase</h1>

			<form onSubmit={onSubmit}>
				<input type="text" placeholder="Název filmu" onChange={(e) => setTitle(e.target.value)} value={title} />
				<input type="number" min={0} placeholder="Min věk" onChange={(e) => setMinAge(e.target.value)} value={minAge} />
				<input type="number" min={0} placeholder="Doba trvání" onChange={(e) => setTime(e.target.value)} value={time} />
				<input type="submit" value={"Odeslat"} />
			</form>

			{data.length > 0 ? (
				data.map(({ id, title, minage, time }) => {
					return (
						<section key={id}>
							<p>{`${title},  ${minage}+,  ${time}min`}</p>
							<button onClick={() => deleteMovie(id)}>Smazat</button>
						</section>
					);
				})
			) : (
				<p>{error || "Loading...."}</p>
			)}
		</div>
	);
};

export default App;
