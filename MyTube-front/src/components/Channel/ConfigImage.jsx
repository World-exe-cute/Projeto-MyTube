import "./ConfigImage.css";
import { useEffect, useRef, useState } from "react";

import BannerBox from "./SubChannel/BannerBox";
import PhotoBox from "./SubChannel/PhotoBox";
import CropperBox from "./SubChannel/CropperBox";
import ErrorBox from "./SubChannel/ErrorBox";

//scripts
import EventModal from "../../scripts/EventModal";

export default function ConfigImage({
  title,
  subTitle,
  text,
  imgBox,
  valuesChanged,
  valueImage,
}) {
  const inputRef = useRef();
  const cropperRef = useRef();
  const cropperErrorRef = useRef();
  const containerCropText = useRef();
  const [croppedArea, setCroppedArea] = useState(null);
  const [image, setImage] = useState(null);
  const [key, setKey] = useState(1);
  const [focus, setFocus] = useState(false);

  const [imageBanner, setImageBanner] = useState({
    tv: null,
    pc: null,
    cel: null,
  });
  const [imagePhoto, setImagePhoto] = useState(null);

  useEffect(() => {
    setImageBanner({
      tv: valueImage?.tv || null,
      pc: valueImage?.pc || null,
      cel: valueImage?.cel || null,
    });
    setImagePhoto(valueImage || null);
  }, [valueImage]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(image);
    };
  }, [image]);

  const createUrl = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  const createCropImage = async (
    imageSrc,
    pixelCrop,
    width,
    height,
    percent,
  ) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    const newImage = new Image();
    newImage.src = imageSrc;
    await new Promise((resolve) => (newImage.onload = resolve));

    let cropX;
    let cropWidth;
    if (percent[2]) {
      cropX = pixelCrop.x + pixelCrop.width * percent[2];
      cropWidth = pixelCrop.width * (percent[3] - percent[2]);
    } else {
      cropX = pixelCrop.x;
      cropWidth = pixelCrop.width;
    }
    const cropY = pixelCrop.y + pixelCrop.height * percent[0];
    const cropHeight = pixelCrop.height * (percent[1] - percent[0]);

    ctx.drawImage(
      newImage,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      width,
      height,
    );

    setKey(key + 1);

    return await new Promise((res) => {
      canvas.toBlob(res, "image/png");
    });
  };

  const cropImage = async () => {
    if (!croppedArea) return;

    if (imgBox === "Banner") {
      const tv = await createCropImage(image, croppedArea, 600, 600, [
        0,
        1.0,
        false,
      ]);
      const pc = await createCropImage(image, croppedArea, 600, 200, [
        0.3,
        0.6,
        false,
      ]);
      const cel = await createCropImage(
        image,
        croppedArea,
        400,
        200,
        [0.3, 0.6, 0.8, 0.2],
      );

      setImageBanner({ tv, pc, cel });
      hideImage("container");

      return valuesChanged((value) => ({ ...value, tv: tv, pc: pc, cel: cel }));
    } else {
      const photo = await createCropImage(image, croppedArea, 400, 400, [
        0,
        1.0,
        false,
      ]);

      setImagePhoto(photo);
      hideImage("container");

      return valuesChanged((value) => ({ ...value, photo: photo }));
    }
  };

  const showImage = (e) => {
    const image = new Image();
    image.src = URL.createObjectURL(e.target.files[0]);
    const maxSize = 10 * 1024 * 1024;
    image.onload = function () {
      if (
        image.width >= 1024 &&
        image.height >= 576 &&
        e.target.files[0].size <= maxSize
      ) {
        cropperRef.current.classList.add("show");
        setFocus(true);
        cropperRef.current.focus();
      } else {
        cropperErrorRef.current.classList.add("show");
        setFocus(true);
        cropperErrorRef.current.focus();
      }
      setTimeout(() => {
        if (imgBox === "Banner") {
          const parseWidth = parseInt(containerCropText.current.offsetWidth);
          const parseHeight = parseInt(containerCropText.current.offsetHeight);
          document.documentElement.style.setProperty(
            "--crop-width",
            parseWidth,
          );
          document.documentElement.style.setProperty(
            "--crop-height",
            parseHeight,
          );
        }
      }, 1);
    };
  };

  const hideImage = (container) => {
    if (container === "error") {
      cropperErrorRef.current.classList.remove("show");
      setFocus(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } else {
      cropperRef.current.classList.remove("show");
      setFocus(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <section id="config-image">
      <EventModal
        element={[cropperErrorRef, cropperRef]}
        input={inputRef}
        focus={{ focus, setFocus }}
      />
      <h2>{title}</h2>
      <p>{subTitle}</p>
      <div>
        {imgBox === "Banner" && (
          <BannerBox
            tv={imageBanner.tv}
            pc={imageBanner.pc}
            cel={imageBanner.cel}
          />
        )}
        {imgBox === "Photo" && <PhotoBox photo={imagePhoto} />}

        <div className="config-box">
          <section ref={cropperRef} className="cropper-section">
            {imgBox === "Banner" && (
              <>
                <h3>Personalizar arte do banner</h3>
                <div className="cropper-atention">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <p>
                    Para garantir os melhores resultados, use uma imagem com no
                    minimo 2560 X 1440 pixels.
                  </p>
                </div>
              </>
            )}
            {imgBox === "Photo" && (
              <>
                <h3>Personalizar foto</h3>
                <div></div>
              </>
            )}

            {image && (
              <CropperBox
                setCroppedArea={setCroppedArea}
                containerCropText={containerCropText}
                image={image}
                imgBox={imgBox}
              />
            )}

            <div className="box-button">
              <button
                className="submit"
                onClick={() => {
                  hideImage("container");
                }}
              >
                Cancelar
              </button>
              <button
                className="submit white"
                onClick={() => {
                  cropImage();
                }}
              >
                Pronto
              </button>
            </div>
          </section>
          <section ref={cropperErrorRef} className="cropper-error">
            {imgBox === "Banner" && (
              <ErrorBox
                title="Erro"
                errText="As imagens precisam ter pelo menos 1024 x 576 pixels e menos de 10mb"
                hideFunction={hideImage}
                inputRef={inputRef}
                cropRef={cropperErrorRef}
              />
            )}
            {imgBox === "Photo" && (
              <ErrorBox
                title="Erro"
                errText="As imagens precisam ter pelo menos 98 x 98 pixels e menos de 10mb"
                hideFunction={hideImage}
                inputRef={inputRef}
                cropRef={cropperErrorRef}
              />
            )}
          </section>
          <div className="submit-box">
            <p>{text}</p>
            <input
              type="file"
              ref={inputRef}
              accept=".jpg, .jpeg, .png, .webp"
              className="hidden"
              onChange={(e) => {
                showImage(e);
                createUrl(e);
              }}
            />
            <button
              type="button"
              className="submit"
              onClick={() => {
                inputRef.current.click();
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
