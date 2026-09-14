import "./CropperBox.css";
import { useState, useCallback, useRef } from "react";

import Cropper from "react-easy-crop";

export default function CropperBox({
  setCroppedArea,
  containerCropText,
  image,
  imgBox,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const cropBanner = useRef();
  const cropPhoto = useRef();

  const showCropper = (local) => {
    switch (local) {
      case "tv":
        cropBanner.current.classList.add("activeTv");
        cropBanner.current.classList.remove("activePc");
        cropBanner.current.classList.remove("activeCel");
        return;
      case "pc":
        cropBanner.current.classList.add("activePc");
        cropBanner.current.classList.remove("activeTv");
        cropBanner.current.classList.remove("activeCel");
        return;
      case "cel":
        cropBanner.current.classList.add("activeCel");
        cropBanner.current.classList.remove("activeTv");
        cropBanner.current.classList.remove("activePc");
        return;
      default:
        cropBanner.current.classList.remove("activeTv");
        cropBanner.current.classList.remove("activePc");
        cropBanner.current.classList.remove("activeCel");
        return;
    }
  };

  const cropComplete = useCallback((_, croppedArea) => {
    setCroppedArea(croppedArea);

    if (imgBox === "Banner") {
      const queryCropper = cropBanner.current.children[0].querySelector("div");

      containerCropText.current.style.width = `${queryCropper.offsetWidth}px`;
      containerCropText.current.style.height = `${queryCropper.offsetHeight}px`;
    }
  }, []);

  return (
    <>
      {imgBox === "Banner" ? (
        <div ref={cropBanner} className="crop-banner">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={2 / 1.3}
            cropShape="rect"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={cropComplete}
          />
          <div ref={containerCropText} className="container-cropper-text">
            <div
              className="tv"
              onMouseEnter={() => {
                showCropper("tv");
              }}
              onMouseLeave={() => {
                showCropper("");
              }}
            >
              TV
            </div>
            <div
              className="pc"
              onMouseEnter={() => {
                showCropper("pc");
              }}
              onMouseLeave={() => {
                showCropper("");
              }}
            >
              Computador
            </div>
            <div
              className="cel"
              onMouseEnter={() => {
                showCropper("cel");
              }}
              onMouseLeave={() => {
                showCropper("");
              }}
            >
              Todos os dispositivos
            </div>
          </div>
        </div>
      ) : (
        <div ref={cropPhoto} className="crop-photo">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="rect"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={cropComplete}
          />
        </div>
      )}
    </>
  );
}
