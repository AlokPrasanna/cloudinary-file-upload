import './App.css';
import Upload from './Components/Upload/Upload';

function App() {
  return (
    <>
    <div>
      <Upload 
        Title={'Upload Image'}
        ChooseManyFiles = {false}
        ChooseImages = {true}
        ChooseAudio = {false}
        ChooseExcel = {false}
        ChoosePDF  = {false}
        ChooseVideos = {false}
        ChooseWord = {false}
      />
    </div>
    </>
  )
}

export default App
