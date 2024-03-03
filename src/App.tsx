import './App.css';
import Upload from './Components/Upload/Upload';

function App() {
  return (
    <>
    <div>
      <Upload 
        ChooseManyFiles = {false}
        ChooseImages = {false}
        ChooseAudio = {false}
        ChooseExcel = {true}
        ChoosePDF  = {false}
        ChooseVideos = {false}
        ChooseWord = {false}
        IsPreview = {true}
      />
    </div>
    </>
  )
}

export default App
