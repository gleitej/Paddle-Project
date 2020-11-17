import React, {
  Fragment,
  useState,
  useCallback,
  UseEffect,
  useEffect,
} from 'react';
import ReactCrop from 'react-image-crop';

import axios from 'axios';
import 'react-image-crop/dist/ReactCrop.css';

import { updateAddPhotos, getRiverById } from '../../actions/rivers';
import Message from '../multiFileUpdate/Message';
import Progress from '../multiFileUpdate/Progress';

export default function ImagePreview({ file, _id }) {
  // upload logic
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [message, setMessage] = useState('');

  // crop logic
  const [upImg, setUpImg] = useState();
  const [imgRef, setImgRef] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 5, aspect: 10 / 10 });
  const [previewUrl, setPreviewUrl] = useState();

  useEffect(() => {
    readFile();
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('photos', file);

    try {
      const res = await axios.put(`/api/river/update-photos/${_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        },
      });
      await updateAddPhotos(_id);
      await getRiverById(_id);
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a error.  Did you make sure to select photos?');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  // crop logic

  const readFile = () => {
    const reader = new FileReader();
    reader.addEventListener('load', async () => setUpImg(reader.result));
    reader.readAsDataURL(file);
  };

  const onLoad = useCallback((img) => {
    setImgRef(img);
  }, []);

  const makeClientCrop = async (crop) => {
    if (imgRef && crop.width && crop.height) {
      createCropPreview(imgRef, crop, 'newFile.jpeg');
    }
  };

  const createCropPreview = async (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(previewUrl);
        setPreviewUrl(window.URL.createObjectURL(blob));
      }, 'image/jpeg');
    });
  };

  return (
    <div className=''>
      {/* <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div> */}
      <ReactCrop
        src={upImg}
        onImageLoaded={onLoad}
        crop={crop}
        onChange={(c) => setCrop(c)}
        onComplete={makeClientCrop}
      />
      {previewUrl && (
        <Fragment>
          {' '}
          <input
            type='submit'
            value='Upload'
            className='btn btn-primary btn-lg'
          />{' '}
          <img alt='Crop preview' src={previewUrl} />
        </Fragment>
      )}
    </div>
  );
}
