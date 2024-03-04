import React, { useRef, useState } from 'react';
import './upload.scss';
import axios from 'axios';
import Icon from '@mdi/react';
import {  mdiCloudArrowUpOutline  } from '@mdi/js';
import { mdiImage } from '@mdi/js';
import { mdiFileVideo } from '@mdi/js';
import { mdiFilePdfBox } from '@mdi/js';
import { mdiFileExcel } from '@mdi/js';
import { mdiMusicBox } from '@mdi/js';
import { mdiFileWord } from '@mdi/js';
import { mdiFileDocumentAlertOutline } from '@mdi/js';
import { mdiFileDocumentRemoveOutline } from '@mdi/js';
import { mdiLoading } from '@mdi/js';
import { mdiFileEyeOutline } from '@mdi/js';
import { mdiAlertCircleOutline } from '@mdi/js';
import { mdiCheckCircleOutline } from '@mdi/js';

interface UploadProps {
  Title:string,
  ChooseManyFiles: boolean;
  ChooseImages: boolean;
  ChooseVideos: boolean;
  ChoosePDF: boolean;
  ChooseExcel: boolean;
  ChooseAudio: boolean;
  ChooseWord: boolean;
}

const Upload: React.FC<UploadProps> = ({
  Title,
  ChooseManyFiles,
  ChooseImages,
  ChooseVideos,
  ChoosePDF,
  ChooseExcel,
  ChooseAudio,
  ChooseWord
}) => {

  const InputRef = useRef<HTMLInputElement>(null);

  const [SelectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [Images, setImages] = useState<File[]>([]);
  const [Videos, setVideos] = useState<File[]>([]);
  const [PDFs, setPDFs] = useState<File[]>([]);
  const [Excels, setExcels] = useState<File[]>([]);
  const [Audios, setAudios] = useState<File[]>([]);
  const [Words, setWords] = useState<File[]>([]);
  const [ShowErrorMessage, setShowErrorMessage ] = useState<boolean>(false);
  const [ShowPreview , setPreview] = useState<boolean>(false);
  const [SecureUrl, setSecureUrl] = useState<string>(" ");
  const [FileType , setFileType] = useState<string>(" ");
  const [PublicId , setPublicId] = useState<string>(" ");
  const [ResourceFileType, setResourceFileType] = useState<string>(" ");
  const [FilePreset, setFilePreset] = useState<string>(" ");
  const [FileIcon , setFileIcon] = useState<string>(" ");
  const [HandleState , setHandleState] = useState<string>(" ");

  const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  const allowedPDFTypes = ['application/pdf'];
  const allowedExcelTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
  const allowedWordTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  const saveFilesByType = (files: File[]) => {
    setShowErrorMessage(false);
    files.forEach(file => {
      if (ChooseImages && allowedImageTypes.includes(file.type)) {
        setImages(prevImages => [...prevImages, file]);
        setFileIcon('Image');

      } else if (ChooseVideos && allowedVideoTypes.includes(file.type)) {
        setVideos(prevVideos => [...prevVideos, file]);
        setFileIcon('Video');

      } else if (ChoosePDF && allowedPDFTypes.includes(file.type)) {
        setPDFs(prevPDFs => [...prevPDFs, file]);
        setFileIcon('Pdf');

      } else if (ChooseExcel && allowedExcelTypes.includes(file.type)) {
        setExcels(prevExcels => [...prevExcels, file]);
        setFileIcon('Excel');

      } else if (ChooseAudio && allowedAudioTypes.includes(file.type)) {
        setAudios(prevAudios => [...prevAudios, file]);
        setFileIcon('Music');

      } else if (ChooseWord && allowedWordTypes.includes(file.type)) {
        setWords(prevWords => [...prevWords, file]);
        setFileIcon('Word');

      } else {
        console.log("Invalid file:", file);
        setShowErrorMessage(true);
        setFileIcon('Err');
      }
    });
  };

  const HandleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setHandleState("Delete");
    const Files = Array.from(event.dataTransfer.files);
    if (ChooseManyFiles) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Files]);
      saveFilesByType(Files);
    } else {
      const file = Files[0];
      setSelectedFiles([file]);
      saveFilesByType([file]);
    }
  };

  const HandleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const Files = Array.from(event.target.files);
      setSelectedFiles(Files);
      saveFilesByType(Files);
      setHandleState("Delete");
      console.log(Files);
    } else {
      // Clear the input field's value
      event.target.value = '';
      setSelectedFiles([]);
      saveFilesByType([]);
    }
  };

  const HandleChooseFilesButton = () => {
    //InputRef.current?.click();
    setSelectedFiles([]);
    const FileInput = document.getElementById('file-input');
    if (FileInput) {
      FileInput.click();
    }
  };

  const UploadFiles = async(Type:string) => {
    const Data = new FormData();
    let FilesToUpload: File[] = [];
    let Preset:string = " ";
   
    switch (Type) {
      case 'image':
        FilesToUpload = Images;
        Preset = 'images_preset';
        break;
      case 'video':
        FilesToUpload = Videos;
        Preset = 'videos_preset';
        break;
      case 'audio':
        FilesToUpload = Audios;
        Preset = 'audio_preset';
        break;
      case 'pdf':
        FilesToUpload = PDFs;
        Preset = 'pdf_preset';
        break;
      case 'excel':
        FilesToUpload = Excels;
        Preset = 'excel_preset';
        break;
      case 'word':
        FilesToUpload = Words;
        Preset = 'word_preset';
        break;
      default:
        break;
    }

    FilesToUpload.forEach(file => {
      Data.append('file', file);
      Data.append('upload_preset', Preset);
    });

    try {
      //let CloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      let ResourceType:string;
      if(Type === 'image'){
        ResourceType = 'image';
      }else if(Type === 'video'){
        ResourceType = 'video'
      }else{
        ResourceType = 'raw';
      }
      let Api = `https://api.cloudinary.com/v1_1/dtsmgh4yv/${ResourceType}/upload`;

      const Res = await axios.post(Api , Data);
      const {secure_url , public_id} = Res.data;

      setFileType(Type);
      setSecureUrl(secure_url);
      setPublicId(public_id);
      setResourceFileType(ResourceType);
      setFilePreset(Preset);
      console.log(secure_url);
      return secure_url;

    } catch (error) {
      console.error(error);
    }
  }

  const Preview = async() => {
    const CloudinaryUrl:any = SecureUrl;
    setPreview(true);
    try {
      if(CloudinaryUrl){
        const Image = document.createElement('img');
        Image.src = CloudinaryUrl;
        Image.alt = 'Uploaded Image';
    
        const ImageContainer = document.getElementById('image-container');
        if(ImageContainer){
          ImageContainer.appendChild(Image);
        } else {
          console.error("Image container not found");
        }
       } else {
        console.error("Cloudinary URL is invalid");
       }
    } catch (error) {
      console.error(error);
    }
  }  

  const HandlePreview = () => {
    if(!ShowPreview && SecureUrl){
      Preview();
      setPreview(true);
    }
    Preview();
  }

  const HandleUploadButton = async(event: React.MouseEvent<HTMLButtonElement , MouseEvent>) => {
    event.preventDefault();
    try {
      setHandleState("Uploading");

      if(ChooseImages){
        const ImageUrl = await UploadFiles('image');
      }else if(ChooseVideos){
        const VideoUrl = await UploadFiles('video');
      }
      else if(ChooseAudio){
        const AudioUrl = await UploadFiles('audio');
      }
      else if(ChoosePDF){
        const PDFUrl = await UploadFiles('pdf');
      }
      else if(ChooseExcel){
        const ExcelUrl = await UploadFiles('excel');
      }else if(ChooseWord){
        const WordUrl = await UploadFiles('word');
      }

      console.log("Upload Success");
      setImages([]);
      setVideos([]);
      setPDFs([]);
      setExcels([]);
      setAudios([]);
      setWords([]);
      setHandleState("Done");

    } catch (error) {
      console.error(error);
    }
  }

  const HandleCancelButton = () => {
    setSelectedFiles([]);
    setImages([]);
    setVideos([]);
    setPDFs([]);
    setExcels([]);
    setAudios([]);
    setWords([]);
    setPreview(false);
    setFilePreset(" ");
    setFileType(" ");
    setResourceFileType(" ")
    setSecureUrl(" ");
    setHandleState(" ");
  }

  const HandleDeletelButton = async() => {

    const File:string  = FileType;
    const ResourceType:string  = ResourceFileType;
    let Preset:string = FilePreset;

    console.log(File);
    console.log(ResourceType);
    console.log(Preset);
    try {
  
      // Extract public_id from secure_url
      const publicId:string = SecureUrl.split("/upload/")[1].split("/")[1];

      const Api:string = `https://api.cloudinary.com/v1_1/dtsmgh4yv/${ResourceType}/upload/${publicId}`;

      console.log(Api);
  
      // Delete the file from Cloudinary
      await axios.delete(Api, {
        params: {
          upload_preset:Preset // Specify the upload preset used for these files
        }
      });
  
      // Clear uploaded files and preview
      setImages([]);
      setVideos([]);
      setPDFs([]);
      setExcels([]);
      setAudios([]);
      setWords([]);
      //setPreview(false);
      setFilePreset(" ");
      setFileType(" ");
      setResourceFileType(" ")
    } catch (error) {
      console.error(error);
     
    }
  }

  const HandleEditButton = () => {

  }

  //console.log(SelectedFiles);

  return (
    <div>
      <div className='upload-files' onDrop={HandleDrop} onDragOver={(e) => e.preventDefault()}>
        <div className='content' >
          <div>
              <div>
                <button className="upload-button-area" onClick={HandleChooseFilesButton}>
                  <Icon path={mdiCloudArrowUpOutline} size={2}/> {Title}
                </button>
                <input ref={InputRef} id="file-input" type="file" onChange={HandleFileInputChange} multiple={ChooseManyFiles} style={{ display: 'none' }} />
              </div>              
          </div>
          <div>
          {SelectedFiles.length > 0 && !ShowErrorMessage ? SelectedFiles.map((file, index) => (
               <div className='file-card' key={index} >
                  <div className='file-icon'>
                    {FileIcon === 'Image' ? (
                      < Icon path={mdiImage} size={1.5} />
                      ) : FileIcon === 'Video' ? (
                        <Icon path={mdiFileVideo} size={1.5} />
                      ) : FileIcon === 'Pdf' ? (
                        <Icon path={mdiFilePdfBox} size={1.5} />
                      ) : FileIcon === 'Excel' ? (
                        <Icon path={mdiFileExcel} size={1.5} />
                      ) : FileIcon === 'Music' ? (
                        <Icon path={mdiMusicBox} size={1.5} />
                      ) : FileIcon === 'Word' ? (
                        <Icon path={mdiFileWord} size={1.5} />
                      ) : FileIcon === 'Err' ? (
                        <Icon path={mdiFileDocumentAlertOutline} size={1} />
                      ) : " "
                    }
                  </div>
                  <div className='file-details'>
                    <div className='file-name'>
                      <span>{file.name}</span>
                    </div>
                    <div className='state-icon'>
                      {HandleState  === "Delete" ? (
                        <div className='icon-animation' onClick={HandleCancelButton}>
                          <Icon path={mdiFileDocumentRemoveOutline } size={1.5}  color="#b80000" /> 
                        </div>
                      ) : HandleState === "Uploading" ? (
                        <Icon path={mdiLoading} size={1.5} spin   /> 
                      ) : HandleState === "Done" && FileType === "image" ? (
                        <div className='icon-animation' onClick={HandlePreview}>
                          <Icon path={mdiFileEyeOutline} size={1.5} />
                        </div>
                      ) : HandleState === "Done" && FileType != "image" ? (
                        <Icon path={mdiCheckCircleOutline} size={1.5} />
                      ) : " "}
                    </div>
                  </div>
              </div>
            )) : SelectedFiles.length > 0 && ShowErrorMessage ? (
              <div className='file-card error-box'>
                <div className='file-icon'>
                  <Icon path={mdiAlertCircleOutline} size={1.5} color="#b80000"  />
                </div>
                  <div className='file-details'>
                    <div className='file-name'>
                        <span className='error-text'>Invalid file type</span>
                    </div>
                  </div>
              </div>
            ) : " "
          } 
          </div>
        </div>
        <div className='function-buttons'>
          {SelectedFiles.length > 0 && HandleState != "Done" && !ShowErrorMessage ?( 
                <button type='button' onClick={HandleUploadButton} className='upload-button'>Upload</button>
             ) : HandleState === 'Done' ? ( 
              <div className='handel-done-upload'>
                <button type='button' onClick={HandleDeletelButton} className='delete-button'>Delete</button>
                <button type='button' onClick={HandleEditButton} className='edit-button'>Edit</button>
                <button type='button' onClick={HandleCancelButton} className='done-button'>Done</button>
              </div>
             ) : SelectedFiles.length > 0 && HandleState != "Done" && ShowErrorMessage ? (
                <button type='button' onClick={HandleCancelButton} className='remove-file-button'>Remove File</button>
             ) : " "  
            }
        </div>
        {ShowPreview &&
        <div className='preview-container'>
            <div className='image-container' id='image-container'></div>
            <button type='button' onClick={HandleCancelButton} className='done-button'>Cansel</button>
        </div>
        }
      </div>
    </div>
  );
};

export default Upload;
