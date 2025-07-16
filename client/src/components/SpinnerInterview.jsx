import React, { useState, useEffect, useRef } from 'react';

const SpinnerInterview = ({ onClose }) => {
    const [selected, setSelected] = useState(null);
    const [typedAnswer, setTypedAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [recording, setRecording] = useState(false);
    const [questionsByCategory, setQuestionsByCategory] = useState({});
    const mediaRecorderRef = useRef(null);
    const chunks = useRef([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/mock-questions`);
                const data = await res.json();
                setQuestionsByCategory(data);
            } catch (err) {
                console.error("❌ Failed to load questions:", err);
            }
        };

        fetchQuestions();
    }, []);


    const spin = () => {
        const categories = Object.keys(questionsByCategory);
        if (categories.length === 0) return;

        const category = categories[Math.floor(Math.random() * categories.length)];
        const questionList = questionsByCategory[category];
        const question = questionList[Math.floor(Math.random() * questionList.length)];

        setSelected({ category, question });
        setTypedAnswer('');
        setFeedback('');
    };


    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunks.current = [];

        mediaRecorder.ondataavailable = (e) => chunks.current.push(e.data);

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
            const formData = new FormData();
            formData.append('audio', audioBlob);
            formData.append('question', selected.question);

            setLoading(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/evaluate/spinner`, {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                setFeedback(data.feedback || 'No feedback.');
            } catch (err) {
                setFeedback('Error during voice evaluation.');
            } finally {
                setLoading(false);
            }
        };

        mediaRecorder.start();
        setRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const handleSubmitText = async () => {
        if (!typedAnswer.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/evaluate/spinner`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: selected.question,
                    answer: typedAnswer
                })
            });
            const data = await res.json();
            setFeedback(data.feedback || 'No feedback.');
        } catch (err) {
            setFeedback('Error during text evaluation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-[90%] md:w-[550px] border border-gray-200 my-10">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-black">Mock Interview Spinner</h2>

                {!selected ? (
                    <button onClick={spin} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium text-lg transition">Spin 🎡</button>
                ) : (
                    <div>
                        <div className='mb-3'>
                            <p className="text-sm font-medium text-gray-600 dark:text-black">Category:<span className="text-gray-800 dark:text-black"> {selected.category}</span></p>
                            <p className="text-base text-gray-700 dark:text-black mt-1">{selected.question}</p>
                        </div>
                        <textarea
                            className="w-full mt-3 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-200 bg-gray-200 dark:text-black"
                            rows={4}
                            placeholder="(Optional) Type your answer here."
                            value={typedAnswer}
                            onChange={(e) => setTypedAnswer(e.target.value)}
                        />

                        <div className="flex gap-4 mt-4">
                            {!recording ? (
                                <button onClick={startRecording} className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md font-medium transition">
                                    Start Recording
                                </button>
                            ) : (
                                <button onClick={stopRecording} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-medium transition">
                                    Stop Recording
                                </button>
                            )}

                            <button onClick={handleSubmitText} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition">
                                {loading ? 'Submitting...' : 'Submit Typed Answer'}
                            </button>
                        </div>

                        {loading && <p className="mt-3 text-gray-600 text-sm">⏳ Evaluating your response...</p>}

                        {feedback && (
                            <div className="mt-4 dark:bg-gray-200 bg-gray-200 p-4 rounded-md text-sm text-gray-900 dark:text-black max-h-[150px] overflow-y-auto">
                                <strong className="block mb-1 text-black dark:text-black">AI Feedback:</strong>
                                <p className="whitespace-pre-line leading-relaxed text-black dark:text-black">{feedback}</p>
                            </div>
                        )}
                        <div className="mt-4 flex justify-between text-sm">
                            <button onClick={spin} className="text-blue-600 hover:underline">Spin again</button>
                            <button onClick={onClose} className="text-blue-600 hover:underline">Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

export default SpinnerInterview;
