import { useEffect, useState } from 'react'
import './App.css'
import { database, ref, push, get, db } from './firebase'

const FeedbackForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !comment) {
      alert('form data missing');
      return;
    }
    if (!email.includes('@')) {
      alert('Invalid email');
      return;
    }

    try {
      const feedbackRef = ref(database, 'feedbacks');
      await push(feedbackRef, { name, email, comment });
      setName('');
      setEmail('');
      setComment('');
      alert('Feedback Submitted');
    } catch (error) {
      console.log('Error Submitting feedback: ', error);
    }
  }


  return (
    <>
      <form onSubmit={handleSubmit} className='feedback-form'>
        <input type='text' placeholder='Name' value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input type='email' placeholder='example@somemail.com'
          value={email}
          onChange={(e) => { setEmail(e.target.value) }}
        />
        <textarea placeholder='Comment' value={comment}
          onChange={(e) => { setComment(e.target.value) }}
        />
        <button type='submit'>Submit </button>
      </form>
    </>
  )
}

const FeedbackItem = ({ feedback, onDelete }) => {
  return (
    <div className='feedback-card'>
      <h3>{feedback.name}</h3>
      <p>{feedback.email}</p>
      <p>{feedback.comment}</p>
      <button onClick={() => { onDelete(feedback.id) }}>Delete</button>
    </div>
  )
}

const FeedbackList = ({ feedbacks, onDelete }) => {
  const data = Object.keys(feedbacks);
  console.log(data);
  const feedks = [];
  data.map((d)  => feedks.push(feedbacks[d]));

  return (
    <div className='feedback-list'>
      {feedks.map((item) => {
        <FeedbackItem key={item.id} feedback={item} onDelete={onDelete} />
      })}
    </div>
  )
}


const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  }

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <button onClick={toggleTheme} className='theme-toggle'>
      Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}

function App() {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeeds = async () => {
    try {
      const feedbackRef = ref(database, `feedbacks`);
      const snapshot = await get(feedbackRef);
      if (snapshot.exists()) {
        console.log(snapshot.val())
        setFeedbacks(snapshot.val());
      } else {
        setFeedbacks([]);
      }
    } catch (error) {
      console.log('Error fetching: ', error);
    }
  }
  useEffect(() => {
    try {
      get(ref(db, `feedbacks`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log(data);
          setFeedbacks(data);
        } else {
          console.log("No data available");
        }
      });
    } catch(error) {
      console.log(error);
    }
  }, [])
const onDelete = async (id) => {
  try {
    const feedbackRef = ref(database, `feedbacks/${id}`);
    await remove(feedbackRef);
    await fetchFeeds();
  } catch (error) {
    console.log('Error: ', error);
  }
}
return (
  <>
    <ThemeToggle />
    <FeedbackForm feedbacks={feedbacks} />
    <FeedbackList feedbacks={feedbacks} onDelete={onDelete} />
  </>
)
}

export default App;
