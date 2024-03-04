import './App.css';
import Upload from './Components/Upload/Upload';

function App() {
  return (
    <>
    <div>
      <Upload 
        Title={'Upload PDF'}
        ChooseManyFiles = {false}
        ChooseImages = {false}
        ChooseAudio = {false}
        ChooseExcel = {false}
        ChoosePDF  = {true}
        ChooseVideos = {false}
        ChooseWord = {false}
      />
    </div>
    </>
  )
}

export default App
