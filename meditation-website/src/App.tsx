import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Tools from './pages/Tools'
import About from './pages/About'
import LearnChapter from './pages/LearnChapter'
import BreathingTool from './tools/BreathingTool'
import FocusTool from './tools/FocusTool'
import RelaxationTool from './tools/RelaxationTool'
import MeditationTool from './tools/MeditationTool'
import TimerTool from './tools/TimerTool'
import AmbientTool from './tools/AmbientTool'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="learn" element={<Learn />}>
            <Route path=":chapter" element={<LearnChapter />} />
          </Route>
          <Route path="tools" element={<Tools />}>
            <Route path="breathing" element={<BreathingTool />} />
            <Route path="focus" element={<FocusTool />} />
            <Route path="relaxation" element={<RelaxationTool />} />
            <Route path="meditation" element={<MeditationTool />} />
            <Route path="timer" element={<TimerTool />} />
            <Route path="ambient" element={<AmbientTool />} />
          </Route>
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
