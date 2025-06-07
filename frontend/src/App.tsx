import { useEffect, useState } from "react";
import "./App.css";

interface Joke {
	id: number;
	question: string;
	answer: string;
}

function App() {
	const [joke, setJoke] = useState<Joke | null>(null);
	const [showAnswer, setShowAnswer] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const API_BASE_URL = "https://cda-carambar-back.onrender.com";

	const fetchJoke = async () => {
		setLoading(true);
		setError(null);
		setShowAnswer(false);

		try {
			const response = await fetch(`${API_BASE_URL}/blagues/random`);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || `HTTP error! status: ${response.status}`,
				);
			}
			const data: Joke = await response.json();
			setJoke(data);
		} catch (err: any) {
			console.error("Failed to fetch joke:", err);
			setError(
				"Notre serveur a le cerveau lent désolé",
			);
			setJoke(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchJoke();
	}, []);

	const handleNewJoke = () => {
		fetchJoke();
	};

	const toggleAnswer = () => {
		setShowAnswer(!showAnswer);
	};

	return (
		<div className="app-container">
			<div className="joke-box-no-banner">
				<div className="joke-content-area">
					{loading ? (
						<p className="loading-text">Chargement de la blague...</p>
					) : error ? (
						<p className="error-text">{error}</p>
					) : joke ? (
						<>
							<p className="joke-question">{joke.question}</p>

							<div
								className={`joke-answer-area ${showAnswer ? "show-answer" : "hide-answer"}`}
								onClick={toggleAnswer}
							>
								<p className="joke-answer-text">{joke.answer}</p>
							</div>

							{!showAnswer && (
								<button onClick={toggleAnswer} className="toggle-answer-button">
									Voir la réponse
								</button>
							)}
						</>
					) : (
						<p className="no-joke-text">
							nos blagueurs sont en vacance :(
						</p>
					)}
				</div>

				<button
					onClick={handleNewJoke}
					disabled={loading}
					className="new-joke-button-no-banner"
				>
					{loading ? "Chargement..." : "Nouvelle Blague"}
				</button>
			</div>
		</div>
	);
}

export default App;
