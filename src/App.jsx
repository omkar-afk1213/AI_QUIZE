import { useEffect, useMemo, useState } from 'react'
import './App.css'

const topicOptions = [
  'Artificial Intelligence',
  'Machine Learning',
  'Python Programming',
  'Java Programming',
  'Database Management System',
  'Computer Networks',
  'Cyber Security',
  'Web Development',
  'Operating Systems',
  'Software Engineering',
]

const defaultForm = {
  topic: 'Artificial Intelligence',
  difficulty: 'Medium',
  count: 5,
}

const adminAccount = {
  role: 'admin',
  username: 'admin',
  password: 'admin123',
  name: 'Admin User',
}

const STORAGE_KEY = 'ai-quiz-users'

function App() {
  const [selectedRole, setSelectedRole] = useState('admin')
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [activeUser, setActiveUser] = useState(null)
  const [loginError, setLoginError] = useState('')
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '' })
  const [userMessage, setUserMessage] = useState('')
  const [shareUrl, setShareUrl] = useState('')
  const [pendingInvite, setPendingInvite] = useState(null)

  const [form, setForm] = useState(defaultForm)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const currentQuestion = questions[currentIndex]

  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(STORAGE_KEY)
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers)
        setUsers(parsedUsers)
        return
      }
    } catch (error) {
      console.error('Failed to load saved users:', error)
    }

    const initialUsers = [adminAccount]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers))
    setUsers(initialUsers)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const username = params.get('username')?.trim()
    const password = params.get('password')?.trim()
    const role = params.get('role') === 'admin' ? 'admin' : 'user'

    if (username && password) {
      setSelectedRole(role)
      setLoginData({ username, password })
      setPendingInvite({ username, password, role })
    }
  }, [])

  useEffect(() => {
    if (!pendingInvite || !users.length || activeUser) return

    const matchedUser = users.find(
      (user) =>
        user.username === pendingInvite.username &&
        user.password === pendingInvite.password &&
        (pendingInvite.role === 'admin' ? user.role === 'admin' : user.role === 'user'),
    )

    if (!matchedUser) {
      setLoginError('This invite link is invalid or the credentials are not available.')
      return
    }

    setActiveUser(matchedUser)
    setLoginError('')
    setPendingInvite(null)
    window.history.replaceState({}, '', window.location.pathname)
  }, [pendingInvite, users, activeUser])

  const progress = useMemo(() => {
    if (!questions.length) return 0
    return ((currentIndex + 1) / questions.length) * 100
  }, [currentIndex, questions.length])

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginData((previous) => ({ ...previous, [name]: value }))
  }

  const handleNewUserChange = (event) => {
    const { name, value } = event.target
    setNewUser((previous) => ({ ...previous, [name]: value }))
  }

  const buildShareLink = (username, password) => {
    const params = new URLSearchParams({
      role: 'user',
      username,
      password,
    })

    return `${window.location.origin}?${params.toString()}`
  }

  const copyShareLink = async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setUserMessage('Share link copied to clipboard.')
    } catch (error) {
      console.error('Copy failed:', error)
      setUserMessage('Copy failed. You can still use the link below.')
    }
  }

  const handleLogin = (event) => {
    event.preventDefault()

    const username = loginData.username.trim()
    const password = loginData.password.trim()

    const matchedUser = users.find(
      (user) =>
        user.username === username &&
        user.password === password &&
        (selectedRole === 'admin' ? user.role === 'admin' : user.role === 'user'),
    )

    if (!matchedUser) {
      setLoginError('Invalid username or password for the selected role.')
      return
    }

    setActiveUser(matchedUser)
    setLoginError('')
    setQuestions([])
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setCompleted(false)
  }

  const handleCreateUser = (event) => {
    event.preventDefault()

    const trimmedName = newUser.name.trim()
    const trimmedUsername = newUser.username.trim()
    const trimmedPassword = newUser.password.trim()

    if (!trimmedName || !trimmedUsername || !trimmedPassword) {
      setUserMessage('Please fill all user fields.')
      return
    }

    const usernameExists = users.some((user) => user.username === trimmedUsername)
    if (usernameExists) {
      setUserMessage('This username already exists. Please choose another one.')
      return
    }

    const newEntry = {
      role: 'user',
      name: trimmedName,
      username: trimmedUsername,
      password: trimmedPassword,
    }

    const updatedUsers = [...users, newEntry]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
    setNewUser({ name: '', username: '', password: '' })
    setSelectedRole('user')
    setLoginData({ username: trimmedUsername, password: trimmedPassword })
    const generatedLink = buildShareLink(trimmedUsername, trimmedPassword)
    setShareUrl(generatedLink)
    setUserMessage(
      `User created successfully. Share these credentials: ${trimmedUsername} / ${trimmedPassword}`,
    )
  }

  const logout = () => {
    setActiveUser(null)
    setLoginData({ username: '', password: '' })
    setLoginError('')
    setQuestions([])
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setCompleted(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({
      ...previous,
      [name]: name === 'count' ? Number(value) : value,
    }))
  }

  const generateQuiz = async () => {
    setLoading(true)
    setError('')
    setCompleted(false)
    setScore(0)
    setCurrentIndex(0)
    setSelectedAnswer(null)

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Quiz generation failed')
      }

      setQuestions(data.questions || [])
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answer)

    if (answer === currentQuestion.correctAnswer) {
      setScore((previous) => previous + 1)
    }
  }

  const nextQuestion = () => {
    if (currentIndex === questions.length - 1) {
      setCompleted(true)
      return
    }

    setCurrentIndex((previous) => previous + 1)
    setSelectedAnswer(null)
  }

  const resetQuiz = () => {
    setQuestions([])
    setCurrentIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setCompleted(false)
    setError('')
  }

  if (!activeUser) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <div className="brand-mark">AI</div>
            <div>
              <p className="eyebrow">College Quiz Portal</p>
              <h1>QuizGen AI</h1>
            </div>
          </div>

          <div className="role-switcher">
            <button
              type="button"
              className={selectedRole === 'admin' ? 'role-btn active' : 'role-btn'}
              onClick={() => setSelectedRole('admin')}
            >
              Admin Login
            </button>
            <button
              type="button"
              className={selectedRole === 'user' ? 'role-btn active' : 'role-btn'}
              onClick={() => setSelectedRole('user')}
            >
              User Login
            </button>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <label>
              Username
              <input
                name="username"
                value={loginData.username}
                onChange={handleLoginChange}
                placeholder="Enter username"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Enter password"
              />
            </label>

            {loginError && <div className="alert danger">{loginError}</div>}

            <div className="demo-creds">
              <strong>Admin access:</strong>
              <span>admin / admin123</span>
              <small>After admin creates a student account, switch to User Login and use that username/password.</small>
            </div>

            <button type="submit" className="primary login-btn">
              Login as {selectedRole === 'admin' ? 'Admin' : 'User'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (activeUser.role === 'admin') {
    return (
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">AI</div>
            <div>
              <p className="eyebrow">Admin Panel</p>
              <h1>QuizGen AI</h1>
            </div>
          </div>

          <div className="user-chip">Welcome, {activeUser.name}</div>

          <div className="panel">
            <h2>Generate New Quiz</h2>

            <label>
              Topic
              <select name="topic" value={form.topic} onChange={handleChange}>
                {topicOptions.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Difficulty
              <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>

            <label>
              Number of Questions
              <input
                type="number"
                min="1"
                max="10"
                name="count"
                value={form.count}
                onChange={handleChange}
              />
            </label>

            <div className="button-row">
              <button type="button" className="primary" onClick={generateQuiz} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Quiz'}
              </button>
              <button type="button" className="secondary" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </aside>

        <main className="quiz-area">
          {error && <div className="alert danger">{error}</div>}

          <div className="admin-summary">
            <div className="stat-card">
              <span>Total Quizzes</span>
              <strong>24</strong>
            </div>
            <div className="stat-card">
              <span>Users</span>
              <strong>{users.filter((user) => user.role === 'user').length}</strong>
            </div>
            <div className="stat-card">
              <span>Pass Rate</span>
              <strong>87%</strong>
            </div>
          </div>

          <div className="manage-user-card">
            <h2>Create User</h2>
            <form className="user-form" onSubmit={handleCreateUser}>
              <label>
                Full Name
                <input
                  name="name"
                  value={newUser.name}
                  onChange={handleNewUserChange}
                  placeholder="Enter student name"
                />
              </label>

              <label>
                Username
                <input
                  name="username"
                  value={newUser.username}
                  onChange={handleNewUserChange}
                  placeholder="Create username"
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  placeholder="Create password"
                />
              </label>

              <button type="submit" className="primary">
                Create User
              </button>
            </form>

            {userMessage && <div className="alert info">{userMessage}</div>}

            {shareUrl && (
              <div className="share-box">
                <p>Student invite link</p>
                <a href={shareUrl} target="_blank" rel="noreferrer">
                  {shareUrl}
                </a>
                <button type="button" className="secondary" onClick={copyShareLink}>
                  Copy Link
                </button>
              </div>
            )}

            <div className="user-list">
              <h3>Registered Student Users</h3>
              {users.filter((user) => user.role === 'user').length === 0 ? (
                <p>No users created yet.</p>
              ) : (
                <ul>
                  {users
                    .filter((user) => user.role === 'user')
                    .map((user) => (
                      <li key={user.username}>
                        <span>{user.name}</span>
                        <small>
                          {user.username} / {user.password}
                        </small>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

          {!questions.length && !loading && !error && (
            <div className="placeholder-card">
              <div className="placeholder-icon">✦</div>
              <h2>AI Quiz Generator Ready</h2>
              <p>Set the subject, difficulty, and question count, then generate the quiz.</p>
            </div>
          )}

          {loading && (
            <div className="placeholder-card">
              <div className="spinner" />
              <h2>Generating questions...</h2>
              <p>Your AI quiz is being prepared for students.</p>
            </div>
          )}

          {!loading && questions.length > 0 && !completed && currentQuestion && (
            <div className="quiz-card">
              <div className="topbar">
                <span className="badge">{form.topic}</span>
                <span className="badge muted">{form.difficulty}</span>
              </div>

              <div className="progress-wrap">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>

              <p className="question-count">
                Question {currentIndex + 1} of {questions.length}
              </p>

              <h2>{currentQuestion.question}</h2>

              <div className="options">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option
                  const isCorrect = option === currentQuestion.correctAnswer
                  const showState = selectedAnswer !== null

                  let className = 'option'
                  if (showState && isCorrect) className += ' correct'
                  if (showState && isSelected && !isCorrect) className += ' wrong'
                  if (showState && isSelected && isCorrect) className += ' selected'

                  return (
                    <button
                      key={option}
                      type="button"
                      className={className}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedAnswer !== null}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>

              {selectedAnswer !== null && (
                <div className="feedback">
                  <p>
                    {selectedAnswer === currentQuestion.correctAnswer
                      ? 'Correct answer!'
                      : `Incorrect. Correct answer: ${currentQuestion.correctAnswer}`}
                  </p>
                  <small>{currentQuestion.explanation}</small>
                </div>
              )}

              <button
                type="button"
                className="primary next-btn"
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
              >
                {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          )}

          {!loading && completed && (
            <div className="result-card">
              <div className="result-icon">✓</div>
              <h2>Quiz Complete</h2>
              <p>
                Final score: <strong>{score}</strong> / <strong>{questions.length}</strong>
              </p>
              <div className="score-ring">
                {Math.round((score / questions.length) * 100)}%
              </div>
              <button type="button" className="primary" onClick={generateQuiz}>
                Create Another Quiz
              </button>
            </div>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">AI</div>
          <div>
            <p className="eyebrow">Student Portal</p>
            <h1>QuizGen AI</h1>
          </div>
        </div>

        <div className="user-chip">Welcome, {activeUser.name}</div>

        <div className="panel user-panel">
          <h2>Start Quiz</h2>

          <label>
            Topic
            <select name="topic" value={form.topic} onChange={handleChange}>
              {topicOptions.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </label>

          <label>
            Difficulty
            <select name="difficulty" value={form.difficulty} onChange={handleChange}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>

          <label>
            Number of Questions
            <input
              type="number"
              min="1"
              max="10"
              name="count"
              value={form.count}
              onChange={handleChange}
            />
          </label>

          <div className="button-row">
            <button type="button" className="primary" onClick={generateQuiz} disabled={loading}>
              {loading ? 'Loading...' : 'Start Quiz'}
            </button>
            <button type="button" className="secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="quiz-area">
        {error && <div className="alert danger">{error}</div>}

        {!questions.length && !loading && !error && (
          <div className="placeholder-card">
            <div className="placeholder-icon">✦</div>
            <h2>Ready for your quiz</h2>
            <p>Select your topic and begin the assessment.</p>
          </div>
        )}

        {loading && (
          <div className="placeholder-card">
            <div className="spinner" />
            <h2>Loading questions...</h2>
            <p>Please wait while the AI prepares your quiz.</p>
          </div>
        )}

        {!loading && questions.length > 0 && !completed && currentQuestion && (
          <div className="quiz-card">
            <div className="topbar">
              <span className="badge">{form.topic}</span>
              <span className="badge muted">{form.difficulty}</span>
            </div>

            <div className="progress-wrap">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>

            <p className="question-count">
              Question {currentIndex + 1} of {questions.length}
            </p>

            <h2>{currentQuestion.question}</h2>

            <div className="options">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option
                const isCorrect = option === currentQuestion.correctAnswer
                const showState = selectedAnswer !== null

                let className = 'option'
                if (showState && isCorrect) className += ' correct'
                if (showState && isSelected && !isCorrect) className += ' wrong'
                if (showState && isSelected && isCorrect) className += ' selected'

                return (
                  <button
                    key={option}
                    type="button"
                    className={className}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </button>
                )
              })}
            </div>

            {selectedAnswer !== null && (
              <div className="feedback">
                <p>
                  {selectedAnswer === currentQuestion.correctAnswer
                    ? 'Correct answer!'
                    : `Incorrect. Correct answer: ${currentQuestion.correctAnswer}`}
                </p>
                <small>{currentQuestion.explanation}</small>
              </div>
            )}

            <button
              type="button"
              className="primary next-btn"
              onClick={nextQuestion}
              disabled={selectedAnswer === null}
            >
              {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        )}

        {!loading && completed && (
          <div className="result-card">
            <div className="result-icon">✓</div>
            <h2>Quiz Results</h2>
            <p>
              Your score: <strong>{score}</strong> / <strong>{questions.length}</strong>
            </p>
            <div className="score-ring">
              {Math.round((score / questions.length) * 100)}%
            </div>
            <button type="button" className="primary" onClick={generateQuiz}>
              Retake Quiz
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
